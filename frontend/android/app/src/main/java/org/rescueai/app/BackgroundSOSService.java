package org.rescueai.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class BackgroundSOSService extends Service {

    private static final String TAG = "BackgroundSOSService";
    private static final String CHANNEL_ID = "rescueai_background_channel";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Background SOS Service Started");

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("RescueAI Background Emergency Guard")
                .setContentText("Listening for 3x Hardware Power Button SOS...")
                .setSmallIcon(android.R.drawable.stat_notify_error)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .build();

        startForeground(1001, notification);

        if (intent != null && "TRIGGER_BACKGROUND_SOS".equals(intent.getAction())) {
            dispatchBackgroundSOSPayload();
        }

        return START_STICKY;
    }

    private void dispatchBackgroundSOSPayload() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.w(TAG, "Sending Background SOS Payload to RescueAI Cloud Firestore...");
                    // Post to Render FastAPI / Firebase HTTP REST endpoint
                    URL url = new URL("https://frontend-flame-two-34.vercel.app/api/sos/sync");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setDoOutput(true);

                    String jsonInputString = "{"
                            + "\"category\":\"BACKGROUND HARDWARE 3X POWER SOS\","
                            + "\"description\":\"🚨 EMERGENCY DISPATCH TRIGGERED FROM BACKGROUND WHILE APP WAS CLOSED!\","
                            + "\"priority\":\"CRITICAL\","
                            + "\"latitude\":12.9716,"
                            + "\"longitude\":77.5946,"
                            + "\"peopleCount\":1,"
                            + "\"medicalNeeds\":true"
                            + "}";

                    try (OutputStream os = conn.getOutputStream()) {
                        byte[] input = jsonInputString.getBytes("utf-8");
                        os.write(input, 0, input.length);
                    }

                    int code = conn.getResponseCode();
                    Log.d(TAG, "Background SOS Dispatch Response Code: " + code);
                } catch (Exception e) {
                    Log.e(TAG, "Error in Background SOS dispatch:", e);
                }
            }
        }).start();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "RescueAI Emergency Guard",
                    NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

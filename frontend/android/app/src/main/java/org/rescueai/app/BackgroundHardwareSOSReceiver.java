package org.rescueai.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;

public class BackgroundHardwareSOSReceiver extends BroadcastReceiver {

    private static final String TAG = "BackgroundSOSReceiver";
    private static int pressCount = 0;
    private static long lastPressTime = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getAction() == null) return;

        String action = intent.getAction();
        Log.d(TAG, "Hardware Broadcast Received: " + action);

        long now = SystemClock.elapsedRealtime();

        if (Intent.ACTION_SCREEN_OFF.equals(action) || 
            Intent.ACTION_SCREEN_ON.equals(action) || 
            Intent.ACTION_MEDIA_BUTTON.equals(action)) {

            if (now - lastPressTime < 1500 || pressCount == 0) {
                pressCount++;
                lastPressTime = now;

                if (pressCount >= 3) {
                    pressCount = 0;
                    Log.w(TAG, "3x Hardware Power Button Triggered in Background!");
                    Toast.makeText(context, "🚨 RescueAI: Background 3x Hardware Power SOS Dispatched!", Toast.LENGTH_LONG).show();

                    // Launch Background SOS Dispatch Intent
                    Intent sosIntent = new Intent(context, BackgroundSOSService.class);
                    sosIntent.setAction("TRIGGER_BACKGROUND_SOS");
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        context.startForegroundService(sosIntent);
                    } else {
                        context.startService(sosIntent);
                    }
                }
            } else {
                pressCount = 1;
                lastPressTime = now;
            }
        }
    }
}

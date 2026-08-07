import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { SyncProvider } from "@/context/SyncContext";
import { OfflineSyncBanner } from "@/components/common/OfflineSyncBanner";
import { PWARegister } from "@/components/common/PWARegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "RescueAI - AI-Powered Disaster Response & Emergency Coordination Platform",
  description: "Offline-First AI-powered disaster response and emergency coordination platform for IEEE Hack Genesis 2026",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RescueAI",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
        <AuthProvider>
          <SyncProvider>
            <OfflineSyncBanner />
            <PWARegister />
            {children}
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

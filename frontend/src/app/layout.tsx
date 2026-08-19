import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { SyncProvider } from "@/context/SyncContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OfflineSyncBanner } from "@/components/common/OfflineSyncBanner";
import { PWARegister } from "@/components/common/PWARegister";
<<<<<<< HEAD
import "./globals.css";

export const metadata: Metadata = {
  title: "RescueAI - AI-Powered Disaster Response & Emergency Coordination Platform",
  description: "Offline-First AI-powered disaster response and emergency coordination platform for IEEE Hack Genesis 2026",
  manifest: "/manifest.json",
=======
import { SEOJsonLd } from "@/components/common/SEOJsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rescueai.org"),
  title: {
    default: "RescueAI — AI-Powered Disaster Response & Emergency Platform",
    template: "%s | RescueAI National Emergency Grid",
  },
  description:
    "Offline-first disaster response PWA enabling citizens to send 1-tap SOS distress signals with satellite GPS lock, AI severity triage, and evacuation shelter booking.",
  keywords: [
    "RescueAI",
    "Disaster Response",
    "Emergency SOS",
    "AI Severity Triage",
    "Offline PWA",
    "Evacuation Shelters",
    "Mesh Communication",
    "National Emergency Coordination",
  ],
  authors: [{ name: "RootNode Rebels Command", url: "https://rescueai.org" }],
  creator: "RescueAI Team",
  publisher: "RescueAI National Coordination Platform",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "RescueAI — AI-Powered Disaster Response & Emergency Platform",
    description:
      "Send 1-tap SOS alerts, access offline evacuation maps, and coordinate real-time disaster response with Gemini AI.",
    url: "https://rescueai.org",
    siteName: "RescueAI Portal",
    images: [
      {
        url: "https://rescueai.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "RescueAI Emergency Command Center Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RescueAI — AI-Powered Disaster Response Platform",
    description:
      "Send 1-tap SOS distress signals and access offline emergency shelters & Bluetooth mesh tools.",
    creator: "@RescueAICommand",
    images: ["https://rescueai.org/og-image.png"],
  },
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
<<<<<<< HEAD
    title: "RescueAI",
=======
    title: "RescueAI Platform",
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
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
      <body className="antialiased font-sans selection:bg-red-500 selection:text-white">
<<<<<<< HEAD
=======
        <SEOJsonLd />
>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)
        <AuthProvider>
          <ThemeProvider>
            <SyncProvider>
              <OfflineSyncBanner />
              <PWARegister />
              {children}
            </SyncProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
<<<<<<< HEAD
=======

>>>>>>> d3f869c (feat: complete RescueAI platform with pure white monochrome UI, OTP auth fix, real-time shelter spot decrementing, printable evacuation pass invoice, mobile map coordinate accuracy fix, Next.js 15 SEO metadata, and social link preview hub)

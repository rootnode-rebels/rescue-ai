"use client";

import React from "react";

export const SEOJsonLd: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EmergencyService",
        "@id": "https://rescueai.org/#service",
        "name": "RescueAI Disaster Response & Emergency Coordination",
        "url": "https://rescueai.org",
        "logo": "https://rescueai.org/icon.png",
        "description": "Offline-first AI emergency response platform enabling citizens to send 1-tap SOS distress alerts, AI severity triage, and evacuation shelter booking.",
        "areaServed": "National Emergency Grid",
        "serviceType": "Disaster Response & Emergency Coordination",
        "telecom": "+91 98765 43210",
        "availableLanguage": ["English", "Kannada", "Hindi"]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://rescueai.org/#app",
        "name": "RescueAI Mobile PWA",
        "operatingSystem": "Android, iOS, Web",
        "applicationCategory": "HealthApplication, EmergencyApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

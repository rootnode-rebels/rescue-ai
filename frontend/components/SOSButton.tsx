import React, { useState, useEffect } from 'react';
import { addPendingSOS, getAllPendingSOS, deletePending } from '../lib/indexeddb';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';

function genLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
}

export default function SOSButton({ user }: { user?: any }) {
  const [pending, setPending] = useState(0);
  useEffect(() => {
    async function load() {
      const items = await getAllPendingSOS();
      setPending(items.length);
    }
    load();
    window.addEventListener('online', trySyncPending);
    return () => window.removeEventListener('online', trySyncPending);
  }, []);

  async function trySyncPending() {
    if (!navigator.onLine) return;
    const items = await getAllPendingSOS();
    for (const it of items) {
      try {
        const res = await fetch(`${BACKEND}/api/v1/sos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(it.payload)
        });
        if (res.ok) {
          await deletePending(it.local_id);
        } else {
          console.warn('Sync failed', await res.text());
        }
      } catch (e) {
        console.warn('Sync exception', e);
      }
    }
    const newItems = await getAllPendingSOS();
    setPending(newItems.length);
  }

  async function sendSOS() {
    const local_id = genLocalId();
    // collect location
    let loc = { lat: null, lng: null, accuracy: null, source: 'none' };
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 7000 });
      });
      loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, source: 'gps' };
    } catch (e) {
      console.warn('GPS failed', e);
    }
    const payload = {
      local_id,
      user_id: user?.uid || 'guest',
      device_id: navigator.userAgent + '-' + local_id,
      description: 'SOS - urgent assistance needed',
      structured_fields: {},
      location: loc,
      created_at: new Date().toISOString()
    };

    if (!navigator.onLine) {
      await addPendingSOS({ local_id, payload });
      setPending((p) => p + 1);
      alert('You are offline. SOS stored locally and will be synced automatically.');
      return;
    }

    // attempt send
    try {
      const res = await fetch(`${BACKEND}/api/v1/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('SOS sent. Help is being notified.');
      } else {
        // fallback save
        await addPendingSOS({ local_id, payload });
        setPending((p) => p + 1);
        alert('Temporary error sending. Saved locally for retry.');
      }
    } catch (e) {
      await addPendingSOS({ local_id, payload });
      setPending((p) => p + 1);
      alert('Network error. Saved locally for retry.');
    }
  }

  return (
    <div className="fixed bottom-6 right-6">
      <button onClick={sendSOS} className="bg-red-600 text-white p-6 rounded-full shadow-xl text-2xl">
        SOS
      </button>
      <div className="text-right mt-2 text-sm">Pending: {pending}</div>
    </div>
  );
}

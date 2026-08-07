"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getPendingOfflineSOS, db } from "@/lib/dexie-db";
import { SyncStatus, SOSRequest } from "@/types";

interface SyncContextType {
  syncStatus: SyncStatus;
  isOnline: boolean;
  triggerManualSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pendingCount: 0,
    isSyncing: false,
    lastSyncedAt: null,
    error: null,
  });

  const checkPendingCount = useCallback(async () => {
    try {
      const pendingItems = await getPendingOfflineSOS();
      setSyncStatus((prev) => ({ ...prev, pendingCount: pendingItems.length }));
    } catch (err) {
      console.warn("Error reading pending offline items:", err);
    }
  }, []);

  const executeAutoSync = useCallback(async () => {
    try {
      const pendingItems: SOSRequest[] = await getPendingOfflineSOS();
      if (pendingItems.length === 0) return;

      setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));

      const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://rescueai-backend-3u2o.onrender.com/api";

      const response = await fetch(`${backendUrl}/sos/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: pendingItems }),
      });

      if (response.ok) {
        // Clear synced items from Dexie IndexedDB
        for (const item of pendingItems) {
          await db.sosRequests.delete(item.id);
        }

        const now = new Date().toLocaleTimeString();
        setSyncStatus({
          pendingCount: 0,
          isSyncing: false,
          lastSyncedAt: now,
          error: null,
        });
      } else {
        throw new Error("FastAPI sync endpoint returned an error status.");
      }
    } catch (err) {
      console.warn("Offline Auto-Sync network error:", err);
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        error: "Sync failed. Will retry automatically when connection stabilizes.",
      }));
    }
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    checkPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      executeAutoSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      checkPendingCount();
    }, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [checkPendingCount, executeAutoSync]);

  const value: SyncContextType = {
    syncStatus,
    isOnline,
    triggerManualSync: executeAutoSync,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export function useSyncContext(): SyncContextType {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSyncContext must be used within a SyncProvider");
  }
  return context;
}

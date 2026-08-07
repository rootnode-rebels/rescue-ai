"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { useSync } from "@/hooks/useSync";

export const OfflineSyncBanner: React.FC = () => {
  const { isOnline, syncStatus, triggerManualSync } = useSync();

  if (isOnline && syncStatus.pendingCount === 0 && !syncStatus.isSyncing) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full bg-amber-500 text-slate-950 font-sans border-b border-amber-600 shadow-md py-2.5 px-4 z-50 sticky top-0"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <>
                <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>OFFLINE MODE ACTIVE: Requests will save locally to IndexedDB &amp; auto-sync when network connects.</span>
              </>
            ) : syncStatus.isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 text-slate-950 animate-spin" />
                <span>SYNCHRONIZING {syncStatus.pendingCount} OFFLINE SOS REQUESTS WITH FIREBASE COMMAND...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-slate-950" />
                <span>{syncStatus.pendingCount} offline SOS request(s) stored locally. Ready for sync.</span>
              </>
            )}
          </div>

          {isOnline && syncStatus.pendingCount > 0 && !syncStatus.isSyncing && (
            <button
              onClick={triggerManualSync}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-[11px] uppercase tracking-wider transition-colors shadow-xs"
            >
              Sync Now
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

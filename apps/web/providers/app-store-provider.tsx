'use client'

import { useStore } from "zustand";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AppStore, createAppStore, StoreState } from "@/store/app-store";
import { Entry } from "@/types/entry";
import { getEntries, syncEntries } from "@/app/actions/journal";
import { useUser } from "@clerk/nextjs";

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState<AppStore>(createAppStore);

  return (
    <AppStoreContext.Provider value={store}>
      <AppStoreSync />
      {children}
    </AppStoreContext.Provider>
  );
}

function AppStoreSync() {
  const { isSignedIn } = useUser();
  const entries = useAppStore((state) => state.entries);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const setEntries = useAppStore((state) => state.setEntries);
  const readyToSync = useRef(false);

  useEffect(() => {
    readyToSync.current = false;

    if (!isSignedIn || !hasHydrated) return;

    let cancelled = false;

    getEntries()
      .then((serverEntries) => {
        if (cancelled) return;

        const normalizedEntries = serverEntries.map((entry) => ({
          ...entry,
          created_at: new Date(entry.created_at),
        })) as Entry[];

        setEntries(normalizedEntries);
        readyToSync.current = true;
      })
      .catch((error) => {
        console.error("Failed to load entries", error);
      });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isSignedIn, setEntries]);

  useEffect(() => {
    if (!readyToSync.current || !isSignedIn) return;

    const timeout = window.setTimeout(() => {
      syncEntries(entries).catch((error) => {
        console.error("Failed to sync entries", error);
      });
    }, 750);

    return () => window.clearTimeout(timeout);
  }, [entries, isSignedIn]);

  return null;
}

export function useAppStore<T>(selector: (store: StoreState) => T): T {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }

  return useStore(context, selector);
}
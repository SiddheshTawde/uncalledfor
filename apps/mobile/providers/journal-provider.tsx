import AsyncStorage from "@react-native-async-storage/async-storage"
import { createApiClient, type ApiClient } from "@workspace/api-client"
import { createJSONStorage } from "zustand/middleware"
import { useAuth } from "@clerk/clerk-expo"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useStore } from "zustand"
import {
  createAppStore,
  type AppStore,
  type StoreState,
} from "@workspace/store"

const JournalContext = createContext<{
  store: AppStore
  api: ApiClient
} | null>(null)

export function JournalProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const [store] = useState(() =>
    createAppStore(
      {},
      {
        storage: createJSONStorage(() => AsyncStorage),
        devtoolsEnabled: false,
      }
    )
  )
  const [api] = useState(() =>
    createApiClient({
      baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
      getToken,
    })
  )
  const entries = useStore(store, (state) => state.entries)
  const hasHydrated = useStore(store, (state) => state.hasHydrated)
  const setEntries = useStore(store, (state) => state.setEntries)
  const readyToSync = useRef(false)

  useEffect(() => {
    readyToSync.current = false
    if (!isSignedIn || !hasHydrated) return

    let cancelled = false
    api
      .getEntries()
      .then((serverEntries) => {
        if (cancelled) return
        setEntries(serverEntries)
        readyToSync.current = true
      })
      .catch((error) => console.error("Failed to load entries", error))

    return () => {
      cancelled = true
    }
  }, [api, hasHydrated, isSignedIn, setEntries])

  useEffect(() => {
    if (!readyToSync.current || !isSignedIn) return

    const timeout = setTimeout(() => {
      api.syncEntries({ entries }).catch((error) => {
        console.error("Failed to sync entries", error)
      })
    }, 750)

    return () => clearTimeout(timeout)
  }, [api, entries, isSignedIn])

  return (
    <JournalContext.Provider value={{ store, api }}>
      {children}
    </JournalContext.Provider>
  )
}

export function useJournal<T>(selector: (state: StoreState) => T): T {
  const context = useContext(JournalContext)
  if (!context) throw new Error("useJournal must be used within JournalProvider")
  return useStore(context.store, selector)
}

export function useJournalApi() {
  const context = useContext(JournalContext)
  if (!context) throw new Error("useJournalApi must be used within JournalProvider")
  return context.api
}

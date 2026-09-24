import { createStore } from "zustand/vanilla"
import { devtools, persist } from "zustand/middleware"
import { Entry } from "@/types/entry"

export type EntriesState = {
  entries: Entry[]
  hasHydrated: boolean
}

export type EntriesActions = {
  setEntries: (entries: Entry[]) => void
  setHasHydrated: (state: boolean) => void
}

export type EntriesStore = EntriesState & EntriesActions

const defaultInitState: EntriesState = {
  entries: [],
  hasHydrated: false,
}

export const createEntriesStore = (
  initState: EntriesState = defaultInitState
) => {
  return createStore<EntriesStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setEntries: (entries) => set(() => ({ entries })),
          setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
          name: "uncalled-for-entries",
          onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true)
          },
        }
      ),
      {
        name: "uncalled-for-entries",
        enabled: process.env.NODE_ENV !== "production", // Disable in prod for performance
      }
    )
  )
}

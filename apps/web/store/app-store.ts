import { createStore } from "zustand/vanilla"
import { devtools, persist } from "zustand/middleware"
import { Entry } from "@/types/entry"

export type Page = "journal" | "entries"

export type EntriesSlice = {
  entries: Entry[]
  setEntries: (entries: Entry[]) => void
}

export type NavigationSlice = {
  page: Page
  setPage: (page: Page) => void
}

export type StoreState = EntriesSlice &
  NavigationSlice & {
    hasHydrated: boolean
    setHasHydrated: (state: boolean) => void
  }

const defaultInitState: Omit<
  StoreState,
  "setEntries" | "setPage" | "setHasHydrated"
> = {
  entries: [],
  page: "journal",
  hasHydrated: false,
}

export const createAppStore = (
  initState: Partial<typeof defaultInitState> = defaultInitState
) => {
  return createStore<StoreState>()(
    devtools(
      persist(
        (set) => ({
          ...defaultInitState,
          ...initState,
          setEntries: (entries) => set({ entries }),
          setPage: (page) => set({ page }),
          setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
          name: "uncalled-for",
          onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true)
          },
        }
      ),
      {
        name: "uncalled-for",
        enabled: process.env.NODE_ENV !== "production",
      }
    )
  )
}

export type AppStore = ReturnType<typeof createAppStore>

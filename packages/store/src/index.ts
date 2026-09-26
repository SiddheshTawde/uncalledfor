import { createStore } from "zustand/vanilla"
import {
  devtools,
  persist,
  type PersistStorage,
} from "zustand/middleware"
import type { Entry } from "@workspace/domain"

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

export type StoreOptions = {
  storage?: PersistStorage<StoreState>
  name?: string
  devtoolsEnabled?: boolean
}

export const createAppStore = (
  initState: Partial<typeof defaultInitState> = defaultInitState,
  options: StoreOptions = {}
) => {
  const persisted = persist<StoreState>(
    (set) => ({
      ...defaultInitState,
      ...initState,
      setEntries: (entries: Entry[]) => set({ entries }),
      setPage: (page: Page) => set({ page }),
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: options.name ?? "uncalled-for",
      ...(options.storage ? { storage: options.storage } : {}),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )

  return createStore<StoreState>()(
    devtools(persisted, {
      name: "uncalled-for",
      enabled: options.devtoolsEnabled ?? true,
    })
  )
}

export type AppStore = ReturnType<typeof createAppStore>

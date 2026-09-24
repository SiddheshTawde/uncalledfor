import { createStore } from "zustand/vanilla"
import { devtools, persist } from "zustand/middleware"

export type Page = "journal" | "entries"

export type NavigationState = {
  page: Page
  hasHydrated: boolean
}

export type NavigationActions = {
  setPage: (page: Page) => void
  setHasHydrated: (state: boolean) => void
}

export type NavigationStore = NavigationState & NavigationActions

const defaultInitState: NavigationState = {
  page: "journal",
  hasHydrated: false,
}

export const createNavigationStore = (
  initState: NavigationState = defaultInitState
) => {
  return createStore<NavigationStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setPage: (page) => set(() => ({ page })),
          setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
          name: "uncalled-for-navigation",
          onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true)
          },
        }
      ),
      {
        name: "uncalled-for-navigation",
        enabled: process.env.NODE_ENV !== "production", // Disable in prod for performance
      }
    )
  )
}

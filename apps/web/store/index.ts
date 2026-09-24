import { create } from "zustand/react"
import { devtools, persist } from "zustand/middleware"
import { Entry } from "@/types/entry"

export type Page = "journal" | "entries"

export type ZustandState = {
  page: Page
  entries: Entry[]
}

export type ZustandActions = {
  setPage: (page: Page) => void
  updateEntries: (entries: Entry[]) => void
}

export type ZustandStore = ZustandState & ZustandActions

const defaultInitState: ZustandState = {
  page: "journal",
  entries: [],
}

const createStore = (initState: ZustandState = defaultInitState) => {
  return create<ZustandStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setPage: (page) => set(() => ({ page })),
          updateEntries: (entries) => set(() => ({ entries })),
        }),
        { name: "uncalled-for" }
      ),
      {
        name: "uncalled-for",
        enabled: process.env.NODE_ENV !== "production", // Disable in prod for performance
      }
    )
  )
}

export const useStore = createStore()

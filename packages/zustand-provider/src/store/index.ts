import { createStore } from "zustand/vanilla"

export type ZustandState = {
  count: number
}

export type ZustandActions = {
  decrementCount: () => void
  incrementCount: () => void
}

export type ZustandStore = ZustandState & ZustandActions

export const defaultInitState: ZustandState = {
  count: 0,
}

export const createZustandStore = (
  initState: ZustandState = defaultInitState
) => {
  return createStore<ZustandStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }))
}

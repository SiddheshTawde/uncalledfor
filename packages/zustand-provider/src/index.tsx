'use client'

import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore } from 'zustand'

import { type ZustandStore, createZustandStore } from './store/index.js'

export type ZustandApi = ReturnType<typeof createZustandStore>

export const ZustandContext = createContext<ZustandApi | undefined>(undefined)

export interface ZustandProviderProps {
    children: ReactNode
}

export const ZustandProvider = ({ children }: ZustandProviderProps) => {
    const [store] = useState(() => createZustandStore())
    return <ZustandContext.Provider value={store}>{children}</ZustandContext.Provider>
}

export const useZustand = <T,>(selector: (store: ZustandStore) => T): T => {
    const ZustandContext = useContext(ZustandContext)
    if (!ZustandContext) {
        throw new Error(`useZustand must be used within ZustandProvider`)
    }

    return useStore(ZustandContext, selector)
}
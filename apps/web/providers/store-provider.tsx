'use client'

import { useStore } from 'zustand'
import { createContext, useContext, useState, ReactNode } from 'react'
import { AppStore, createAppStore, StoreState } from '@/store'

const StoreContext = createContext<AppStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState<AppStore>(createAppStore)
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

export function useAppStore<T>(selector: (store: StoreState) => T): T {
    const context = useContext(StoreContext)
    if (!context) throw new Error('useAppStore must be used within StoreProvider')
    return useStore(context, selector)
}
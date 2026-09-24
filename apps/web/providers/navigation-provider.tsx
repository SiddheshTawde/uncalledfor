'use client'

import { useStore } from 'zustand'
import { createContext, useContext, useRef, ReactNode } from 'react'
import { createNavigationStore, NavigationStore } from '@/store'

const NavigationStoreContext = createContext<ReturnType<typeof createNavigationStore> | null>(null)

export function NavigationStoreProvider({ children }: { children: ReactNode }) {
    const storeRef = useRef<ReturnType<typeof createNavigationStore>>(null)
    if (!storeRef.current) {
        storeRef.current = createNavigationStore()
    }
    return (
        <NavigationStoreContext.Provider value={storeRef.current}>
            {children}
        </NavigationStoreContext.Provider>
    )
}

export function useNavigationStore<T>(selector: (store: NavigationStore) => T): T {
    const context = useContext(NavigationStoreContext)
    if (!context) throw new Error('useNavigationStore must be used within NavigationStoreProvider')
    return useStore(context, selector)
}
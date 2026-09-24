'use client'

import { useStore } from 'zustand'
import { createContext, useContext, useRef, ReactNode } from 'react'
import { createEntriesStore, EntriesStore } from '@/store/entries'

const EntriesStoreContext = createContext<ReturnType<typeof createEntriesStore> | null>(null)

export function EntriesStoreProvider({ children }: { children: ReactNode }) {
    const storeRef = useRef<ReturnType<typeof createEntriesStore>>(null)
    if (!storeRef.current) {
        storeRef.current = createEntriesStore()
    }
    return (
        <EntriesStoreContext.Provider value={storeRef.current}>
            {children}
        </EntriesStoreContext.Provider>
    )
}

export function useEntriesStore<T>(selector: (store: EntriesStore) => T): T {
    const context = useContext(EntriesStoreContext)
    if (!context) throw new Error('useEntriesStore must be used within EntriesStoreProvider')
    return useStore(context, selector)
}
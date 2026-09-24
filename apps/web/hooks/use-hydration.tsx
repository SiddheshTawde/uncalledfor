import { useEffect, useState } from 'react'
import { useStore } from '@/store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Manually trigger the store rehydration on the client side
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false))
    const unsubFinish = useStore.persist.onFinishHydration(() => setHydrated(true))

    useStore.persist.rehydrate()

    return () => {
      unsubHydrate()
      unsubFinish()
    }
  }, [])

  return hydrated
}

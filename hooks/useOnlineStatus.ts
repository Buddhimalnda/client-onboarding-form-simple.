// hooks/useOnlineStatus.ts
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { setOnlineStatus, syncWithBackend } from '@/store/slices/itemsSlice'
import { useAppDispatch } from '@/store/hooks'
export function useOnlineStatus() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleOnline = () => {
      dispatch(setOnlineStatus(true))
      // Auto-sync when back online
      dispatch(syncWithBackend())
    }

    const handleOffline = () => {
      dispatch(setOnlineStatus(false))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial status
    dispatch(setOnlineStatus(navigator.onLine))

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [dispatch])
}
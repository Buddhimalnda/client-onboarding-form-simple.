// store/middleware/persistenceMiddleware.ts
import { Middleware } from '@reduxjs/toolkit'
import { storage } from '@/lib/storage/indexeddb'

export const persistenceMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action)

  // Save Redux state after certain actions
  if (action.type.includes('items/') || action.type.includes('ui/')) {
    const state = store.getState()
    
    // Debounced save to IndexedDB
    setTimeout(() => {
      storage.saveItem('redux_state', {
        id: 'app_state',
        data: {
          items: state.items,
          ui: state.ui
        },
        timestamp: Date.now(),
        synced: true
      })
    }, 1000)
  }

  return result
}
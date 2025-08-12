// store/slices/itemsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@/lib/storage/indexeddb'
import type { RootState } from '@/store'

export interface Item {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
  created_at: string
  updated_at: string
  synced: boolean
  spring_boot_id?: string
}

export interface ItemsState {
  items: Item[]
  isLoading: boolean
  error: string | null
  lastSync: string | null
  isOnline: boolean
  pendingSyncCount: number
}

const initialState: ItemsState = {
  items: [],
  isLoading: false,
  error: null,
  lastSync: null,
  isOnline: navigator?.onLine || false,
  pendingSyncCount: 0
}

// Async thunks for persistence
export const loadItemsFromStorage = createAsyncThunk(
  'items/loadFromStorage',
  async () => {
    const storedItems = await storage.getAllItems('items')
    return storedItems.map(item => item.data as Item)
  }
)

export const persistItem = createAsyncThunk(
  'items/persist',
  async (item: Item) => {
    await storage.saveItem('items', {
      id: item.id,
      data: item,
      timestamp: Date.now(),
      synced: item.synced,
      action: item.spring_boot_id ? 'UPDATE' : 'CREATE'
    })

    // Add to sync queue if not synced
    if (!item.synced) {
      await storage.saveItem('sync_queue', {
        id: `item_${item.id}_${Date.now()}`,
        data: {
          table: 'items',
          record_id: item.id,
          action: item.spring_boot_id ? 'UPDATE' : 'CREATE',
          data: item
        },
        timestamp: Date.now(),
        synced: false
      })
    }

    return item
  }
)

export const deleteItemPersist = createAsyncThunk(
  'items/deletePersist',
  async (id: string) => {
    await storage.deleteItem('items', id)
    
    // Add delete to sync queue
    await storage.saveItem('sync_queue', {
      id: `item_delete_${id}_${Date.now()}`,
      data: {
        table: 'items',
        record_id: id,
        action: 'DELETE',
        data: { id }
      },
      timestamp: Date.now(),
      synced: false
    })

    return id
  }
)

export const syncWithBackend = createAsyncThunk(
  'items/syncWithBackend',
  async (_, { getState }) => {
    const state = getState() as RootState
    if (!state.items.isOnline) {
      throw new Error('No internet connection')
    }

    const unsyncedItems = await storage.getUnsyncedItems('sync_queue')
    const results = []

    for (const item of unsyncedItems) {
      try {
        const { table, record_id, action, data } = item.data

        let response: Response
        switch (action) {
          case 'CREATE':
            response = await fetch(`/api/spring-boot/${table}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            break
          case 'UPDATE':
            response = await fetch(`/api/spring-boot/${table}/${record_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            break
          case 'DELETE':
            response = await fetch(`/api/spring-boot/${table}/${record_id}`, {
              method: 'DELETE'
            })
            break
        }

        if (response!.ok) {
          // Mark as synced
          await storage.saveItem('sync_queue', {
            ...item,
            synced: true
          })

          // Update original item
          if (table === 'items' && action !== 'DELETE') {
            const result = await response!.json()
            await storage.saveItem('items', {
              id: record_id,
              data: { ...data, synced: true, spring_boot_id: result.id },
              timestamp: Date.now(),
              synced: true
            })
          }

          results.push({ success: true, item })
        }
      } catch (error) {
        results.push({ success: false, item, error })
      }
    }

    return results
  }
)

export const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<Item, 'id' | 'created_at' | 'updated_at' | 'synced'>>) => {
      const newItem: Item = {
        ...action.payload,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: false
      }
      state.items.push(newItem)
      
      // Persist in background
      persistItem(newItem)
    },

    updateItem: (state, action: PayloadAction<{ id: string; updates: Partial<Item> }>) => {
      const { id, updates } = action.payload
      const index = state.items.findIndex(item => item.id === id)
      
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
          updated_at: new Date().toISOString(),
          synced: false
        }
        
        // Persist in background
        persistItem(state.items[index])
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.items = state.items.filter(item => item.id !== id)
      
      // Persist deletion
      deleteItemPersist(id)
    },

    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },

    updatePendingSyncCount: (state, action: PayloadAction<number>) => {
      state.pendingSyncCount = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadItemsFromStorage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadItemsFromStorage.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(loadItemsFromStorage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load items'
      })
      .addCase(syncWithBackend.fulfilled, (state, action) => {
        state.lastSync = new Date().toISOString()
        const successCount = action.payload.filter(r => r.success).length
        state.pendingSyncCount = Math.max(0, state.pendingSyncCount - successCount)
      })
  }
})

export const { addItem, updateItem, deleteItem, setOnlineStatus, updatePendingSyncCount } = itemsSlice.actions

export const selectItems = (state: RootState) => state.items.items
export const selectIsLoading = (state: RootState) => state.items.isLoading
export const selectIsOnline = (state: RootState) => state.items.isOnline
export const selectPendingSyncCount = (state: RootState) => state.items.pendingSyncCount

export default itemsSlice.reducer
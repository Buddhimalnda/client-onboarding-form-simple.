// lib/storage/indexeddb.ts
export interface StorageItem {
  id: string
  data: any
  timestamp: number
  synced: boolean
  action?: 'CREATE' | 'UPDATE' | 'DELETE'
}

class IndexedDBStorage {
  private db: IDBDatabase | null = null
  private readonly dbName = 'POS_Storage'
  private readonly version = 1

  async init(): Promise<void> {
    if (typeof window === 'undefined') return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = () => {
        const db = request.result

        // Items store
        if (!db.objectStoreNames.contains('items')) {
          const itemStore = db.createObjectStore('items', { keyPath: 'id' })
          itemStore.createIndex('synced', 'synced', { unique: false })
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          syncStore.createIndex('synced', 'synced', { unique: false })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Redux state backup
        if (!db.objectStoreNames.contains('redux_state')) {
          db.createObjectStore('redux_state', { keyPath: 'key' })
        }
      }
    })
  }

  async saveItem(storeName: string, item: StorageItem): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getItem(storeName: string, id: string): Promise<StorageItem | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllItems(storeName: string): Promise<StorageItem[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async deleteItem(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getUnsyncedItems(storeName: string): Promise<StorageItem[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index('synced')
      const request = index.getAll('false')

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }
}

export const storage = new IndexedDBStorage()
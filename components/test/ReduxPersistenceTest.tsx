import React, { useState, useEffect } from "react";
import { Plus, Database, Wifi, WifiOff, Trash2, RefreshCw } from "lucide-react";

// Mock IndexedDB Storage
class MockIndexedDBStorage {
  private data: Map<string, any> = new Map();
  private isInitialized = false;

  async init(): Promise<void> {
    if (typeof window === "undefined") return;

    // Load from localStorage as fallback for demo
    const stored = localStorage.getItem("pos_items_db");
    if (stored) {
      this.data = new Map(JSON.parse(stored));
    }
    this.isInitialized = true;
  }

  async saveItem(storeName: string, item: any): Promise<void> {
    if (!this.isInitialized) await this.init();

    this.data.set(`${storeName}_${item.id}`, item);
    this.persistToLocalStorage();
  }

  async getAllItems(storeName: string): Promise<any[]> {
    if (!this.isInitialized) await this.init();

    const items = [];
    for (const [key, value] of this.data.entries()) {
      if (key.startsWith(`${storeName}_`)) {
        items.push(value);
      }
    }
    return items.sort((a, b) => b.timestamp - a.timestamp);
  }

  async deleteItem(storeName: string, id: string): Promise<void> {
    if (!this.isInitialized) await this.init();

    this.data.delete(`${storeName}_${id}`);
    this.persistToLocalStorage();
  }

  async getUnsyncedItems(storeName: string): Promise<any[]> {
    const items = await this.getAllItems(storeName);
    return items.filter((item) => !item.synced);
  }

  private persistToLocalStorage() {
    localStorage.setItem(
      "pos_items_db",
      JSON.stringify([...this.data.entries()])
    );
  }

  async clearAll(): Promise<void> {
    this.data.clear();
    localStorage.removeItem("pos_items_db");
  }
}

const storage = new MockIndexedDBStorage();

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

export default function ReduxPersistenceTest() {
  const [items, setItems] = useState<Item[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator?.onLine || true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  // Initialize and load data
  useEffect(() => {
    loadItemsFromStorage();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadItemsFromStorage = async () => {
    try {
      setIsLoading(true);
      await storage.init();
      const storedItems = await storage.getAllItems("items");
      const items = storedItems.map((item) => item.data);
      setItems(items);
      console.log("✅ Loaded items from IndexedDB:", items.length);
    } catch (error) {
      console.error("❌ Failed to load items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in name and price");
      return;
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      category: formData.category || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: false,
    };

    try {
      // Add to Redux state (immediate UI update)
      setItems((prev) => [newItem, ...prev]);

      // Persist to IndexedDB
      await storage.saveItem("items", {
        id: newItem.id,
        data: newItem,
        timestamp: Date.now(),
        synced: false,
        action: "CREATE",
      });

      console.log("✅ Item added and persisted:", newItem.name);

      // Reset form
      setFormData({ name: "", price: "", quantity: "", category: "" });

      // Simulate sync attempt if online
      if (isOnline) {
        setTimeout(() => {
          console.log("🔄 Simulating sync with Spring Boot...");
          // In real app, this would sync with backend
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Failed to add item:", error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Remove from Redux state
      setItems((prev) => prev.filter((item) => item.id !== id));

      // Remove from IndexedDB
      await storage.deleteItem("items", id);

      console.log("✅ Item deleted:", id);
    } catch (error) {
      console.error("❌ Failed to delete item:", error);
    }
  };

  const clearAllData = async () => {
    if (confirm("Clear all data? This will test persistence on refresh.")) {
      try {
        await storage.clearAll();
        setItems([]);
        console.log("🗑️ All data cleared");
      } catch (error) {
        console.error("❌ Failed to clear data:", error);
      }
    }
  };

  const testPersistence = () => {
    alert("Refresh the page to test if data persists!");
    window.location.reload();
  };

  const unsyncedCount = items.filter((item) => !item.synced).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-500" />
          Redux + IndexedDB Test
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>

          {unsyncedCount > 0 && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              {unsyncedCount} unsynced
            </div>
          )}
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Item name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category"
            />
          </div>
        </div>

        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Test Controls */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">
          Persistence Test Controls
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={testPersistence}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Test Persistence (Refresh Page)
          </button>

          <button
            onClick={loadItemsFromStorage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Reload from Storage
          </button>

          <button
            onClick={clearAllData}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Items ({items.length})</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No items yet</p>
            <p>Add some items to test persistence</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      {!item.synced && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                          Not Synced
                        </span>
                      )}
                      {item.category && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Price: ${item.price.toFixed(2)}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>
                        Added: {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-white font-semibold mb-2">Debug Console</h3>
        <p>💾 Storage: IndexedDB (fallback: localStorage)</p>
        <p>📊 Items in memory: {items.length}</p>
        <p>🔄 Unsynced items: {unsyncedCount}</p>
        <p>🌐 Connection: {isOnline ? "Online" : "Offline"}</p>
        <p className="mt-2 text-yellow-400">
          ℹ️ Check browser console for detailed logs
        </p>
      </div>
    </div>
  );
}

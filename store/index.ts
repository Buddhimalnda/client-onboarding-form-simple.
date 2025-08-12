import { configureStore } from '@reduxjs/toolkit'
import { uiSlice } from './slice/ui/uiSlice'
import { persistenceMiddleware } from './middleware/persistenceMiddleware'
import { itemsSlice } from './slices/itemsSlice'
// ...

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    items: itemsSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(persistenceMiddleware),
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
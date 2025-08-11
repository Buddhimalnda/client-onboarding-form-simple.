import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { UserBranch, UserModel } from '@/utils/types/auth'
import { Message, Notification } from '@/utils/types/ui'
import { clear } from 'console'

// Define a type for the slice state
export interface UiState {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark' 
  notifications: Notification[] | null
  messages: Message[] | null


}

const initialState: UiState = {
  isLoading: false,
  error: null,
  theme: 'light',
  notifications: null,
  messages: null
}

export const uiSlice = createSlice({
  name: 'ui',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setNotifications: (state, action: PayloadAction<Notification[] | null>) => {
      state.notifications = action.payload
    },
    setMessages: (state, action: PayloadAction<Message[] | null>) => {
      state.messages = action.payload
    },
    clearAllUi: (state) => {
      state.isLoading = false
      state.error = null
      state.theme = 'light'
      state.notifications = null
      state.messages = null
    },
    clearNotifications: (state) => {
      state.notifications = null
    },
    clearMessages: (state) => {
      state.messages = null
    },
    clearLoading: (state) => {
      state.isLoading = false
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications?.filter(notification => notification.id !== action.payload) || null
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages?.filter(message => message.id !== action.payload) || null
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [...(state.notifications || []), action.payload]
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...(state.messages || []), action.payload]
    }
  }
})

export const { setLoading, setError, setTheme, setNotifications, setMessages, clearAllUi, clearNotifications, clearMessages, clearLoading, removeNotification, removeMessage, addNotification, addMessage } = uiSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectUser = (state: RootState) => state.auth.user
export const selectTheme = (state: RootState) => state.ui.theme
export const selectNotifications = (state: RootState) => state.ui.notifications
export const selectMessages = (state: RootState) => state.ui.messages

export default uiSlice.reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { Message, Notification } from '@/utils/types/ui'


// Define a type for the slice state
export interface UiState {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark' 
  notifications: Notification[]
  messages: Message[]
}

const initialState: UiState = {
  isLoading: false,
  error: null,
  theme: 'light',
  notifications: [],
  messages: []
}

export const uiSlice = createSlice({
  name: 'ui',
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
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    clearAllUi: (state) => {
      state.isLoading = false
      state.error = null
      state.theme = 'light'
      state.notifications = []
      state.messages = []
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    clearMessages: (state) => {
      state.messages = []
    },
    clearLoading: (state) => {
      state.isLoading = false
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(message => message.id !== action.payload)
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
        duration: action.payload.duration || 5000, // Default 5 seconds
      };
      state.notifications.push(notification)
    },
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp' | 'read'>>) => {
      const message: Message = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        read: false,
      };
      state.messages.push(message)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markMessageAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find(m => m.id === action.payload);
      if (message) {
        message.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    markAllMessagesAsRead: (state) => {
      state.messages.forEach(message => {
        message.read = true;
      });
    }
  }
})

export const { 
  setLoading, 
  setError, 
  setTheme, 
  setNotifications, 
  setMessages, 
  clearAllUi, 
  clearNotifications, 
  clearMessages, 
  clearLoading, 
  removeNotification, 
  removeMessage, 
  addNotification, 
  addMessage,
  markNotificationAsRead,
  markMessageAsRead,
  markAllNotificationsAsRead,
  markAllMessagesAsRead
} = uiSlice.actions

// Selectors
export const selectIsLoading = (state: RootState) => state.ui.isLoading
export const selectError = (state: RootState) => state.ui.error
export const selectTheme = (state: RootState) => state.ui.theme
export const selectNotifications = (state: RootState) => state.ui.notifications
export const selectMessages = (state: RootState) => state.ui.messages
export const selectUnreadNotifications = (state: RootState) => 
  state.ui.notifications.filter(n => !n.read)
export const selectUnreadMessages = (state: RootState) => 
  state.ui.messages.filter(m => !m.read)

export default uiSlice.reducer
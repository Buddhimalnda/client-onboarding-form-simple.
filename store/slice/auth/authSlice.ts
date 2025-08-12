import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { UserBranch, User, TokenData } from '@/utils/types/auth'

// Define a type for the slice state
export interface AuthState {
  isLoggedIn: boolean
  user: User | null
  tokens: TokenData | null
  branch: UserBranch[] | null
  selectedBranch: UserBranch | null
  isLoading: boolean
  lastActivity: number // timestamp of last user activity
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  tokens: null,
  branch: null,
  selectedBranch: null,
  isLoading: false,
  lastActivity: Date.now()
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: TokenData }>) => {
      state.isLoggedIn = true
      state.user = action.payload.user
      state.tokens = action.payload.tokens
      state.isLoading = false
      state.lastActivity = Date.now()
    },
    loginFailure: (state) => {
      state.isLoggedIn = false
      state.user = null
      state.tokens = null
      state.isLoading = false
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.user = null
      state.tokens = null
      state.branch = null
      state.selectedBranch = null
      state.isLoading = false
    },
    updateTokens: (state, action: PayloadAction<TokenData>) => {
      state.tokens = action.payload
      state.lastActivity = Date.now()
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    updateFCMToken: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.fcmToken = action.payload
      }
    },
    setBranches: (state, action: PayloadAction<UserBranch[]>) => {
      state.branch = action.payload
    },
    setSelectedBranch: (state, action: PayloadAction<UserBranch>) => {
      state.selectedBranch = action.payload
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now()
    },
    clearAuth: (state) => {
      return initialState
    }
  }
})

export const { 
  setLoading,
  loginStart,
  loginSuccess, 
  loginFailure,
  logout, 
  updateTokens,
  updateUser,
  updateFCMToken,
  setBranches,
  setSelectedBranch,
  updateLastActivity,
  clearAuth
} = authSlice.actions

// Selectors
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectUser = (state: RootState) => state.auth.user
export const selectTokens = (state: RootState) => state.auth.tokens
export const selectBranches = (state: RootState) => state.auth.branch
export const selectSelectedBranch = (state: RootState) => state.auth.selectedBranch
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectLastActivity = (state: RootState) => state.auth.lastActivity

// Helper selectors
export const selectAccessToken = (state: RootState) => state.auth.tokens?.accessToken
export const selectRefreshToken = (state: RootState) => state.auth.tokens?.refreshToken
export const selectTokenExpiry = (state: RootState) => state.auth.tokens?.expiresAt

export default authSlice.reducer
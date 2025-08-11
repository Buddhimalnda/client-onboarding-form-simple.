import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { UserBranch, UserModel } from '@/utils/types/auth'

// Define a type for the slice state
export interface AuthState {
  isLoggedIn: boolean
  user: UserModel | null
  token: string | null
  refreshToken: string | null
  branch: UserBranch[] | null
  selectedBranch: UserBranch | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  refreshToken: null,
  branch: null,
  selectedBranch: null
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: state => {
      state.isLoggedIn = true
    },
    logout: state => {
      state.isLoggedIn = false
      state.user = null
    },
    setUser: (state, action: PayloadAction<UserModel | null>) => {
      state.user = action.payload
    },
  }
})

export const { login, logout, setUser } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer
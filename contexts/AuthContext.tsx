"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, AuthenticationResponse, TokenData } from "@/utils/types/auth";
import { AuthService } from "@/lib/services/auth.service";
import { FCMService } from "@/lib/services/fcm.service";
import { TokenStorage } from "@/lib/storage/tokenStorage";
import { useAlert } from "@/hooks/useAlert";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  updateTokens,
  updateUser,
  updateFCMToken,
  updateLastActivity,
  clearAuth,
  selectIsLoggedIn,
  selectUser,
  selectTokens,
  selectAccessToken,
  selectRefreshToken,
  selectIsLoading,
} from "@/store/slice/auth/authSlice";
import type { RootState } from "@/store";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshAuthToken: () => Promise<boolean>;
  updateFCMTokenHandler: () => Promise<void>;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  // Redux selectors
  const user = useSelector(selectUser);
  const tokens = useSelector(selectTokens);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);

  // Auto-refresh token timer
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;

    const setupAutoRefresh = () => {
      if (tokens && !TokenStorage.isTokenExpired(tokens)) {
        const timeUntilRefresh =
          TokenStorage.getTimeUntilExpiry(tokens) - 10 * 60 * 1000; // Refresh 10 minutes before expiry

        if (timeUntilRefresh > 0) {
          refreshTimer = setTimeout(() => {
            refreshAuthToken();
          }, timeUntilRefresh);
        }
      }
    };

    setupAutoRefresh();

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [tokens]);

  // Initialize FCM and check auth on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await FCMService.initialize();
        await FCMService.onMessageListener();
        await checkAuth();
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []);

  // Update FCM token when user is authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      updateFCMTokenHandler();
    }
  }, [isAuthenticated, accessToken]);

  // Activity tracking for session management
  useEffect(() => {
    const handleUserActivity = () => {
      if (isAuthenticated) {
        dispatch(updateLastActivity());
      }
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isAuthenticated, dispatch]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        dispatch(loginStart());

        const response: AuthenticationResponse = await AuthService.authenticate(
          {
            email,
            password,
          }
        );

        // Create token data with expiration
        const tokenData: TokenData = TokenStorage.createTokenData(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );

        // Save to localStorage
        TokenStorage.saveTokens(tokenData);
        TokenStorage.saveUser(response.user);

        // Update Redux store
        dispatch(
          loginSuccess({
            user: response.user,
            tokens: tokenData,
          })
        );

        alert.success(
          "Welcome back!",
          `Successfully signed in as ${response.user.firstName}`,
          3000
        );

        return true;
      } catch (error: any) {
        console.error("Login error:", error);

        const errorMessage =
          error.response?.data?.message || "Invalid email or password";
        alert.error("Login Failed", errorMessage, 5000);

        dispatch(loginFailure());
        return false;
      }
    },
    [dispatch, alert]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call backend logout if we have a token
      if (accessToken) {
        try {
          await AuthService.logout(accessToken);
        } catch (error) {
          console.error("Backend logout error:", error);
          // Continue with local logout even if backend fails
        }
      }

      alert.info("Signed Out", "You have been successfully signed out", 3000);
    } catch (error) {
      console.error("Logout error:", error);
      alert.error("Logout Error", "There was an error signing out", 3000);
    } finally {
      // Always clear local data
      TokenStorage.clearAll();
      dispatch(logoutAction());
    }
  }, [accessToken, dispatch, alert]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // Get stored tokens and user
      const storedTokens = TokenStorage.getTokens();
      const storedUser = TokenStorage.getUser();

      if (!storedTokens || !storedUser) {
        dispatch(loginFailure());
        return false;
      }

      // Check if refresh token is expired
      if (TokenStorage.isRefreshTokenExpired(storedTokens)) {
        console.log("Refresh token expired, logging out");
        await logout();
        return false;
      }

      // Check if access token is expired
      if (TokenStorage.isTokenExpired(storedTokens)) {
        console.log("Access token expired, attempting refresh");
        return await refreshAuthToken();
      }

      // Verify token with backend
      try {
        const user = await AuthService.checkToken(storedTokens.accessToken);

        dispatch(
          loginSuccess({
            user,
            tokens: storedTokens,
          })
        );

        return true;
      } catch (error) {
        console.error("Token verification failed:", error);
        // Try to refresh token if verification fails
        return await refreshAuthToken();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      dispatch(loginFailure());
      return false;
    }
  }, [dispatch, logout]);

  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    try {
      const storedTokens = TokenStorage.getTokens();

      if (!storedTokens || !storedTokens.refreshToken) {
        dispatch(loginFailure());
        return false;
      }

      // Check if refresh token is expired
      if (TokenStorage.isRefreshTokenExpired(storedTokens)) {
        console.log("Refresh token expired, logging out");
        await logout();
        return false;
      }

      const response: AuthenticationResponse = await AuthService.refreshToken(
        storedTokens.refreshToken
      );

      // Create new token data
      const newTokenData: TokenData = TokenStorage.createTokenData(
        response.accessToken,
        response.refreshToken,
        response.expiresIn
      );

      // Update storage
      TokenStorage.saveTokens(newTokenData);
      TokenStorage.saveUser(response.user);

      // Update Redux store
      dispatch(updateTokens(newTokenData));
      dispatch(updateUser(response.user));

      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);

      // Clear invalid tokens and logout
      TokenStorage.clearAll();
      dispatch(loginFailure());

      alert.warning(
        "Session Expired",
        "Your session has expired. Please sign in again.",
        5000
      );

      return false;
    }
  }, [dispatch, logout, alert]);

  const updateFCMTokenHandler = useCallback(async (): Promise<void> => {
    try {
      if (!accessToken) return;

      const deviceInfo = FCMService.getDeviceInfo();
      const success = await FCMService.saveFCMTokenToBackend(
        accessToken,
        deviceInfo
      );

      if (success) {
        const fcmToken = await FCMService.getToken();
        if (fcmToken) {
          dispatch(updateFCMToken(fcmToken));

          // Update stored user data
          const storedUser = TokenStorage.getUser();
          if (storedUser) {
            storedUser.fcmToken = fcmToken;
            TokenStorage.saveUser(storedUser);
          }
        }
      }
    } catch (error) {
      console.error("Error updating FCM token:", error);
    }
  }, [accessToken, dispatch]);

  const clearAuthData = useCallback(() => {
    TokenStorage.clearAll();
    dispatch(clearAuth());
  }, [dispatch]);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    refreshAuthToken,
    updateFCMTokenHandler,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

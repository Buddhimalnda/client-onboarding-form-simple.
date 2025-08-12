import { TokenData } from '@/utils/types/auth';

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

export class TokenStorage {
  // Save tokens to localStorage with encryption (you can add encryption here)
  static saveTokens(tokens: TokenData): void {
    try {
      const tokenString = JSON.stringify(tokens);
      localStorage.setItem(TOKEN_KEY, tokenString);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  // Get tokens from localStorage
  static getTokens(): TokenData | null {
    try {
      const tokenString = localStorage.getItem(TOKEN_KEY);
      if (!tokenString) return null;
      
      const tokens: TokenData = JSON.parse(tokenString);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  // Check if access token is expired
  static isTokenExpired(tokens: TokenData | null): boolean {
    if (!tokens) return true;
    
    const now = Date.now();
    const expiresAt = tokens.expiresAt;
    
    // Add 5 minute buffer before expiration
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return now >= (expiresAt - bufferTime);
  }

  // Check if refresh token is expired (assuming refresh tokens last longer)
  static isRefreshTokenExpired(tokens: TokenData | null): boolean {
    if (!tokens) return true;
    
    const now = Date.now();
    const issuedAt = tokens.issuedAt;
    
    // Assuming refresh tokens last 30 days
    const refreshTokenLifetime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    return now >= (issuedAt + refreshTokenLifetime);
  }

  // Calculate token expiration time from expiresIn (seconds)
  static calculateExpirationTime(expiresIn: number): number {
    return Date.now() + (expiresIn * 1000);
  }

  // Create TokenData from API response
  static createTokenData(accessToken: string, refreshToken: string, expiresIn: number): TokenData {
    return {
      accessToken,
      refreshToken,
      expiresAt: this.calculateExpirationTime(expiresIn),
      issuedAt: Date.now()
    };
  }

  // Save user data
  static saveUser(user: any): void {
    try {
      const userString = JSON.stringify(user);
      localStorage.setItem(USER_KEY, userString);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  // Get user data
  static getUser(): any | null {
    try {
      const userString = localStorage.getItem(USER_KEY);
      if (!userString) return null;
      
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Clear all stored data
  static clearAll(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Get time until token expires (in milliseconds)
  static getTimeUntilExpiry(tokens: TokenData | null): number {
    if (!tokens) return 0;
    
    const now = Date.now();
    const expiresAt = tokens.expiresAt;
    
    return Math.max(0, expiresAt - now);
  }

  // Check if tokens need refresh (within 10 minutes of expiry)
  static shouldRefreshToken(tokens: TokenData | null): boolean {
    if (!tokens) return false;
    
    const timeUntilExpiry = this.getTimeUntilExpiry(tokens);
    const refreshThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
    
    return timeUntilExpiry <= refreshThreshold && timeUntilExpiry > 0;
  }
}
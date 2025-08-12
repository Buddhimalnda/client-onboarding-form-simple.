import { TokenStorage } from '@/lib/storage/tokenStorage';
import { AuthService } from '@/lib/services/auth.service';

export class SessionManager {
  private static instance: SessionManager;
  private refreshTimer: NodeJS.Timeout | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly CHECK_INTERVAL = 60 * 1000; // Check every minute

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Start session monitoring
  startSession(): void {
    this.stopSession(); // Clear any existing timers
    this.scheduleTokenRefresh();
    this.startSessionCheck();
  }

  // Stop session monitoring
  stopSession(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  // Schedule automatic token refresh
  private scheduleTokenRefresh(): void {
    const tokens = TokenStorage.getTokens();
    if (!tokens) return;

    const timeUntilRefresh = TokenStorage.getTimeUntilExpiry(tokens) - (10 * 60 * 1000); // Refresh 10 minutes before expiry
    
    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(async () => {
        await this.refreshToken();
        this.scheduleTokenRefresh(); // Schedule next refresh
      }, timeUntilRefresh);
    }
  }

  // Refresh the access token
  private async refreshToken(): Promise<boolean> {
    try {
      const tokens = TokenStorage.getTokens();
      if (!tokens || TokenStorage.isRefreshTokenExpired(tokens)) {
        this.handleSessionExpiry();
        return false;
      }

      const response = await AuthService.refreshToken(tokens.refreshToken);
      
      const newTokenData = TokenStorage.createTokenData(
        response.accessToken,
        response.refreshToken,
        response.expiresIn
      );

      TokenStorage.saveTokens(newTokenData);
      TokenStorage.saveUser(response.user);

      console.log('Token refreshed automatically');
      return true;
    } catch (error) {
      console.error('Auto refresh failed:', error);
      this.handleSessionExpiry();
      return false;
    }
  }

  // Check session validity periodically
  private startSessionCheck(): void {
    this.sessionCheckInterval = setInterval(() => {
      this.checkSessionValidity();
    }, this.CHECK_INTERVAL);
  }

  // Check if session is still valid
  private checkSessionValidity(): void {
    const tokens = TokenStorage.getTokens();
    
    if (!tokens) {
      this.handleSessionExpiry();
      return;
    }

    // Check if refresh token is expired
    if (TokenStorage.isRefreshTokenExpired(tokens)) {
      this.handleSessionExpiry();
      return;
    }

    // Check for inactivity timeout
    const lastActivity = this.getLastActivity();
    const now = Date.now();
    
    if (now - lastActivity > this.SESSION_TIMEOUT) {
      this.handleInactivityTimeout();
      return;
    }
  }

  // Handle session expiry
  private handleSessionExpiry(): void {
    console.log('Session expired, clearing data');
    TokenStorage.clearAll();
    this.stopSession();
    
    // Trigger logout in the app
    this.notifySessionExpiry();
  }

  // Handle inactivity timeout
  private handleInactivityTimeout(): void {
    console.log('Session timed out due to inactivity');
    this.handleSessionExpiry();
  }

  // Get last activity timestamp
  private getLastActivity(): number {
    try {
      const lastActivity = localStorage.getItem('lastActivity');
      return lastActivity ? parseInt(lastActivity) : Date.now();
    } catch {
      return Date.now();
    }
  }

  // Update last activity timestamp
  updateActivity(): void {
    try {
      localStorage.setItem('lastActivity', Date.now().toString());
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  }

  // Notify app of session expiry
  private notifySessionExpiry(): void {
    // Dispatch custom event for the app to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sessionExpired'));
    }
  }

  // Manual token refresh (can be called by components)
  async manualRefresh(): Promise<boolean> {
    return await this.refreshToken();
  }

  // Check if tokens need refresh
  shouldRefreshToken(): boolean {
    const tokens = TokenStorage.getTokens();
    return TokenStorage.shouldRefreshToken(tokens);
  }

  // Get session info
  getSessionInfo(): {
    isValid: boolean;
    timeUntilExpiry: number;
    shouldRefresh: boolean;
    lastActivity: number;
  } {
    const tokens = TokenStorage.getTokens();
    const lastActivity = this.getLastActivity();
    
    return {
      isValid: tokens ? !TokenStorage.isRefreshTokenExpired(tokens) : false,
      timeUntilExpiry: tokens ? TokenStorage.getTimeUntilExpiry(tokens) : 0,
      shouldRefresh: this.shouldRefreshToken(),
      lastActivity
    };
  }
}
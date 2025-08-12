import { NextRequest, NextResponse } from 'next/server';
import { TokenStorage } from '@/lib/storage/tokenStorage';

// Routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/',
  '/about',
  '/contact'
];

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
];

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // For client-side, we can't access localStorage in middleware
  // So we'll handle this in the component level or use a different approach
  
  if (isProtectedRoute) {
    // Redirect to login if trying to access protected route
    // Note: This is a basic implementation. In a real app, you might want to
    // check for auth cookies or implement a different strategy
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Client-side auth guard hook
export function useAuthGuard() {
  const checkTokenExpiry = () => {
    if (typeof window === 'undefined') return false;
    
    const tokens = TokenStorage.getTokens();
    
    if (!tokens) return false;
    
    // Check if access token is expired
    if (TokenStorage.isTokenExpired(tokens)) {
      // Check if refresh token is also expired
      if (TokenStorage.isRefreshTokenExpired(tokens)) {
        // Both tokens expired, clear storage
        TokenStorage.clearAll();
        return false;
      }
      
      // Access token expired but refresh token is valid
      // This should trigger a refresh in the AuthContext
      return 'refresh_needed';
    }
    
    return true;
  };

  return { checkTokenExpiry };
}
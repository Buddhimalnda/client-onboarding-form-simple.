"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TokenStorage } from "@/lib/storage/tokenStorage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      // Check if tokens exist and are valid
      const tokens = TokenStorage.getTokens();

      if (!tokens) {
        router.push("/auth/login");
        return;
      }

      // Check if refresh token is expired
      if (TokenStorage.isRefreshTokenExpired(tokens)) {
        TokenStorage.clearAll();
        router.push("/auth/login");
        return;
      }

      // If access token is expired but refresh token is valid, checkAuth will handle refresh
      if (TokenStorage.isTokenExpired(tokens)) {
        const authResult = await checkAuth();
        if (!authResult) {
          router.push("/auth/login");
          return;
        }
      }

      setIsChecking(false);
    };

    validateAuth();
  }, [checkAuth, router]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  // Check role-based access
  if (requiredRole && user) {
    const hasRequiredRole = requiredRole.includes(user.role);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

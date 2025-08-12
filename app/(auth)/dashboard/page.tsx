"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SessionManager } from "@/lib/auth/SessionManager";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    // Update session info every minute
    const updateSessionInfo = () => {
      const info = SessionManager.getInstance().getSessionInfo();
      setSessionInfo(info);
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Branch</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.branch || "Not assigned"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Session Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sessionInfo && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Session Status</p>
                      <p
                        className={`text-sm ${
                          sessionInfo.isValid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sessionInfo.isValid ? "Active" : "Expired"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Token Expires In</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(sessionInfo.timeUntilExpiry)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Activity</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(Date.now() - sessionInfo.lastActivity)} ago
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Auto Refresh</p>
                      <p
                        className={`text-sm ${
                          sessionInfo.shouldRefresh
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {sessionInfo.shouldRefresh ? "Pending" : "Not needed"}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Email Verified</p>
                  <p
                    className={`text-sm ${
                      user?.isEmailVerified
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {user?.isEmailVerified
                      ? "Verified"
                      : "Pending verification"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p
                    className={`text-sm ${
                      user?.fcmToken ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {user?.fcmToken ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.createAt
                      ? new Date(user.createAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Button onClick={logout} variant="destructive">
              Sign Out
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

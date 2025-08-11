// components/AlertProvider.tsx
"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNotifications,
  removeNotification,
} from "@/store/slice/ui/uiSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const alertIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertVariants = {
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
};

export default function AlertProvider() {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!notifications) return;

    const timers = notifications
      .filter((notification) => notification.duration)
      .map((notification) =>
        setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration!)
      );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [notifications, dispatch]);

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = alertIcons[notification.type];
        return (
          <Alert
            key={notification.id}
            className={`
              relative animate-in slide-in-from-right-5 duration-300
              ${alertVariants[notification.type]}
            `}
          >
            <Icon className="h-4 w-4" />
            <div className="flex-1">
              <AlertTitle>{notification.title}</AlertTitle>
              {notification.message && (
                <AlertDescription className="mt-1">
                  {notification.message}
                </AlertDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-transparent"
              onClick={() => dispatch(removeNotification(notification.id))}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        );
      })}
    </div>
  );
}

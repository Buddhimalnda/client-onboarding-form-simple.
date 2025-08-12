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
import { cn } from "@/lib/utils";

const alertIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertVariants = {
  success: {
    container: "border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl",
    icon: "text-emerald-400",
    title: "text-emerald-300",
    description: "text-emerald-200/80",
    close: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
  },
  error: {
    container: "border-red-500/30 bg-red-950/20 backdrop-blur-xl",
    icon: "text-red-400",
    title: "text-red-300",
    description: "text-red-200/80",
    close: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-950/20 backdrop-blur-xl",
    icon: "text-amber-400",
    title: "text-amber-300",
    description: "text-amber-200/80",
    close: "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10",
  },
  info: {
    container: "border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl",
    icon: "text-cyan-400",
    title: "text-cyan-300",
    description: "text-cyan-200/80",
    close: "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10",
  },
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
        const variant = alertVariants[notification.type];

        return (
          <Alert
            key={notification.id}
            className={cn(
              "relative animate-in slide-in-from-right-5 duration-300",
              "shadow-2xl border-2 rounded-xl",
              "transform transition-all hover:scale-105",
              variant.container
            )}
            style={{
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <Icon
                className={cn("h-5 w-5 mt-0.5 flex-shrink-0", variant.icon)}
              />
              <div className="flex-1 min-w-0">
                <AlertTitle
                  className={cn("font-semibold text-sm mb-1", variant.title)}
                >
                  {notification.title}
                </AlertTitle>
                {notification.message && (
                  <AlertDescription
                    className={cn(
                      "text-sm leading-relaxed",
                      variant.description
                    )}
                  >
                    {notification.message}
                  </AlertDescription>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 rounded-full flex-shrink-0",
                  "transition-all duration-200",
                  variant.close
                )}
                onClick={() => dispatch(removeNotification(notification.id))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Progress bar for timed notifications */}
            {notification.duration && (
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-1 rounded-b-xl",
                  notification.type === "success" && "bg-emerald-400",
                  notification.type === "error" && "bg-red-400",
                  notification.type === "warning" && "bg-amber-400",
                  notification.type === "info" && "bg-cyan-400"
                )}
                style={{
                  animation: `shrink ${notification.duration}ms linear`,
                  transformOrigin: "left",
                }}
              />
            )}
          </Alert>
        );
      })}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

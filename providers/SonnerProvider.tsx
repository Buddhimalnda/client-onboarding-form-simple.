// components/SonnerProvider.tsx
"use client";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNotifications,
  removeNotification,
} from "@/store/slice/ui/uiSlice";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-cyan-400",
};

export default function SonnerProvider() {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();
  const processedIds = useRef(new Set<string>());

  useEffect(() => {
    if (!notifications) return;

    // Filter out already processed notifications
    const newNotifications = notifications.filter(
      (notification) => !processedIds.current.has(notification.id)
    );

    newNotifications.forEach((notification) => {
      const { type, title, message, duration, id } = notification;
      const Icon = toastIcons[type];

      // Mark as processed
      processedIds.current.add(id);

      const toastContent = (
        <div className="flex items-start gap-3 w-full">
          <div className="flex-shrink-0 mt-0.5">
            {/* <Icon className={cn("h-5 w-5", toastStyles[type])} /> */}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm mb-1">{title}</div>
            {message && (
              <div className="text-sm text-gray-300 leading-relaxed">
                {message}
              </div>
            )}
          </div>
        </div>
      );

      const commonOptions = {
        id,
        duration: duration || (type === "error" ? 6000 : 4000),
        style: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${
            type === "success"
              ? "rgba(16, 185, 129, 0.3)"
              : type === "error"
              ? "rgba(239, 68, 68, 0.3)"
              : type === "warning"
              ? "rgba(245, 158, 11, 0.3)"
              : "rgba(6, 182, 212, 0.3)"
          }`,
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          color: "white",
        },
        className: cn(
          "transform transition-all duration-300",
          "hover:scale-105",
          type === "success" && "shadow-emerald-500/20",
          type === "error" && "shadow-red-500/20",
          type === "warning" && "shadow-amber-500/20",
          type === "info" && "shadow-cyan-500/20"
        ),
      };

      // Show toast based on type
      switch (type) {
        case "success":
          toast.success(toastContent, {
            ...commonOptions,
            icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
          });
          break;
        case "error":
          toast.error(toastContent, {
            ...commonOptions,
            icon: <AlertCircle className="h-5 w-5 text-red-400" />,
          });
          break;
        case "warning":
          toast.warning(toastContent, {
            ...commonOptions,
            icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
          });
          break;
        case "info":
          toast.info(toastContent, {
            ...commonOptions,
            icon: <Info className="h-5 w-5 text-cyan-400" />,
          });
          break;
        default:
          toast(toastContent, {
            ...commonOptions,
            icon: <Info className="h-5 w-5 text-gray-400" />,
          });
      }

      // Remove from Redux after showing toast
      setTimeout(() => {
        dispatch(removeNotification(id));
        processedIds.current.delete(id);
      }, 100);
    });
  }, [notifications, dispatch]);

  // Cleanup processed IDs when component unmounts
  useEffect(() => {
    return () => {
      processedIds.current.clear();
    };
  }, []);

  return null;
}

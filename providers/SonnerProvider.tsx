// components/SonnerProvider.tsx
"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNotifications,
  removeNotification,
} from "@/store/slice/ui/uiSlice";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function SonnerProvider() {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!notifications) return;

    notifications.forEach((notification) => {
      const { type, title, message, duration, id } = notification;

      const toastContent = (
        <div className="flex items-start gap-3">
          {/* <div className="flex-shrink-0 mt-0.5">
            {type === "success" && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {type === "error" && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {type === "warning" && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            {type === "info" && <Info className="h-4 w-4 text-blue-500" />}
          </div> */}
          <div className="font-medium">{title}</div>
          {message && <div className="text-sm opacity-90 mt-1">{message}</div>}
        </div>
      );

      // Show toast based on type
      switch (type) {
        case "success":
          toast.success(toastContent, {
            duration: duration || 4000,
            id,
          });
          break;
        case "error":
          toast.error(toastContent, {
            duration: duration || 6000,
            id,
          });
          break;
        case "warning":
          toast.warning(toastContent, {
            duration: duration || 5000,
            id,
          });
          break;
        case "info":
          toast.info(toastContent, {
            duration: duration || 4000,
            id,
          });
          break;
        default:
          toast(toastContent, {
            duration: duration || 4000,
            id,
          });
      }

      // Remove from Redux immediately since Sonner handles display
      dispatch(removeNotification(id));
    });
  }, [notifications, dispatch]);

  return null;
}

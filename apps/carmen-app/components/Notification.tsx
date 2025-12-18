"use client";

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { wsUrl, backendApi } from "@/lib/backend-api";
import { useTranslations } from "next-intl";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "error" | "warning" | "success";
  created_at: string;
}
const getNotificationIcon = (type: Notification["type"]): string => {
  switch (type) {
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "success":
      return "✅";
    default:
      return "📘";
  }
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  tNoti: (key: string) => string;
}

const NotificationItem = ({ notification, onMarkAsRead, tNoti }: NotificationItemProps) => {
  const icon = getNotificationIcon(notification.type);

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors border-l-2 border-l-primary">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h5 className="font-medium text-sm">{notification.title}</h5>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {new Date(notification.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 mb-2">{notification.message}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium capitalize">{notification.type}</span>
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-xs px-2 py-1 border rounded hover:bg-muted"
            >
              {tNoti("mark_read")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
interface EmptyNotificationStateProps {
  isConnected: boolean;
  tNoti: (key: string) => string;
}

const EmptyNotificationState = ({ isConnected, tNoti }: EmptyNotificationStateProps) => {
  return (
    <div className="p-8 text-center text-xs text-muted-foreground">
      <p>{tNoti("no_notifications")}</p>
      {!isConnected && <p className="text-xs mt-2">{tNoti("connecting")}</p>}
    </div>
  );
};

const useNotificationWebSocket = (userId: string | undefined) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const handleNotificationSent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setNotifications((prev) => [customEvent.detail, ...prev]);
      }
    };

    globalThis.window.addEventListener("notification-sent", handleNotificationSent);

    return () => {
      globalThis.window.removeEventListener("notification-sent", handleNotificationSent);
    };
  }, []);

  useEffect(() => {
    if (!userId || !wsUrl) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
      ws.send(JSON.stringify({ type: "register", user_id: userId }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "notification") {
          setNotifications((prev) => [message.data, ...prev]);
        }
      } catch (error) {
        console.error("Failed to parse notification message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId]);

  const markAsRead = (notificationId: string) => {
    if (socket) {
      socket.send(JSON.stringify({ type: "markAsRead", notificationId }));
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${backendApi}/api/notifications/mark-all-read/${userId}`, {
        method: "POST",
      });

      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return { isConnected, notifications, markAsRead, markAllAsRead };
};

export default function Notification() {
  const { user } = useAuth();
  const tNoti = useTranslations("Notification");
  const { isConnected, notifications, markAsRead, markAllAsRead } = useNotificationWebSocket(
    user?.data.id
  );

  const notificationCount = notifications.length;
  const displayCount = notificationCount > 10 ? "9+" : notificationCount.toString();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="relative inline-flex justify-center items-center w-8 h-8"
          size={"sm"}
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 end-1 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-destructive text-white">
              {displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[250px] overflow-y-auto p-0 shadow-lg">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">{tNoti("notification")}</h4>
            <span className="text-sm">
              {notificationCount} {tNoti("new")}
            </span>
          </div>
        </div>

        <div className="divide-y">
          {notifications.length === 0 ? (
            <EmptyNotificationState isConnected={isConnected} tNoti={tNoti} />
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                tNoti={tNoti}
              />
            ))
          )}
        </div>

        {notificationCount > 0 && (
          <div className="p-3 border-t bg-muted/30 flex justify-between">
            <Button variant="ghost" className="text-xs" size="sm" onClick={markAllAsRead}>
              {tNoti("mark_all_read")}
            </Button>
            <Button variant="outline" className="text-xs" size="sm">
              {tNoti("view_all")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

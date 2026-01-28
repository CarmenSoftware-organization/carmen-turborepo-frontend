"use client";

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { wsUrl, backendApi } from "@/lib/backend-api";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "error" | "warning" | "success";
  created_at: string;
  link?: string;
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

  const formatMessage = (message: string) => {
    const parts = message.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <Link
            key={index}
            href={match[2]}
            className="font-medium text-foreground underline decoration-primary underline-offset-4 hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {match[1]}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div className="p-2 xl:p-4 hover:bg-muted/50 transition-colors border-l-2 border-l-primary relative group">
      {notification.link && (
        <a
          href={notification.link}
          className="absolute inset-0 z-10"
          onClick={(e) => {
            // Let the click bubble up if needed, or handle navigation
          }}
        />
      )}
      <div className="flex items-start gap-2 xl:gap-3 relative z-20 pointer-events-none">
        <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm xl:text-lg">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h5 className="font-medium text-xs xl:text-sm">{notification.title}</h5>
            <span className="text-[10px] xl:text-xs text-muted-foreground whitespace-nowrap ml-1 xl:ml-2">
              {new Date(notification.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-[10px] xl:text-xs text-muted-foreground mt-0.5 xl:mt-1 mb-1 xl:mb-2">
            {formatMessage(notification.message)}
          </p>
          <div className="flex justify-between items-center pointer-events-auto">
            <span className="text-[10px] xl:text-xs font-medium capitalize">
              {notification.type}
            </span>
            <div className="flex gap-1 xl:gap-2">
              {notification.link && (
                <a
                  href={notification.link}
                  className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5 xl:py-1 border rounded hover:bg-muted text-primary decoration-none"
                >
                  View
                </a>
              )}
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-[10px] xl:text-xs px-1.5 xl:px-2 py-0.5 xl:py-1 border rounded hover:bg-muted"
                type="button"
              >
                {tNoti("mark_read")}
              </button>
            </div>
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
    <div className="p-4 xl:p-8 text-center text-[10px] xl:text-xs text-muted-foreground">
      <p>{tNoti("no_notifications")}</p>
      {!isConnected && <p className="text-[10px] xl:text-xs mt-1 xl:mt-2">{tNoti("connecting")}</p>}
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
          className="relative inline-flex justify-center items-center w-7 h-7 xl:w-8 xl:h-8"
          size={"sm"}
        >
          <Bell className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 end-1 inline-flex items-center py-0.5 px-1 xl:px-1.5 rounded-full text-[10px] xl:text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-destructive text-white">
              {displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 xl:w-80 max-h-[200px] xl:max-h-[250px] overflow-y-auto p-0 shadow-lg mx-4">
        <div className="p-2 xl:p-4 border-b border-border bg-muted/50">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-xs xl:text-sm">{tNoti("notification")}</h4>
            <span className="text-xs xl:text-sm">
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
          <div className="p-2 xl:p-3 border-t bg-muted/30 flex justify-between">
            <Button
              variant="ghost"
              className="text-[10px] xl:text-xs h-7 xl:h-8"
              size="sm"
              onClick={markAllAsRead}
            >
              {tNoti("mark_all_read")}
            </Button>
            <Button variant="outline" className="text-[10px] xl:text-xs h-7 xl:h-8" size="sm">
              {tNoti("view_all")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

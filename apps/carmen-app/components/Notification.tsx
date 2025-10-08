'use client';

import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { wsUrl, backendApi } from '@/lib/backend-api';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'error' | 'warning' | 'success';
    created_at: string;
}

export default function Notification() {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const handleNotificationSent = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail) {
                setNotifications(prev => [customEvent.detail, ...prev]);
            }
        };

        window.addEventListener('notification-sent', handleNotificationSent);

        return () => {
            window.removeEventListener('notification-sent', handleNotificationSent);
        };
    }, []);

    useEffect(() => {
        if (!user?.id || !wsUrl) return;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setIsConnected(true);
            setSocket(ws);
            ws.send(JSON.stringify({ type: 'register', user_id: user.id }));
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'notification') {
                    setNotifications(prev => [message.data, ...prev]);
                }
            } catch (error) {
                console.error('Failed to parse notification message:', error);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            setSocket(null);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [user?.id]);

    const markAsRead = (notificationId: string) => {
        if (socket) {
            socket.send(JSON.stringify({ type: 'markAsRead', notificationId }));
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;

        try {
            const response = await fetch(`${backendApi}/api/notifications/mark-all-read/${user.id}`, {
                method: 'POST'
            });

            if (response.ok) {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const notificationCount = notifications.length;
    const displayCount = notificationCount > 10 ? '9+' : notificationCount.toString();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'ghost'}
                    className="relative inline-flex justify-center items-center w-8 h-8"
                    size={'sm'}
                >
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                        <span className="absolute top-1 end-1 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-destructive text-white">{displayCount}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-[450px] overflow-y-auto p-0 shadow-lg">
                <div className="p-4 border-b bg-muted/50">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg">Notifications</h4>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {notificationCount} new
                        </span>
                    </div>
                </div>

                <div className="divide-y">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No notifications yet</p>
                            {!isConnected && (
                                <p className="text-xs mt-2">Connecting to notification server...</p>
                            )}
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="p-4 hover:bg-muted/50 transition-colors border-l-2 border-l-primary"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                        {notification.type === 'error' ? '❌' : notification.type === 'warning' ? '⚠️' : notification.type === 'success' ? '✅' : '📘'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h5 className="font-medium text-sm">{notification.title}</h5>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {new Date(notification.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium capitalize">
                                                {notification.type}
                                            </span>
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-xs px-2 py-1 border rounded hover:bg-muted"
                                            >
                                                Mark Read
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {notificationCount > 0 && (
                    <div className="p-3 border-t bg-muted/30 flex justify-between">
                        <Button
                            variant="ghost"
                            className="text-xs"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                        <Button variant="outline" className="text-xs" size="sm">
                            View all
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}

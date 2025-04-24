import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    poster: string;
}

const mockNotifications: Notification[] = [
    {
        id: 'noti-1',
        title: 'New Message',
        message: 'You have received a new message from John Doe',
        time: '5 minutes ago',
        read: false,
        poster: 'John Doe'
    },
    {
        id: 'noti-2',
        title: 'System Alert',
        message: 'Your storage is almost full. Please free up some space.',
        time: '1 hour ago',
        read: false,
        poster: 'ระบบอัตโนมัติ'
    },
    {
        id: 'noti-3',
        title: 'Update Available',
        message: 'A new version of the application is available.',
        time: '3 hours ago',
        read: false,
        poster: 'システム通知'
    },
    {
        id: 'noti-4',
        title: 'Meeting Reminder',
        message: 'You have a meeting with the team in 30 minutes.',
        time: '30 minutes ago',
        read: false,
        poster: 'François Dupont'
    },
    {
        id: 'noti-5',
        title: 'New Message',
        message: 'You have received a new message from Jane Smith',
        time: '2 hours ago',
        read: false,
        poster: 'Jane Smith'
    },
    {
        id: 'noti-6',
        title: 'Task Completed',
        message: 'Your assigned task has been marked as completed.',
        time: '4 hours ago',
        read: false,
        poster: 'Pedro Martínez'
    }
];

export default function Notification() {
    const notificationCount = mockNotifications.length;
    const displayCount = notificationCount > 10 ? '9+' : notificationCount.toString();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative inline-block">
                    <Button
                        aria-label="Notifications"
                        variant={'ghost'}
                        tabIndex={0}
                        size={'sm'}
                    >
                        <Bell className="h-4 w-4" />
                    </Button>

                    {notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {displayCount}
                        </div>
                    )}
                </div>
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
                    {mockNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'border-l-2 border-l-primary' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                    {notification.poster.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-medium text-sm">{notification.title}</h5>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{notification.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                                        {notification.message}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium">
                                            {notification.poster}
                                        </span>
                                        {!notification.read && (
                                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {notificationCount > 0 && (
                    <div className="p-3 border-t bg-muted/30 flex justify-between">
                        <Button variant="ghost" className="text-xs" size="sm">
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

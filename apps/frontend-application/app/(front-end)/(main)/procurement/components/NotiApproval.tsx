import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';
import { notifications } from './types_data';
import * as m from '@/paraglide/messages.js';

const NotiApproval: React.FC = () => {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>{m.notification()}</CardTitle>
                <CardDescription>{m.notification_des()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[250px]">
                    <ul className="divide-y">
                        {notifications.map((notification, index) => (
                            <li key={index} className="flex items-start p-4 hover:bg-gray-50">
                                <Bell className="w-5 h-5 mt-0.5 text-gray-400 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-800">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {notification.time}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default NotiApproval;

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, DollarSign, Users } from 'lucide-react'
import { ApprovalActivity, getBadgeClasses, RECENT_ACTIVITIES } from './types_data'
import * as m from '@/paraglide/messages.js';

const getActionIcon = (action: ApprovalActivity['action']) => {
    switch (action) {
        case 'Approved':
        case 'Approved with changes':
            return <CheckCircle className="w-3 h-3 mr-1" />
        case 'Rejected':
            return <AlertCircle className="w-3 h-3 mr-1" />
    }
}

const RecentApprovals = () => {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>{m.recent_approvals()}</CardTitle>
                <CardDescription>{m.recent_approvals_des()}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[250px]">
                    <ul className="divide-y">
                        {RECENT_ACTIVITIES.map((activity, index) => (
                            <li key={index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between mb-1">
                                    <Badge
                                        variant={
                                            activity.action === "Approved" ? "default" :
                                                (activity.action === "Rejected" ? "destructive" : "secondary")
                                        }
                                        className={getBadgeClasses(activity.action)}
                                    >
                                        {getActionIcon(activity.action)}
                                        {activity.action}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {activity.time}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                    {activity.request}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 space-x-2">
                                    <span>
                                        <Users className="w-3 h-3 inline mr-1" />
                                        {activity.department}
                                    </span>
                                    <span>
                                        <DollarSign className="w-3 h-3 inline mr-1" />
                                        {activity.amount.toLocaleString()}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default RecentApprovals
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { fetchRecentActivity } from '@/services/dashboard/recent-activity'
import { RecentActivityType } from '@/types/main'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = async () => {
    const recentActivity = await fetchRecentActivity()
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <ScrollArea className="h-[287px]">
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity: RecentActivityType) => (
                            <div key={activity.title} className="flex items-center gap-4 rounded-lg border p-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{activity.title}</span>
                                        <Badge variant="outline">{activity.cluster}</Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{activity.description}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(activity.create_at, { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </ScrollArea>
        </Card>
    )
}

export default RecentActivity;
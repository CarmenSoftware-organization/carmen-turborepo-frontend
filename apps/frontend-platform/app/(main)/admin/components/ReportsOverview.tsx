import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchReportOverview } from '@/services/dashboard/report'
import { Clock } from 'lucide-react'

const ReportsOverview = async () => {
    const reportOverview = await fetchReportOverview();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Overview</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <div className="flex items-center text-lg font-bold">
                                    {reportOverview.today}
                                    <Badge variant="secondary" className="ml-2">
                                        Today
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Reports Generated
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <div className="flex items-center text-lg font-bold">
                                    {reportOverview.thisWeek}
                                    <Badge variant="secondary" className="ml-2">
                                        This Week
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Total Reports
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <div className="flex items-center text-lg font-bold">
                                    {reportOverview.active}
                                    <Badge variant="secondary" className="ml-2">
                                        Active
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Report Templates
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="space-y-1">
                                <div className="flex items-center text-lg font-bold">
                                    {reportOverview.uptime} %
                                    <Badge variant="secondary" className="ml-2">
                                        Uptime
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    System Status
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ReportsOverview
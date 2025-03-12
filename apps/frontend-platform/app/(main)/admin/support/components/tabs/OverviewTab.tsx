import { getSupport } from '@/services/support/support';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import SupportTable from './SupportTable';
import { SupportType } from '@/types/main';

interface OverviewTabProps {
    supports: SupportType;
}
const OverviewTab = ({ supports }: OverviewTabProps) => {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{supports.tickets.total}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span> Active support requests</span>
                            <span className="ml-2 font-medium">
                                +{supports.tickets.new} today
                            </span>
                        </div>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Response</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{supports.average_response_time.time} h</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>Response time</span>
                            <span className="ml-2 font-medium">
                                {supports.average_response_time.response_time}h this week
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{supports.resolution_rate.rate} h</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>Tickets resolved</span>
                            <span className="ml-2 font-medium">
                                +{supports.resolution_rate.resolution_rate}% this month
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 " />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{supports.critical_issues.total} h</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>High priority</span>
                            <span className="ml-2 font-medium">
                                {supports.critical_issues.resolved} from yesterday
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <SupportTable tickets={supports.support_results} />
        </>
    )
}

export default OverviewTab
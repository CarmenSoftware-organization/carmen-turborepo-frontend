"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/i18n';
import { ArrowLeft, CheckCircle2, ClipboardList } from 'lucide-react';
import { useParams } from 'next/navigation'
import React from 'react'
import { mockPeriodEndDetail } from '../data';
import { getStatusBadge } from '../components/PeriodEndTable';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
const PeriodEndIdPage = () => {
    const router = useRouter()
    const { id } = useParams() as { id: string };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4 cursor-pointer" onClick={() => router.push('/inventory-management/period-end')} />
                        <h2 className="text-2xl font-bold tracking-tight">
                            Period End - {mockPeriodEndDetail.period}
                        </h2>
                        {getStatusBadge(mockPeriodEndDetail.status)}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {format(mockPeriodEndDetail.startDate, "PP")} - {format(mockPeriodEndDetail.endDate, "PP")}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size={'sm'}>Cancel Period End</Button>
                    <Button size={'sm'}>Complete Period End</Button>
                </div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Period Information</CardTitle>
                        <CardDescription>Details about the current period end process</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Period ID</span>
                            <span className="font-medium">{id}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Start Date</span>
                            <span className="font-medium">{format(mockPeriodEndDetail.startDate, "PP")}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">End Date</span>
                            <span className="font-medium">{format(mockPeriodEndDetail.endDate, "PP")}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Status</span>
                            <span>{getStatusBadge(mockPeriodEndDetail.status)}</span>
                        </div>
                        {mockPeriodEndDetail.completedBy && (
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Completed By</span>
                                <span className="font-medium">{mockPeriodEndDetail.completedBy}</span>
                            </div>
                        )}
                        {mockPeriodEndDetail.completedAt && (
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Completed At</span>
                                <span className="font-medium">
                                    {format(mockPeriodEndDetail.completedAt, "PP")}
                                </span>
                            </div>
                        )}
                        {mockPeriodEndDetail.notes && (
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Notes</span>
                                <span className="font-medium">{mockPeriodEndDetail.notes}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Checklist</CardTitle>
                        <CardDescription>Required tasks for period end completion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockPeriodEndDetail.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={cn(
                                        "flex items-center justify-between p-2 rounded-lg border",
                                        task.status === 'completed' ? "bg-green-50" : ""
                                    )}
                                >
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2
                                            className={cn(
                                                "h-5 w-5",
                                                task.status === 'completed'
                                                    ? "text-green-500"
                                                    : "text-gray-300"
                                            )}
                                        />
                                        <span className="font-medium">{task.name}</span>
                                    </div>
                                    {task.status === 'completed' && (
                                        <div className="text-sm text-muted-foreground">
                                            Completed by {task.completedBy}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="adjustments" className="w-full">
                <TabsList>
                    <TabsTrigger value="adjustments" className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Adjustments
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="adjustments" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Period End Adjustments</CardTitle>
                            <CardDescription>
                                View all adjustments made during this period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created By</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockPeriodEndDetail.adjustments.map((adjustment) => (
                                        <TableRow key={adjustment.id}>
                                            <TableCell className="font-medium">
                                                {adjustment.id}
                                            </TableCell>
                                            <TableCell>{adjustment.type}</TableCell>
                                            <TableCell className="text-right">
                                                {adjustment.amount.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD'
                                                })}
                                            </TableCell>
                                            <TableCell>{adjustment.reason}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={adjustment.status === 'approved' ? 'default' : 'secondary'}
                                                >
                                                    {adjustment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{adjustment.createdBy}</TableCell>
                                            <TableCell>{format(adjustment.createdAt, "PP")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default PeriodEndIdPage;
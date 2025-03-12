import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Building, Calendar, Package, Trash, User } from 'lucide-react'
import React from 'react'
import CountProgress from '../../physical-count-management/components/CountProgress'
import { Button } from '@/components/ui/button'

interface SpotCheckDetails {
    storeName: string
    department: string
    userName?: string
    date: string
    status: "pending" | "completed" | "in-progress"
    itemCount: number
    lastCountDate?: string
    variance?: number
    notes?: string
    completedCount: number
}

interface Props {
    countDetails?: Partial<SpotCheckDetails>
    storeName?: string
    department?: string
    userName?: string
    date?: string
    status?: "pending" | "completed" | "in-progress"
    itemCount?: number
    lastCountDate?: string
    variance?: number
    notes?: string
    completedCount?: number
    onStartCount: () => void
    onDelete: () => void
}
const CountDetailCard: React.FC<Props> = ({
    countDetails,
    storeName: propStoreName,
    department: propDepartment,
    userName: propUserName,
    date: propDate,
    status: propStatus,
    itemCount: propItemCount,
    lastCountDate: propLastCountDate,
    variance: propVariance,
    notes: propNotes,
    completedCount: propCompletedCount,
    onStartCount,
    onDelete
}) => {

    const {
        storeName = propStoreName ?? '',
        department = propDepartment ?? '',
        userName = propUserName ?? '',
        date = propDate ?? '',
        status = propStatus ?? 'pending',
        itemCount = propItemCount ?? 0,
        lastCountDate = propLastCountDate,
        variance = propVariance ?? 0,
        notes = propNotes,
        completedCount = propCompletedCount ?? 0,
    } = countDetails || {}

    const currentStatus = status || "pending"
    const currentItemCount = itemCount || 0
    const currentCompletedCount = completedCount || 0
    const currentVariance = variance || 0

    const statusStyles = {
        pending: "text-yellow-600 bg-yellow-50",
        completed: "text-green-600 bg-green-50",
        "in-progress": "text-blue-600 bg-blue-50"
    }

    const statusLabels = {
        pending: "Pending",
        completed: "Completed",
        "in-progress": "In Progress"
    }

    const varianceColor = currentVariance === 0
        ? "text-gray-600"
        : currentVariance > 0
            ? "text-green-600"
            : "text-red-600"
    return (
        <Card className="overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-gray-50 p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <Building className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{storeName}</h3>
                                <div className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[currentStatus])}>
                                    {statusLabels[currentStatus]}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{department}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{userName || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{currentItemCount} items</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            Last count: {lastCountDate || '-'}
                        </span>
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="font-semibold">Variance</h4>
                    <p className={cn("text-lg font-bold", varianceColor)}>
                        {currentVariance > 0 ? "+" : ""}{currentVariance}%
                    </p>
                </div>
                <CountProgress
                    total={currentItemCount}
                    completed={currentCompletedCount}
                    className="mt-4"
                />
                {notes && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Notes</h4>
                        <p className="text-sm text-gray-600">{notes}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 flex justify-between gap-2">
                <Button
                    className="flex-1"
                    onClick={onStartCount}
                    disabled={currentStatus === 'completed'}
                >
                    {currentStatus === 'pending' ? 'Start Count' : 'Continue Count'}
                </Button>
                {(currentStatus === 'pending' || currentStatus === 'in-progress') && (
                    <Button variant="ghost" size="icon" onClick={onDelete}>
                        <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default CountDetailCard
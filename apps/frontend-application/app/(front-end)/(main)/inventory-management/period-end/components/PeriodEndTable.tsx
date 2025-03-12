import { Badge } from '@/components/ui/badge'
import React from 'react'
import { PeriodEndRecord } from '../data'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import * as m from '@/paraglide/messages.js';
import SkeletonTableLoading from '@/components/ui-custom/Loading/SkeltonTableLoading';
import { format } from 'date-fns';
import { useRouter } from '@/lib/i18n';

export const getStatusBadge = (status: PeriodEndRecord['status']) => {
    const statusStyles = {
        open: "bg-blue-100 text-blue-800",
        in_progress: "bg-yellow-100 text-yellow-800",
        closed: "bg-green-100 text-green-800"
    }
    const statusLabels = {
        open: "Open",
        in_progress: "In Progress",
        closed: "Closed"
    }
    return (
        <Badge className={statusStyles[status]}>
            {statusLabels[status]}
        </Badge>
    )
}

interface PeriodEndProps {
    periodEnds: PeriodEndRecord[]
    isLoading: boolean
}

const PeriodEndTable: React.FC<PeriodEndProps> = ({ periodEnds, isLoading }) => {
    const router = useRouter();

    if (isLoading) {
        return <SkeletonTableLoading />;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Period ID</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className='text-center'>{m.status_text()}</TableHead>
                    <TableHead>Completed By</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {periodEnds?.map((periodEnd) => (
                    <TableRow
                        key={periodEnd.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/inventory-management/period-end/${periodEnd.id}`)}
                    >
                        <TableCell className="font-medium">{periodEnd.id}</TableCell>
                        <TableCell>{periodEnd.period}</TableCell>
                        <TableCell>{format(periodEnd.startDate, "PP")}</TableCell>
                        <TableCell>{format(periodEnd.endDate, "PP")}</TableCell>
                        <TableCell>{getStatusBadge(periodEnd.status)}</TableCell>
                        <TableCell>{periodEnd.completedBy || "-"}</TableCell>
                        <TableCell>
                            {periodEnd.completedAt ? format(periodEnd.completedAt, "PP") : "-"}
                        </TableCell>
                        <TableCell>{periodEnd.notes || "-"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default PeriodEndTable
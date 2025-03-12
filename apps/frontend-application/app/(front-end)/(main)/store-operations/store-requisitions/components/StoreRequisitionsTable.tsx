import React from 'react'
import { requisitions, RequisitionType, statusVariantMap } from '../data'
import * as m from '@/paraglide/messages.js';
import SkeletonTableLoading from '@/components/ui-custom/Loading/SkeltonTableLoading';
import EmptyState from '@/components/ui-custom/EmptyState';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
interface StoreRequisitionsProps {
    storeRequisition: RequisitionType[]
    isLoading: boolean
}
const StoreRequisitionsTable: React.FC<StoreRequisitionsProps> = ({
    storeRequisition, isLoading
}) => {
    if (isLoading) {
        return <SkeletonTableLoading />;
    }
    if (storeRequisition.length === 0) {
        return (
            <EmptyState title={m.title_store_requisition_not_found()} description={m.title_store_requisition_not_found()} />
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{m.date()}</TableHead>
                    <TableHead>{m.ref()} #</TableHead>
                    <TableHead>{m.request_to()}</TableHead>
                    <TableHead>{m.store_name()}</TableHead>
                    <TableHead>{m.description()}</TableHead>
                    <TableHead>{m.total_amout()}</TableHead>
                    <TableHead className='text-center'>{m.status_text()}</TableHead>
                    <TableHead className='text-center'>{m.action_text()}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requisitions?.map((requisition) => (
                    <TableRow key={requisition.refNo} className='text-xs'>
                        <TableCell>{requisition.date}</TableCell>
                        <TableCell>{requisition.refNo}</TableCell>
                        <TableCell>{requisition.requestTo}</TableCell>
                        <TableCell>{requisition.storeName}</TableCell>
                        <TableCell>{requisition.description}</TableCell>
                        <TableCell className='font-mono'>
                            {new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(requisition.totalAmount)}
                        </TableCell>
                        <TableCell className='text-center'>
                            <StatusBadge variant={statusVariantMap[requisition.status]}>
                                {requisition.status}
                            </StatusBadge>
                        </TableCell>
                        <TableCell className='text-center'>
                            <Button asChild variant="ghost" size={'sm'}>
                                <Link href={`/store-operations/store-requisitions/${requisition.refNo}`}>
                                    <Eye />
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default StoreRequisitionsTable;
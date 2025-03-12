import { WorkFlowModel } from '@/dtos/purchase-request.dto'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import { CardsContainerSkeleton } from '@/components/ui-custom/Loading/CardsContainerSkeleton';


const enum PRWorkFlowFields {
    Stage = "stage",
    Approver = "approver",
    Status = "status",
    Date = "date",
    Comments = "comments",
}

const columns = [
    {
        key: PRWorkFlowFields.Stage,
        label: 'Stage'
    },
    {
        key: PRWorkFlowFields.Approver,
        label: 'Approver'
    },
    {
        key: PRWorkFlowFields.Status,
        label: 'Status'
    },
    {
        key: PRWorkFlowFields.Date,
        label: 'Date'
    },
    {
        key: PRWorkFlowFields.Comments,
        label: 'Comments'
    }
]
const PrWorkFlow = () => {
    const [workFlows, setWorkFlows] = useState<WorkFlowModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchWorkFlow = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/procurement/purchase-requests/work-flow');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setWorkFlows(result.data);
            } catch (err) {
                console.error('Error fetching: ', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkFlow();
    }, []);

    return (
        <>
            {/* Mobile View */}
            <div className="block md:hidden">
                <div className="grid grid-cols-1 gap-4">
                    {isLoading ? (
                        <CardsContainerSkeleton
                            fields={columns.length}
                            cards={5}
                            withAction
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {(workFlows.map((wf) => (
                                <Card key={wf.id} className="hover:shadow-md transition-all">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {columns.map((column) => (
                                                <div key={column.key} className="flex justify-between text-xs">
                                                    <span className="font-medium">{column.label}:</span>
                                                    <span>
                                                        {wf[column.key]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )))}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            {columns.map((column) => (
                                <TableHead key={column.key}>
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBodySkeleton
                            columns={columns.length}
                            rows={5}
                            withAction
                        />
                    ) : (
                        <TableBody>
                            {(workFlows.map((wf, index) => (
                                <TableRow key={wf.id} className="text-xs">
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {wf[column.key] ? wf[column.key] : '-'}
                                        </TableCell>
                                    ))}

                                </TableRow>
                            )))}
                        </TableBody>
                    )}

                </Table>
                {/* <PaginationComponent
                    currentPage={page}
                    totalPages={totalPage}
                    onPageChange={handlePageChange}
                /> */}
            </div>
        </>
    )
}

export default PrWorkFlow
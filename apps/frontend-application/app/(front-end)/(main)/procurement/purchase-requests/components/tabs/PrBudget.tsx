import { CardsContainerSkeleton } from '@/components/ui-custom/Loading/CardsContainerSkeleton';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BudgetModel } from '@/dtos/purchase-request.dto';
import { FieldConfig } from '@/lib/util/uiConfig';
import React, { useEffect, useState } from 'react'

const enum BudgetField {
    Location = 'location',
    Category = 'category',
    TotalBudget = 'totalBudget',
    SoftCommitmentDeptHead = 'softCommitmentDeptHead',
    SoftCommitmentPO = 'softCommitmentPO',
    HardCommitment = 'hardCommitment',
    AvailableBudget = 'availableBudget',
    CurrentPRAmount = 'currentPRAmount',
}

const columns: FieldConfig<BudgetModel>[] = [
    {
        key: BudgetField.Location,
        label: 'Location'
    },
    {
        key: BudgetField.Category,
        label: 'Category',
    },
    {
        key: BudgetField.TotalBudget,
        label: 'Total Budget'
    },
    {
        key: BudgetField.SoftCommitmentDeptHead,
        label: 'Soft Commitment Dept Head'
    },
    {
        key: BudgetField.SoftCommitmentPO,
        label: 'Soft Commitment PO'
    },
    {
        key: BudgetField.HardCommitment,
        label: 'Hard Commitment'
    },
    {
        key: BudgetField.AvailableBudget,
        label: 'Available Budget'
    },
    {
        key: BudgetField.CurrentPRAmount,
        label: 'Current PR Amount'
    },
];


const PrBudget = () => {
    const [budgets, setBudgets] = useState<BudgetModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/procurement/purchase-requests/budget');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setBudgets(result.data);
            } catch (err) {
                console.error('Error fetching: ', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBudget();
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
                            {(budgets.map((budget) => (
                                <Card key={budget.id} className="hover:shadow-md transition-all">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {columns.map((column) => (
                                                <div key={column.key} className="flex justify-between text-xs">
                                                    <span className="font-medium">{column.label}:</span>
                                                    <span>
                                                        {column.render
                                                            ? column.render(budget[column.key])
                                                            : budget[column.key]
                                                        }
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
                                <TableHead key={column.key} className={column.width}>
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
                            {(budgets.map((vendor, index) => (
                                <TableRow key={vendor.id} className="text-xs">
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {column.render
                                                ? column.render(vendor[column.key])
                                                : vendor[column.key]
                                            }
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

export default PrBudget
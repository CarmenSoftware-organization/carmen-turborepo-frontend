import { GetAllPrDto } from "@/dtos/pr.dto";
import { useState } from "react";
import { FileText, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import PaginationComponent from "@/components/PaginationComponent";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Link } from "@/lib/navigation";

interface PurchaseRequestListProps {
    readonly purchaseRequests: GetAllPrDto[];
    readonly currentPage?: number;
    readonly totalPages?: number;
    readonly onPageChange?: (page: number) => void;
    readonly isLoading: boolean;
}

export default function PurchaseRequestList({
    purchaseRequests,
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    isLoading
}: PurchaseRequestListProps) {
    const t = useTranslations('TableHeader');

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === purchaseRequests.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = purchaseRequests.map(pr => pr.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = purchaseRequests?.length > 0 && selectedItems.length === purchaseRequests.length;

    const renderTableContent = () => {
        if (isLoading) return <TableBodySkeleton rows={8} />;

        if (purchaseRequests.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-sm text-muted-foreground">No purchase requests found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {purchaseRequests.map((pr) => (
                    <TableRow key={pr.id}>
                        <TableCell className="text-center w-10">
                            <Checkbox
                                id={`checkbox-${pr.id}`}
                                checked={selectedItems.includes(pr.id ?? '')}
                                onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                                aria-label={`Select ${pr.pr_no}`}
                            />
                        </TableCell>
                        <TableCell>{pr.pr_no}</TableCell>
                        <TableCell className="text-center">{format(new Date(pr.pr_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-center">
                            <Badge>
                                {pr.current_workflow_status}
                            </Badge>
                        </TableCell>
                        <TableCell>{pr.requestor_name}</TableCell>
                        <TableCell>{pr.department_name}</TableCell>
                        <TableCell>{pr.total_amount}</TableCell>
                        <TableCell className="text-center">
                            <Badge>
                                {pr.pr_status}
                            </Badge>
                        </TableCell>
                        <TableCell className="w-[100px] text-right">
                            <div className="flex items-center justify-end">
                                <Button variant="ghost" size={'sm'} className="h-7 w-7" asChild>
                                    <Link href={`/procurement/purchase-request/${pr.id}`}>
                                        <FileText className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="sr-only">More options</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("Approve", pr.id);
                                            }}
                                        >
                                            Print
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("Download", pr.id);
                                            }}
                                        >
                                            Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log("Delete", pr.id);
                                            }}
                                            className="text-destructive"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Table className="border">
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all purchase requests"
                                />
                            </TableHead>
                            <TableHead>PR Number</TableHead>
                            <TableHead className="text-center">Date</TableHead>
                            <TableHead className="text-center">Current Workflow</TableHead>
                            <TableHead>Requestor</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    {renderTableContent()}
                </Table>

            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    )
}

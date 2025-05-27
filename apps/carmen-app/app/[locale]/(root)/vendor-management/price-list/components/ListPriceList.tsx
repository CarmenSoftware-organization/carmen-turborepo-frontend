import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PriceListDto } from "@/dtos/price-list.dto";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeletePriceList } from "@/hooks/usePriceList";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ListPriceListProps {
    readonly priceLists?: PriceListDto[];
    readonly isLoading?: boolean;
}

export default function ListPriceList({ priceLists = [], isLoading = false }: ListPriceListProps) {
    const { token, tenantId } = useAuth();
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string>('');

    const { mutate: deletePriceList, isPending: isDeleting } = useDeletePriceList(token, tenantId, deleteId);

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };
    const handleSelectAll = () => {
        if (selectedItems.length === priceLists.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = priceLists.map(pr => pr.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        deletePriceList(undefined, {
            onSuccess: () => {
                toastSuccess({ message: 'Price list deleted successfully' });
                setDeleteId('');
                // Invalidate and refetch price list data
                queryClient.invalidateQueries({ queryKey: ["price-list", tenantId] });
            },
            onError: () => {
                toastError({ message: 'Failed to delete price list' });
                setDeleteId('');
            }
        });
    };

    const isAllSelected = priceLists?.length > 0 && selectedItems.length === priceLists.length;

    if (isLoading) {
        return <TableBodySkeleton rows={6} />
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {priceLists.length > 0 ? (
                        priceLists.map((priceList) => (
                            <TableRow key={priceList.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedItems.includes(priceList.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(priceList.id ?? '')}
                                    />
                                </TableCell>
                                <TableCell>
                                    <p>{priceList.product_name}</p>
                                    <p className="text-muted-foreground">{priceList.note}</p>
                                </TableCell>
                                <TableCell>{format(priceList.from_date, 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{format(priceList.to_date, 'dd/MM/yyyy')}</TableCell>
                                <TableCell>
                                    <Badge variant={priceList.is_active ? 'active' : 'inactive'}>
                                        {priceList.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="w-7 h-7" asChild>
                                        <Link href={`/vendor-management/price-list/${priceList.id}`}>
                                            <FileText className="h-3 w-3" />
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-7 h-7"
                                                disabled={isDeleting && deleteId === priceList.id}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Price List</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this price list for &quot;{priceList.product_name}&quot;?
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(priceList.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center">No results.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

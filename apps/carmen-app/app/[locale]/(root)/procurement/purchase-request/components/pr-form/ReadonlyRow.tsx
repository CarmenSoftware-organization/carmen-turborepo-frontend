import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
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
import {
    CheckCircleIcon,
    MapPin,
    MoreHorizontal,
    Package,
    SendIcon,
    SquarePen,
    Trash2,
} from "lucide-react";

interface ReadonlyRowProps {
    item: PurchaseRequestDetailItem;
    index: number;
    getCurrencyCode: (currencyId: string) => string;
    onEdit: () => void;
    onDelete: () => void;
    isReadOnly: boolean;
}

/**
 * ReadonlyRow component
 * 
 * Displays a purchase request item in read-only mode
 * Includes action buttons for edit, delete, approve, and review
 */
export default function ReadonlyRow({
    item,
    index,
    getCurrencyCode,
    onEdit,
    onDelete,
    isReadOnly,
}: ReadonlyRowProps) {
    return (
        <TableRow key={item.id || item.tempId || index}>
            <TableCell>
                <Checkbox />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium">{item.location_name || "-"}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                    Wait API
                </p>
            </TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <div>
                        <p className="text-sm font-medium">{item.product_name || "-"}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <p className="text-sm text-right font-semibold">
                    {item.requested_qty} {item.requested_unit_name || "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                    (= {item.requested_base_qty} {item.inventory_unit_name || "-"})
                </p>
            </TableCell>
            <TableCell className="w-[40px] text-right">
                <p className="text-sm text-right font-semibold">
                    {item.approved_qty} {item.approved_unit_name || "-"}
                </p>
                <Separator />
                <p className="text-xs font-semibold text-blue-500">
                    FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                </p>
            </TableCell>
            <TableCell className="text-right">
                <p className="text-sm text-right font-semibold">
                    {getCurrencyCode(item.currency_id)} {item.price.toFixed(2)}
                </p>
                <p className="text-xs font-semibold text-blue-500">
                    THB {item.base_price || 0}
                </p>
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="cursor-pointer">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2 text-green-500">
                                <CheckCircleIcon className="h-4 w-4" />
                                <p className="text-sm font-semibold">Approve Item</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2 text-yellow-500">
                                <SendIcon className="h-4 w-4" />
                                <p className="text-sm font-semibold">Send for Review</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onEdit}
                            disabled={isReadOnly}
                        >
                            <div className="flex items-center gap-2">
                                <SquarePen className="h-4 w-4" />
                                <p className="text-sm font-semibold">Edit</p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={isReadOnly}>
                            <div className="flex items-center text-destructive">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="flex items-center gap-2 text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                            <p className="text-sm font-semibold">Delete</p>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Confirm Delete
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this item?
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={onDelete}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
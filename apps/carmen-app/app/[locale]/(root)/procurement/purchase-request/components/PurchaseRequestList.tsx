import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseRequestDto } from "@/dtos/procurement.dto";
import { Eye, Mail, MoreVertical, Pencil, Trash } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PurchaseRequestListProps {
    readonly purchaseRequests: PurchaseRequestDto[];
}

const prStatusColor = (status: string) => {
    if (status === 'Draft') {
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">
            {status}
        </Badge>
    } else if (status === 'Submitted') {
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {status}
        </Badge>
    } else if (status === 'Completed') {
        return <Badge variant="outline" className="bg-green-100 text-green-800">
            {status}
        </Badge>
    }
}
export default function PurchaseRequestList({ purchaseRequests }: PurchaseRequestListProps) {
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

    const isAllSelected = purchaseRequests.length > 0 && selectedItems.length === purchaseRequests.length;

    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all purchase requests"
                                />
                            </TableHead>
                            <TableHead>{t('pr_no')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('type')}</TableHead>
                            <TableHead>{t('description')}</TableHead>
                            <TableHead>{t('requestor')}</TableHead>
                            <TableHead>{t('department')}</TableHead>
                            <TableHead>{t('amount')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseRequests.map((pr) => (
                            <TableRow key={pr.id}>
                                <TableCell className="text-center w-10">
                                    <Checkbox
                                        id={`checkbox-${pr.id}`}
                                        checked={selectedItems.includes(pr.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                                        aria-label={`Select ${pr.title}`}
                                    />
                                </TableCell>
                                <TableCell>{pr.pr_no}</TableCell>
                                <TableCell>{pr.date_created}</TableCell>
                                <TableCell>{pr.type}</TableCell>
                                <TableCell className="w-[300px]">{pr.description}</TableCell>
                                <TableCell>{pr.requestor}</TableCell>
                                <TableCell>{pr.department}</TableCell>
                                <TableCell>{pr.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>
                                    {prStatusColor(pr.status ?? '')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size={'sm'} asChild>
                                            <Link href={`/procurement/purchase-request/${pr.id}?view`}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size={'sm'} asChild>
                                            <Link href={`/procurement/purchase-request/${pr.id}?edit`}>
                                                <Pencil className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size={'sm'} className="text-destructive">
                                            <Trash className="h-3 w-3" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
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
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("Reject", pr.id);
                                                    }}
                                                >
                                                    Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("Send Email", pr.id);
                                                    }}
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    Send Email
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                    >
                        {isAllSelected ? t('unselect_all') : t('select_all')}
                    </Button>
                    {selectedItems.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            {selectedItems.length} {t('items_selected')}
                        </span>
                    )}
                </div>
                {purchaseRequests.map((pr) => (
                    <Card key={pr.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4 border-b bg-muted">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`mobile-checkbox-${pr.id}`}
                                        checked={selectedItems.includes(pr.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                                        aria-label={`Select ${pr.title}`}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-primary">{pr.pr_no}</p>
                                        <p className="text-xs text-muted-foreground">{pr.date_created}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="mt-1">
                                        {prStatusColor(pr.status ?? '')}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 col-span-2">
                                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                                    <p className="text-xs font-medium line-clamp-2">{pr.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('type')}</p>
                                    <p className="text-xs font-medium">{pr.type}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('requestor')}</p>
                                    <p className="text-xs font-medium">{pr.requestor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('department')}</p>
                                    <p className="text-xs font-medium">{pr.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('amount')}</p>
                                    <p className="text-xs font-medium">{pr.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

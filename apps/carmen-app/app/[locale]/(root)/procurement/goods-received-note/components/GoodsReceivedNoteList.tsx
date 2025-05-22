import { GoodsReceivedNoteListDto } from "@/dtos/procurement.dto";
import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import PaginationComponent from "@/components/PaginationComponent";


interface GoodsReceivedNoteListProps {
    readonly goodsReceivedNotes: GoodsReceivedNoteListDto[];
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function GoodsReceivedNoteList({ goodsReceivedNotes, currentPage, totalPages, onPageChange }: GoodsReceivedNoteListProps) {
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
        if (selectedItems.length === goodsReceivedNotes.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = goodsReceivedNotes.map(grn => grn.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = goodsReceivedNotes?.length > 0 && selectedItems.length === goodsReceivedNotes.length;

    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader className="border">
                        <TableRow className="bg-muted">
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all purchase requests"
                                />
                            </TableHead>
                            <TableHead>{t('grn_number')}</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>{t('vendor')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead>{t('amount')}</TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goodsReceivedNotes?.map(grn => (
                            <TableRow key={grn.id}>
                                <TableCell className="text-center w-10">
                                    <Checkbox
                                        id={`checkbox-${grn.id}`}
                                        checked={selectedItems.includes(grn.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(grn.id ?? '')}
                                        aria-label={`Select ${grn.grn_no}`}
                                    />
                                </TableCell>
                                <TableCell>{grn.grn_no ?? '-'}</TableCell>
                                <TableCell>
                                    {grn.name ?? '-'}
                                    {grn.description && <p className="text-xs text-muted-foreground">{grn.description}</p>}
                                </TableCell>
                                <TableCell>{grn.vendor_name ?? '-'}</TableCell>
                                <TableCell>{grn.created_at ? format(new Date(grn.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={grn.is_active ? 'active' : 'inactive'}>
                                        {grn.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{grn.total_amount}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size={'sm'} asChild className="h-7 w-7">
                                            <Link href={`/procurement/goods-received-note/${grn.id}`}>
                                                <FileText className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    Print GRN
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Download PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Copy Reference
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {totalPages > 1 && (
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </div>
    )
} 
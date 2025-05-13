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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/lib/navigation";
import { PaginationDto } from "@/dtos/pagination.dto";
import { format } from "date-fns";
import PaginationComponent from "@/components/PaginationComponent";
const grnColor = (status: string) => {
    if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Approved') {
        return 'bg-green-100 text-green-800';
    } else if (status === 'Rejected') {
        return 'bg-red-100 text-red-800';
    }
}

interface GoodsReceivedNoteListProps {
    readonly goodsReceivedNotes: GoodsReceivedNoteListDto[];
    readonly paginate: PaginationDto;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function GoodsReceivedNoteList({ goodsReceivedNotes, paginate, currentPage, totalPages, onPageChange }: GoodsReceivedNoteListProps) {
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
                                <TableCell>{grn.grn_no ? grn.grn_no : '-'}</TableCell>
                                <TableCell>{grn.vendor_name ? grn.vendor_name : '-'}</TableCell>
                                <TableCell>{grn.created_at ? format(new Date(grn.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={grn.is_active ? 'active' : 'inactive'}>
                                        {grn.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>waiting for amount</TableCell>
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


            <pre>{JSON.stringify(goodsReceivedNotes, null, 2)}</pre>
            <pre>{JSON.stringify(paginate, null, 2)}</pre>
        </div>
    )

    // return (
    //     <div className="space-y-4">
    //         {/* Desktop Table View */}
    //         <div className="hidden md:block">
    //             <Table>
    //                 <TableHeader className="border">
    //                     <TableRow className="bg-muted">
    //                         <TableHead className="w-10 text-center">
    //                             <Checkbox
    //                                 id="select-all"
    //                                 checked={isAllSelected}
    //                                 onCheckedChange={handleSelectAll}
    //                                 aria-label="Select all purchase requests"
    //                             />
    //                         </TableHead>
    //                         <TableHead>{t('grn_number')}</TableHead>
    //                         <TableHead>{t('vendor')}</TableHead>
    //                         <TableHead>{t('date')}</TableHead>
    //                         <TableHead>{t('amount')}</TableHead>
    //                         <TableHead>{t('status')}</TableHead>
    //                         <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
    //                     </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                     {goodsReceivedNotes.map((grn) => (
    //                         <TableRow key={grn.id}>
    //                             <TableCell className="text-center w-10">
    //                                 <Checkbox
    //                                     id={`checkbox-${grn.id}`}
    //                                     checked={selectedItems.includes(grn.id ?? '')}
    //                                     onCheckedChange={() => handleSelectItem(grn.id ?? '')}
    //                                     aria-label={`Select ${grn.grn_number}`}
    //                                 />
    //                             </TableCell>
    //                             <TableCell className="font-medium">{grn.grn_number}</TableCell>
    //                             <TableCell>{grn.department}</TableCell>
    //                             <TableCell>{grn.date_created}</TableCell>
    //                             <TableCell>{grn.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
    //                             <TableCell>
    //                                 <Badge variant="outline" className={`${grnColor(grn.status)} rounded-full`}>
    //                                     {grn.status}
    //                                 </Badge>
    //                             </TableCell>
    //                             <TableCell>
    //                                 <div className="flex items-center justify-end">
    //                                     <Button variant="ghost" size={'sm'} asChild className="h-7 w-7">
    //                                         <Link href={`/procurement/goods-received-note/${grn.id}`}>
    //                                             <FileText className="h-4 w-4" />
    //                                         </Link>
    //                                     </Button>
    //                                     <Button variant="ghost" size={'sm'} className="h-7 w-7">
    //                                         <Trash2 className="h-4 w-4" />
    //                                     </Button>
    //                                     <DropdownMenu>
    //                                         <DropdownMenuTrigger asChild>
    //                                             <Button variant="ghost" size="icon" className="h-7 w-7">
    //                                                 <MoreHorizontal className="h-4 w-4" />
    //                                             </Button>
    //                                         </DropdownMenuTrigger>
    //                                         <DropdownMenuContent>
    //                                             <DropdownMenuItem>
    //                                                 Print GRN
    //                                             </DropdownMenuItem>
    //                                             <DropdownMenuItem>
    //                                                 Download PDF
    //                                             </DropdownMenuItem>
    //                                             <DropdownMenuItem>
    //                                                 Copy Reference
    //                                             </DropdownMenuItem>
    //                                         </DropdownMenuContent>
    //                                     </DropdownMenu>
    //                                 </div>
    //                             </TableCell>
    //                         </TableRow>
    //                     ))}
    //                 </TableBody>
    //             </Table>
    //         </div>

    //         {/* Mobile Card View */}
    //         <div className="grid gap-4 md:hidden">
    //             <div className="flex items-center justify-between">
    //                 <Button
    //                     variant="outline"
    //                     size="sm"
    //                     onClick={handleSelectAll}
    //                 >
    //                     {isAllSelected ? 'Unselect All' : 'Select All'}
    //                 </Button>
    //                 {selectedItems.length > 0 && (
    //                     <span className="text-xs text-muted-foreground">
    //                         {selectedItems.length} Items Selected
    //                     </span>
    //                 )}
    //             </div>
    //             {goodsReceivedNotes.map((grn) => (
    //                 <Card key={grn.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
    //                     <CardHeader className="p-4">
    //                         <div className="flex justify-between items-start">
    //                             <div className="flex items-center gap-2">
    //                                 <Checkbox
    //                                     id={`mobile-checkbox-${grn.id}`}
    //                                     checked={selectedItems.includes(grn.id ?? '')}
    //                                     onCheckedChange={() => handleSelectItem(grn.id ?? '')}
    //                                     aria-label={`Select ${grn.grn_number}`}
    //                                     className="mt-1"
    //                                 />
    //                                 <Badge variant="outline" className={`${grnColor(grn.status)} rounded-full`}>
    //                                     {grn.status}
    //                                 </Badge>
    //                                 <CardTitle className="text-base">{grn.grn_number}</CardTitle>
    //                             </div>
    //                             <div className="flex items-center">
    //                                 <Button variant="ghost" size={'sm'}>
    //                                     <FileText className="h-4 w-4" />
    //                                 </Button>
    //                                 <Button variant="ghost" size={'sm'}>
    //                                     <Pencil className="h-4 w-4" />
    //                                 </Button>
    //                                 <Button variant="ghost" size={'sm'}>
    //                                     <Trash2 className="h-4 w-4 text-destructive" />
    //                                 </Button>
    //                             </div>
    //                         </div>
    //                     </CardHeader>
    //                     <CardContent className="p-4 pt-0">
    //                         <div className="grid grid-cols-2 gap-4">
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('date')}</p>
    //                                 <p className="text-sm font-medium">{grn.date_created}</p>
    //                             </div>
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('delivery_date')}</p>
    //                                 <p className="text-sm font-medium">{grn.invoice_date}</p>
    //                             </div>
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('department')}</p>
    //                                 <p className="text-sm font-medium">{grn.department}</p>
    //                             </div>
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('currency')}</p>
    //                                 <p className="text-sm font-medium">{grn.currency}</p>
    //                             </div>
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('net_amount')}</p>
    //                                 <p className="text-sm font-medium">{grn.net_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
    //                             </div>
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('tax_amount')}</p>
    //                                 <p className="text-sm font-medium">{grn.tax_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
    //                             </div>
    //                             <div className="space-y-1">
    //                                 <p className="text-sm text-muted-foreground">{t('amount')}</p>
    //                                 <p className="text-sm font-medium">{grn.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
    //                             </div>
    //                         </div>
    //                     </CardContent>
    //                 </Card>
    //             ))}
    //         </div>
    //     </div>
    // )
} 
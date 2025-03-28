import { GoodsReceivedNoteDto } from "@/dtos/procurement.dto";
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
import { Eye, Pencil, Trash } from "lucide-react";

interface GoodsReceivedNoteListProps {
    readonly goodsReceivedNotes: GoodsReceivedNoteDto[];
}

export default function GoodsReceivedNoteList({ goodsReceivedNotes }: GoodsReceivedNoteListProps) {
    const t = useTranslations('TableHeader');
    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>{t('po_number')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('delivery_date')}</TableHead>
                            <TableHead>{t('department')}</TableHead>
                            <TableHead>{t('currency')}</TableHead>
                            <TableHead>{t('net_amount')}</TableHead>
                            <TableHead>{t('tax_amount')}</TableHead>
                            <TableHead>{t('amount')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goodsReceivedNotes.map((grn, index) => (
                            <TableRow key={grn.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{grn.grn_number}</TableCell>
                                <TableCell>{grn.date_created}</TableCell>
                                <TableCell>{grn.invoice_date}</TableCell>
                                <TableCell>{grn.department}</TableCell>
                                <TableCell>{grn.currency}</TableCell>
                                <TableCell>{grn.net_amount}</TableCell>
                                <TableCell>{grn.tax_amount}</TableCell>
                                <TableCell>{grn.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {grn.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {goodsReceivedNotes.map((grn) => (
                    <Card key={grn.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {grn.status}
                                    </Badge>
                                    <CardTitle className="text-base">{grn.grn_number}</CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('date')}</p>
                                    <p className="text-sm font-medium">{grn.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('delivery_date')}</p>
                                    <p className="text-sm font-medium">{grn.invoice_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('department')}</p>
                                    <p className="text-sm font-medium">{grn.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('currency')}</p>
                                    <p className="text-sm font-medium">{grn.currency}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('net_amount')}</p>
                                    <p className="text-sm font-medium">{grn.net_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('tax_amount')}</p>
                                    <p className="text-sm font-medium">{grn.tax_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{t('amount')}</p>
                                    <p className="text-sm font-medium">{grn.amount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 
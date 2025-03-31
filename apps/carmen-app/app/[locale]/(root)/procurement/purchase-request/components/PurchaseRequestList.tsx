import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseRequestDto } from "@/dtos/procurement.dto";
import { Eye, Trash } from "lucide-react";
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

interface PurchaseRequestListProps {
    readonly purchaseRequests: PurchaseRequestDto[];
}

export default function PurchaseRequestList({ purchaseRequests }: PurchaseRequestListProps) {
    const t = useTranslations('TableHeader');

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>{t('title_purchase_request')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('type')}</TableHead>
                            <TableHead>{t('department')}</TableHead>
                            <TableHead>{t('requestor')}</TableHead>
                            <TableHead>{t('amount')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseRequests.map((pr, index) => (
                            <TableRow key={pr.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{pr.title}</span>
                                        <span className="text-sm text-muted-foreground line-clamp-2">
                                            {pr.description}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{pr.date_created}</TableCell>
                                <TableCell>{pr.type}</TableCell>
                                <TableCell>{pr.department}</TableCell>
                                <TableCell>{pr.requestor}</TableCell>
                                <TableCell>{pr.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {pr.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" asChild>
                                            <Link href={`/procurement/purchase-request/${pr.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
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
                {purchaseRequests.map((pr) => (
                    <Card key={pr.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {pr.status}
                                    </Badge>
                                    <CardTitle className="text-base">{pr.title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" asChild>
                                        <Link href={`/procurement/purchase-request/${pr.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
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
                                    <p className="text-xs text-muted-foreground">{t('date')}</p>
                                    <p className="text-xs font-medium">{pr.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('type')}</p>
                                    <p className="text-xs font-medium">{pr.type}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                                    <p className="text-xs font-medium line-clamp-2">{pr.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('department')}</p>
                                    <p className="text-xs font-medium">{pr.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('requestor')}</p>
                                    <p className="text-xs font-medium">{pr.requestor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('amount')}</p>
                                    <p className="text-xs font-medium">{pr.amount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

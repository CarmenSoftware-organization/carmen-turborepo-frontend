import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SquarePen, Trash2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import FooterCustom from "@/components/table/FooterCustom";

interface ListDeliveryPointProps {
    readonly deliveryPoints: DeliveryPointGetDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly onPageChange: (page: number) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
    readonly onEdit: (deliveryPoint: DeliveryPointGetDto) => void;
    readonly onToggleStatus: (deliveryPoint: DeliveryPointGetDto) => void;
}

export default function ListDeliveryPoint({
    deliveryPoints,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    sort,
    onSort,
    onEdit,
    onToggleStatus
}: ListDeliveryPointProps) {
    const t = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");
    const tDeliveryPoint = useTranslations("DeliveryPoint");
    const renderTableContent = () => {
        if (deliveryPoints.length === 0 && !isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="p-3 bg-muted/50 rounded-full">
                                <MapPin className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    No delivery points found
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {tDeliveryPoint("notFoundDeliveryPoint")}
                                </p>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return deliveryPoints.map((deliveryPoint, index) => (
            <TableRow
                key={deliveryPoint.id}
                className="hover:bg-muted/30 transition-colors duration-150"
            >
                <TableCell className="w-12">
                    {index + 1}
                </TableCell>
                <TableCell className="font-medium">{deliveryPoint.name}</TableCell>
                <TableCell className="text-center w-24">
                    <Badge variant={deliveryPoint.is_active ? "active" : "inactive"}>
                        {deliveryPoint.is_active ? tCommon("active") : tCommon("inactive")}
                    </Badge>
                </TableCell>
                <TableCell className="w-24">
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(deliveryPoint)}
                            aria-label="Edit delivery point"
                            className="h-7 w-7 hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <SquarePen className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleStatus(deliveryPoint)}
                            disabled={!deliveryPoint.is_active}
                            aria-label={
                                deliveryPoint.is_active
                                    ? "Deactivate delivery point"
                                    : "Activate delivery point"
                            }
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="flex flex-col w-full">
            <Table className="border">
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="w-12">
                            #
                        </TableHead>
                        <TableHead
                            {...getSortableColumnProps("name", sort, onSort)}
                            className="font-medium"
                        >
                            <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                                {t("name")}
                                {renderSortIcon("name", sort)}
                            </div>
                        </TableHead>
                        <TableHead
                            {...getSortableColumnProps("is_active", sort, onSort)}
                            className="font-medium text-center w-24"
                        >
                            {t("status")}
                            {renderSortIcon("is_active", sort)}
                        </TableHead>
                        <TableHead className="w-24 text-right">
                            {t("action")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? (
                    <TableBodySkeleton rows={8} />
                ) : (
                    <TableBody>{renderTableContent()}</TableBody>
                )}
                <FooterCustom
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={onPageChange}
                    colSpanItems={3}
                    colSpanPagination={2}
                />
            </Table>
        </div>
    );
}
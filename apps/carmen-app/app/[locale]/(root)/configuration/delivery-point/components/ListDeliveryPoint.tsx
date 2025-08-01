import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

    const columns: TableColumn[] = [
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            width: "w-12",
            align: "center",
        },
        {
            title: (
                <div
                    {...getSortableColumnProps("name", sort, onSort)}
                    className="font-medium"
                >
                    <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                        {t("name")}
                        {renderSortIcon("name", sort)}
                    </div>
                </div>
            ),
            dataIndex: "name",
            key: "name",
            align: "left",
            render: (_: any, record: TableDataSource) => {
                const deliveryPoint = deliveryPoints.find(dp => dp.id === record.key);
                if (!deliveryPoint) return null;
                return (
                    <button
                        type="button"
                        className="text-primary cursor-pointer hover:underline transition-colors text-left text-xs md:text-base"
                        onClick={() => onEdit(deliveryPoint)}
                    >
                        {deliveryPoint.name}
                    </button>
                );
            },
        },
        {
            title: (
                <div
                    {...getSortableColumnProps("is_active", sort, onSort)}
                    className="font-medium"
                >
                    <div className="flex items-center justify-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                        {t("status")}
                        {renderSortIcon("is_active", sort)}
                    </div>
                </div>
            ),
            dataIndex: "is_active",
            key: "is_active",
            width: "w-0 md:w-20",
            align: "center",
            render: (is_active: boolean) => (
                <Badge
                    variant={is_active ? "active" : "inactive"}
                >
                    {is_active ? tCommon("active") : tCommon("inactive")}
                </Badge>
            ),
        },
        {
            title: t("action"),
            dataIndex: "action",
            key: "action",
            width: "w-0 md:w-20",
            align: "right",
            render: (_: any, record: TableDataSource) => {
                const deliveryPoint = deliveryPoints.find(dp => dp.id === record.key);
                if (!deliveryPoint) return null;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer hover:bg-transparent"
                                onClick={() => onToggleStatus(deliveryPoint)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const dataSource: TableDataSource[] = deliveryPoints.map((deliveryPoint, index) => ({
        key: deliveryPoint.id,
        no: (currentPage - 1) * 10 + index + 1,
        name: deliveryPoint.name,
        is_active: deliveryPoint.is_active,
    }));

    return (
        <TableTemplate
            columns={columns}
            dataSource={dataSource}
            emptyMessage="No data"
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
        />
    );
}
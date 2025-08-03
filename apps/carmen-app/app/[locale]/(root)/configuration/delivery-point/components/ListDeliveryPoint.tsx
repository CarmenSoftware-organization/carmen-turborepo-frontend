import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { Activity, List, MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";

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
    readonly selectedDeliveryPoints: string[];
    readonly onSelectAll: (isChecked: boolean) => void;
    readonly onSelect: (id: string) => void;
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
    onToggleStatus,
    selectedDeliveryPoints,
    onSelectAll,
    onSelect,
}: ListDeliveryPointProps) {
    const t = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={selectedDeliveryPoints.length === deliveryPoints.length}
                    onCheckedChange={onSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-8",
            align: "center",
            render: (_: any, record: TableDataSource) => {
                return <Checkbox checked={selectedDeliveryPoints.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
            },
        },
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            width: "w-8",
            align: "center",
        },
        {
            title: (
                <SortableColumnHeader
                    columnKey="name"
                    label={t("name")}
                    sort={sort ?? { field: "name", direction: "asc" }}
                    onSort={onSort ?? (() => { })}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "name",
            key: "name",
            icon: <List className="h-4 w-4" />,
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
                <SortableColumnHeader
                    columnKey="is_active"
                    label={t("status")}
                    sort={sort ?? { field: "is_active", direction: "asc" }}
                    onSort={onSort ?? (() => { })}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "is_active",
            key: "is_active",
            width: "w-0 md:w-20",
            align: "center",
            icon: <Activity className="h-4 w-4" />,
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
        select: false,
        key: deliveryPoint.id,
        no: (currentPage - 1) * 10 + index + 1,
        name: deliveryPoint.name,
        is_active: deliveryPoint.is_active,
    }));

    return (
        <TableTemplate
            columns={columns}
            dataSource={dataSource}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
        />
    );
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, MoreVertical, List, Info, Settings, Activity } from "lucide-react";
import { UnitDto } from "@/dtos/unit.dto";
import { Checkbox } from "@/components/ui/checkbox";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { useTranslations } from "next-intl";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";

interface ListUnitProps {
    readonly units: UnitDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly onPageChange: (page: number) => void;
    readonly onEdit: (unit: UnitDto) => void;
    readonly onDelete: (unit: UnitDto) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
    readonly selectedUnits: string[];
    readonly onSelectAll: (isChecked: boolean) => void;
    readonly onSelect: (id: string) => void;
}

export default function ListUnit({
    units,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    sort,
    onSort,
    selectedUnits,
    onSelectAll,
    totalItems,
    onSelect }: ListUnitProps) {

    const t = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={selectedUnits.length === units.length}
                    onCheckedChange={onSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-6",
            align: "center",
            render: (_: any, record: TableDataSource) => {
                return <Checkbox checked={selectedUnits.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
            },
        },
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            width: "w-6",
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
            width: "w-48",
            render: (_: any, record: TableDataSource) => {
                const unit = units.find(u => u.id === record.key);
                if (!unit) return null;
                return (
                    <button
                        type="button"
                        className="text-primary cursor-pointer hover:underline transition-colors text-left text-xs md:text-base"
                        onClick={() => onEdit(unit)}
                    >
                        {unit.name}
                    </button>
                );
            },
        },
        {
            title: t("description"),
            dataIndex: "description",
            icon: <Info className="h-4 w-4" />,
            key: "description",
            align: "left",
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
            icon: <Activity className="h-4 w-4" />,
            width: "w-36",
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
            icon: <Settings className="h-4 w-4" />,
            width: "w-24",
            align: "right",
            render: (_: any, record: TableDataSource) => {
                const unit = units.find(u => u.id === record.key);
                if (!unit) return null;
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
                                onClick={() => onDelete(unit)}
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

    const dataSource: TableDataSource[] = units.map((unit, index) => ({
        select: false,
        key: unit.id,
        no: (currentPage - 1) * 10 + index + 1,
        name: unit.name,
        description: unit.description,
        is_active: unit.is_active,
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
};
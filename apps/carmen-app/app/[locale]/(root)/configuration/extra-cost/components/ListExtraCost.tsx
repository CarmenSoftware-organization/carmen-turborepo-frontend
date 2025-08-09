import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { Activity, DollarSign, Info, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { useTranslations } from "next-intl";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface ListExtraCostProps {
    readonly extraCosts: ExtraCostTypeDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly onPageChange: (page: number) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
    readonly onEdit: (extraCost: ExtraCostTypeDto) => void;
    readonly onToggleStatus: (extraCost: ExtraCostTypeDto) => void;
    readonly selectedExtraCosts: string[];
    readonly onSelectAll: (isChecked: boolean) => void;
    readonly onSelect: (id: string) => void;
}

export default function ListExtraCost({
    extraCosts,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    sort,
    onSort,
    onEdit,
    onToggleStatus,
    selectedExtraCosts,
    onSelectAll,
    onSelect,
}: ListExtraCostProps) {
    const t = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={selectedExtraCosts.length === extraCosts.length}
                    onCheckedChange={onSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-8",
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                return <Checkbox checked={selectedExtraCosts.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
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
            icon: <DollarSign className="h-4 w-4" />,
            align: "left",
            render: (_: unknown, record: TableDataSource) => {
                const extraCost = extraCosts.find(ec => ec.id === record.key);
                if (!extraCost) return null;
                return (
                    <button
                        type="button"
                        className="btn-dialog"
                        onClick={() => onEdit(extraCost)}
                    >
                        {extraCost.name}
                    </button>
                );
            },
        },
        {
            title: t("description"),
            dataIndex: "description",
            key: "description",
            align: "left",
            icon: <Info className="h-4 w-4" />,
            render: (description: string) => (
                <span className="text-xs md:text-sm text-muted-foreground">
                    {description}
                </span>
            ),
        },
        {
            title: (
                <SortableColumnHeader
                    columnKey="is_active"
                    label="Status"
                    sort={sort ?? { field: "is_active", direction: "asc" }}
                    onSort={onSort ?? (() => { })}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "is_active",
            key: "is_active",
            align: "center",
            icon: <Activity className="h-4 w-4" />,
            render: (is_active: boolean) => (
                <div className="flex justify-center">
                    <StatusCustom is_active={is_active}>
                        {is_active ? tCommon("active") : tCommon("inactive")}
                    </StatusCustom>
                </div>
            ),
        },
        {
            title: t("action"),
            dataIndex: "action",
            key: "action",
            width: "w-0 md:w-32",
            align: "right",
            render: (_: unknown, record: TableDataSource) => {
                const extraCost = extraCosts.find(ec => ec.id === record.key);
                if (!extraCost) return null;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer hover:bg-transparent"
                                onClick={() => onToggleStatus(extraCost)}
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

    const dataSource: TableDataSource[] = extraCosts.map((extraCost, index) => ({
        select: false,
        key: extraCost.id,
        no: (currentPage - 1) * 10 + index + 1,
        name: extraCost.name,
        description: extraCost.description,
        is_active: extraCost.is_active,
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
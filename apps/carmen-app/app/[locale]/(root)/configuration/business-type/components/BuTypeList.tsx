import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BuTypeGetAllDto } from "@/dtos/bu-type.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { Activity, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BuTypeListProps {
    readonly buTypes: BuTypeGetAllDto[];
    readonly isLoading: boolean;
    readonly onEdit: (id: string) => void;
    readonly onDelete: (id: string) => void;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
    readonly totalItems: number;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
    readonly selectedBuTypes: string[];
    readonly onSelectAll: (isChecked: boolean) => void;
    readonly onSelect: (id: string) => void;
    readonly perpage?: number;
    readonly setPerpage?: (perpage: number) => void;
}

export default function BuTypeList({
    buTypes,
    isLoading,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    sort,
    onSort,
    selectedBuTypes,
    onSelectAll,
    onSelect,
    perpage,
    setPerpage
}: BuTypeListProps) {
    const t = useTranslations("TableHeader");

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={selectedBuTypes.length === buTypes.length}
                    onCheckedChange={onSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-8",
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                return <Checkbox checked={selectedBuTypes.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
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
            render: (_: unknown, record: TableDataSource) => {
                const buType = buTypes.find(bt => bt.id === record.key);
                if (!buType) return null;
                return (
                    <button
                        type="button"
                        className="text-primary cursor-pointer hover:underline transition-colors text-left text-xs md:text-base"
                        onClick={() => onEdit(buType.id)}
                    >
                        {buType.name}
                    </button>
                );
            },
        },
        {
            title: t("description"),
            dataIndex: "description",
            key: "description",
            icon: <Info className="h-4 w-4" />,
            align: "left",
            render: (_: unknown, record: TableDataSource) => {
                const buType = buTypes.find(bt => bt.id === record.key);
                if (!buType) return null;
                return <p className="truncate max-w-[300px] inline-block">{buType.description}</p>;
            },
        },
        {
            title: t("note"),
            dataIndex: "note",
            key: "note",
            icon: <Info className="h-4 w-4" />,
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
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                const buType = buTypes.find(bt => bt.id === record.key);
                if (!buType) return null;
                return <Badge variant={buType.is_active ? "active" : "inactive"}>{buType.is_active ? "Active" : "Inactive"}</Badge>;
            },
        },
        {
            title: t("action"),
            dataIndex: "action",
            key: "action",
            width: "w-0 md:w-32",
            align: "right",
            render: (_: unknown, record: TableDataSource) => {
                const buType = buTypes.find(bt => bt.id === record.key);
                if (!buType) return null;
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
                                onClick={() => onDelete(buType.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ]

    const dataSource: TableDataSource[] = buTypes.map((bu, index) => ({
        select: false,
        key: bu.id,
        no: index + 1,
        name: bu.name,
        note: bu.note,
        is_active: bu.is_active,
    }));

    return (
        <TableTemplate
            columns={columns}
            dataSource={dataSource}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            perpage={perpage}
            setPerpage={setPerpage}
        />
    )
}
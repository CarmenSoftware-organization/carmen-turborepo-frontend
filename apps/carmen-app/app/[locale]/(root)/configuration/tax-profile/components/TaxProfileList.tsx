import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { Activity, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TaxProfileListProps {
    readonly taxProfiles: TaxProfileGetAllDto[];
    readonly isLoading: boolean;
    readonly onEdit: (id: string) => void;
    readonly onDelete: (id: string) => void;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
    readonly totalItems: number;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
    readonly selectedTaxProfiles: string[];
    readonly onSelectAll: (isChecked: boolean) => void;
    readonly onSelect: (id: string) => void;
    readonly perpage?: number;
    readonly setPerpage?: (perpage: number) => void;
}

export default function TaxProfileList({
    taxProfiles,
    isLoading,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    sort,
    onSort,
    selectedTaxProfiles,
    onSelectAll,
    onSelect,
    perpage,
    setPerpage
}: TaxProfileListProps) {
    const t = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={selectedTaxProfiles.length === taxProfiles.length}
                    onCheckedChange={onSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-8",
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                return <Checkbox checked={selectedTaxProfiles.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
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
                const taxProfile = taxProfiles.find(tp => tp.id === record.key);
                if (!taxProfile) return null;
                return (
                    <button
                        type="button"
                        className="text-primary cursor-pointer hover:underline transition-colors text-left text-xs md:text-base"
                        onClick={() => onEdit(taxProfile.id)}
                    >
                        {taxProfile.name}
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
            width: "w-0 md:w-32",
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
            width: "w-0 md:w-32",
            align: "right",
            render: (_: unknown, record: TableDataSource) => {
                const taxProfile = taxProfiles.find(tp => tp.id === record.key);
                if (!taxProfile) return null;
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
                                onClick={() => onDelete(taxProfile.id)}
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

    const dataSource: TableDataSource[] = taxProfiles.map((taxProfile, index) => ({
        select: false,
        key: taxProfile.id,
        no: index + 1,
        name: taxProfile.name,
        is_active: taxProfile.is_active,
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
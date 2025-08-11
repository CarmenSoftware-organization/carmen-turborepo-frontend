import { PurchaseRequestTemplateDto } from "@/dtos/procurement.dto";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import ButtonLink from "@/components/ButtonLink";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";

interface PurchaseRequestTemplateListProps {
    readonly prts: PurchaseRequestTemplateDto[];
    readonly isLoading: boolean;
    readonly totalItems: number;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly perpage: number;
    readonly onPageChange: (page: number) => void;
    readonly sort: SortConfig;
    readonly onSort: (field: string) => void;
}

export default function PurchaseRequestTemplateList({
    prts,
    isLoading,
    totalItems,
    currentPage,
    totalPages,
    perpage,
    onPageChange,
    sort,
    onSort
}: PurchaseRequestTemplateListProps) {
    const tTableHeader = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelectItem = (id: string) => {
        if (!id) return;
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === prts.length) {
            setSelectedItems([]);
        } else {
            const allIds = prts
                .filter((prt) => prt && prt.id)
                .map((prt) => prt.id as string);
            setSelectedItems(allIds);
        }
    };

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={selectedItems.length === prts.length}
                    onCheckedChange={handleSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-4",
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                return <Checkbox checked={selectedItems.includes(record.key)} onCheckedChange={() => handleSelectItem(record.key)} />;
            },
        },
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            width: "w-4",
            align: "center",
        },
        {
            title: (
                <SortableColumnHeader
                    columnKey="prt_number"
                    label={tTableHeader("pr_no")}
                    sort={sort}
                    onSort={onSort}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "prt_number",
            key: "prt_number",
            align: "left",
            icon: <FileText className="h-4 w-4" />,
            render: (_: unknown, record: TableDataSource) => {
                return (
                    <ButtonLink href={`/procurement/purchase-request-template/${record.key}`}>
                        {record.prt_number}
                    </ButtonLink>
                );
            },
        },
        {
            title: tTableHeader("description"),
            dataIndex: "title",
            key: "title",
            align: "left",
        },
        {
            title: tTableHeader("date"),
            dataIndex: "date_created",
            key: "date_created",
            align: "center",
        },
        {
            title: tTableHeader("type"),
            dataIndex: "type",
            key: "type",
            align: "left",
        },
        {
            title: tTableHeader("requestor"),
            dataIndex: "requestor",
            key: "requestor",
            align: "left",
        },
        {
            title: tTableHeader("amount"),
            dataIndex: "amount",
            key: "amount",
            align: "right",
        },
        {
            title: tTableHeader("status"),
            dataIndex: "status",
            key: "status",
            align: "center",
        },
        {
            title: tTableHeader("action"),
            dataIndex: "action",
            key: "action",
            width: "w-0 md:w-32",
            align: "right",
            render: (_: unknown, record: TableDataSource) => {
                const prt = prts.find(prt => prt.id === record.key);
                if (!prt) return null;
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
                            >
                                <Trash2 className="h-4 w-4" />
                                {tCommon("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const dataSource: TableDataSource[] = prts.map((prt, index) => ({
        select: false,
        key: prt.id,
        no: index + 1,
        prt_number: prt.prt_number,
        title: prt.title,
        date_created: prt.date_created,
        type: prt.type,
        requestor: prt.requestor,
        amount: prt.amount,
        status: prt.status,
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
            perpage={perpage}
        />
    )
} 
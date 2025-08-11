import { PurchaseOrderlDto } from "@/dtos/procurement.dto";
import { Building2, Calendar, DollarSign, FileDown, FileText, MoreHorizontal, Printer, TagIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import ButtonLink from "@/components/ButtonLink";
import { Badge } from "@/components/ui/badge";

interface PurchaseOrderListProps {
    readonly purchaseOrders: PurchaseOrderlDto[];
    readonly currentPage?: number;
    readonly totalPages?: number;
    readonly perpage?: number;
    readonly onPageChange?: (page: number) => void;
    readonly isLoading: boolean;
    readonly totalItems: number;
    readonly sort: SortConfig;
    readonly onSort: (field: string) => void;
    readonly setPerpage: (perpage: number) => void;
}

export default function PurchaseOrderList({
    purchaseOrders,
    currentPage,
    totalPages,
    perpage,
    onPageChange = () => { },
    isLoading,
    totalItems,
    sort,
    onSort,
    setPerpage,
}: PurchaseOrderListProps) {
    const tTableHeader = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);


    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === purchaseOrders.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = purchaseOrders.map(po => po.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = purchaseOrders.length > 0 && selectedItems.length === purchaseOrders.length;

    const columns: TableColumn[] = [
        {
            title: (
                <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                />
            ),
            dataIndex: "select",
            key: "select",
            width: "w-6",
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                return <Checkbox checked={selectedItems.includes(record.key)} onCheckedChange={() => handleSelectItem(record.key)} />;
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
                    columnKey="po_number"
                    label={tTableHeader("po_number")}
                    sort={sort}
                    onSort={onSort}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "po_number",
            key: "po_number",
            align: "left",
            icon: <FileText className="h-4 w-4" />,
            render: (_: unknown, po: TableDataSource) => {
                return <ButtonLink href={`/procurement/purchase-order/${po.key}`}>
                    {po.po_number}
                </ButtonLink>;
            },
        },
        {
            title: (
                <SortableColumnHeader
                    columnKey="vendor"
                    label={tTableHeader("vendor")}
                    sort={sort}
                    onSort={onSort}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "vendor",
            key: "vendor",
            align: "left",
            icon: <Building2 className="h-4 w-4" />,
        },
        {
            title: tTableHeader("date"),
            dataIndex: "date_created",
            key: "date_created",
            align: "center",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            title: tTableHeader("delivery_date"),
            dataIndex: "delivery_date",
            key: "delivery_date",
            align: "center",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            title: tTableHeader("currency"),
            dataIndex: "currency",
            key: "currency",
            align: "center",
            icon: <DollarSign className="h-4 w-4" />,
        },
        {
            title: tTableHeader("net_amount"),
            dataIndex: "net_amount",
            key: "net_amount",
            align: "right",
            icon: <DollarSign className="h-4 w-4" />,
        },
        {
            title: tTableHeader("tax_amount"),
            dataIndex: "tax_amount",
            key: "tax_amount",
            align: "right",
            icon: <DollarSign className="h-4 w-4" />,
        },
        {
            title: tTableHeader("amount"),
            dataIndex: "amount",
            key: "amount",
            align: "right",
            icon: <DollarSign className="h-4 w-4" />,
        },
        {
            title: tTableHeader("status"),
            dataIndex: "status",
            key: "status",
            align: "center",
            icon: <TagIcon className="h-4 w-4" />,
            render: (_: unknown, po: TableDataSource) => {
                return (
                    <Badge variant={'outline'}>
                        {po.status}
                    </Badge>
                )
            },
        },
        {
            title: tTableHeader("action"),
            dataIndex: "action",
            key: "action",
            align: "right",
            render: (_: unknown, po: TableDataSource) => {
                return <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Approve", po.id);
                                }}
                            >
                                <Printer />
                                {tCommon("print")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Download", po.id);
                                }}
                            >
                                <FileDown />
                                {tCommon("export")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Delete", po.id);
                                }}
                                className="text-red-500 hover:text-red-300"
                            >
                                <Trash2 />
                                {tCommon("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>;
            },
        },
    ];

    const dataSource: TableDataSource[] = purchaseOrders?.map((po, index) => ({
        select: false,
        key: po.id ?? "",
        no: index + 1,
        po_number: po.po_number ?? "-",
        vendor: po.vendor ?? "-",
        date_created: po.date_created,
        delivery_date: po.delivery_date,
        currency: po.currency,
        net_amount: po.net_amount,
        tax_amount: po.tax_amount,
        amount: po.amount,
        status: po.status,
    }));

    return (
        <TableTemplate
            columns={columns}
            dataSource={dataSource}
            totalItems={totalItems}
            totalPages={totalPages}
            perpage={perpage}
            setPerpage={setPerpage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading}
        />
    )
} 
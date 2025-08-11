"use client";

import { VendorComparisonDto } from "@/dtos/procurement.dto"
import { FileText, Trash2, MoreHorizontal, Printer, FileDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import { useState } from "react";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import ButtonLink from "@/components/ButtonLink";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
interface VendorComparisonListProps {
    readonly vendorComparisons: VendorComparisonDto[];
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
export default function VendorComparisonList({
    vendorComparisons,
    currentPage,
    totalPages,
    perpage,
    onPageChange = () => { },
    isLoading,
    totalItems,
    sort,
    onSort,
    setPerpage,
}: VendorComparisonListProps) {
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
        if (selectedItems.length === vendorComparisons.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = vendorComparisons.map(vc => vc.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = vendorComparisons.length > 0 && selectedItems.length === vendorComparisons.length;

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
                    columnKey="vendor_name"
                    label={tTableHeader("vendor")}
                    sort={sort}
                    onSort={onSort}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "vendor_name",
            key: "vendor_name",
            align: "left",
            icon: <FileText className="h-4 w-4" />,
            render: (_: unknown, vc: TableDataSource) => {
                return (
                    <ButtonLink href={`/procurement/vendor-comparison/${vc.key}`}>
                        {vc.vendor_name}
                    </ButtonLink>
                )
            },
        },

        {
            title: tTableHeader("rating"),
            dataIndex: "rating",
            key: "rating",
            align: "center",
        },
        {
            title: tTableHeader("delivery_time"),
            dataIndex: "delivery_time",
            key: "delivery_time",
            align: "center",
        },
        {
            title: tTableHeader("score"),
            dataIndex: "score",
            key: "score",
            align: "center",
        },
        {
            title: tTableHeader("res_time"),
            dataIndex: "res_time",
            key: "res_time",
            align: "center",
        },
        {
            title: tTableHeader("quality_score"),
            dataIndex: "score",
            key: "score",
            align: "center",
        },
        {
            title: tTableHeader("status"),
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (_: unknown, vc: TableDataSource) => {
                return (
                    <div className="flex justify-center">
                        <StatusCustom is_active={vc.status}>
                            {vc.status ? tCommon("active") : tCommon("inactive")}
                        </StatusCustom>
                    </div>
                )
            }
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

    const dataSource: TableDataSource[] = vendorComparisons?.map((vc, index) => ({
        select: false,
        key: vc.id ?? "",
        no: index + 1,
        vendor_name: vc.vendor_name,
        rating: vc.rating,
        delivery_time: vc.delivery_time,
        score: vc.score,
        res_time: vc.res_time,
        status: vc.status,
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceListDto } from "@/dtos/price-list.dto";
import { Calendar, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeletePriceList } from "@/hooks/usePriceList";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import ButtonLink from "@/components/ButtonLink";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateFns } from "@/utils/config-system";
import { useTranslations } from "next-intl";

interface ListPriceListProps {
    readonly priceLists?: PriceListDto[];
    readonly isLoading?: boolean;
    readonly totalItems?: number;
    readonly totalPages?: number;
    readonly perpage?: number;
    readonly currentPage?: number;
    readonly onPageChange?: (page: number) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
    readonly setPerpage?: (perpage: number) => void;
}

export default function ListPriceList({
    priceLists = [],
    isLoading = false,
    totalItems = 0,
    totalPages = 1,
    perpage = 10,
    currentPage = 1,
    onPageChange,
    sort,
    onSort,
    setPerpage
}: ListPriceListProps) {
    const { token, tenantId, dateFormat } = useAuth();
    const tTableHeader = useTranslations("TableHeader");
    const queryClient = useQueryClient();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string>('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedPriceList, setSelectedPriceList] = useState<PriceListDto | null>(null);

    const { mutate: deletePriceList, isPending: isDeleting } = useDeletePriceList(token, tenantId, deleteId);

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };
    const handleSelectAll = () => {
        if (selectedItems.length === priceLists.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = priceLists.map(pr => pr.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const handleDeleteClick = (priceList: PriceListDto) => {
        setSelectedPriceList(priceList);
        setAlertOpen(true);
    };

    const handleDelete = () => {
        if (!selectedPriceList?.id) return;

        setDeleteId(selectedPriceList.id);
        deletePriceList(undefined, {
            onSuccess: () => {
                toastSuccess({ message: 'Price list deleted successfully' });
                setDeleteId('');
                setAlertOpen(false);
                setSelectedPriceList(null);
                // Invalidate and refetch price list data
                queryClient.invalidateQueries({ queryKey: ["price-list", tenantId] });
            },
            onError: () => {
                toastError({ message: 'Failed to delete price list' });
                setDeleteId('');
                setAlertOpen(false);
                setSelectedPriceList(null);
            }
        });
    };

    const isAllSelected = priceLists?.length > 0 && selectedItems.length === priceLists.length;

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
            width: "w-10",
            align: "center",
            render: (_: unknown, record: TableDataSource) => {
                return (
                    <Checkbox
                        checked={selectedItems.includes(record.key)}
                        onCheckedChange={() => handleSelectItem(record.key)}
                        aria-label={`Select ${record.cn_no || "item"}`}
                    />
                );
            },
        },
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            align: "center",
        },
        {
            title: (
                <SortableColumnHeader
                    columnKey="name"
                    label={tTableHeader("name")}
                    sort={sort ?? { field: '', direction: 'asc' }}
                    onSort={onSort ?? (() => { })}
                    getSortableColumnProps={getSortableColumnProps}
                    renderSortIcon={renderSortIcon}
                />
            ),
            dataIndex: "name",
            icon: <List className="h-4 w-4" />,
            key: "name",
            align: "left",
            render: (_: unknown, record: TableDataSource) => {
                return (
                    <ButtonLink href={`/vendor-management/price-list/${record.key}`}>
                        {record.name}
                    </ButtonLink>
                );
            },
        },
        {
            title: tTableHeader("start_date"),
            dataIndex: "from_date",
            icon: <Calendar className="h-4 w-4" />,
            key: "from_date",
            align: "left",
            render: (_: unknown, record: TableDataSource) => {
                return (
                    <p>{formatDateFns(record.from_date ?? '', dateFormat ?? 'dd/MM/yyyy')}</p>
                );
            },
        },
        {
            title: tTableHeader("end_date"),
            dataIndex: "to_date",
            icon: <Calendar className="h-4 w-4" />,
            key: "to_date",
            align: "left",
            render: (_: unknown, record: TableDataSource) => {
                return (
                    <p>{formatDateFns(record.to_date ?? '', dateFormat ?? 'dd/MM/yyyy')}</p>
                );
            },
        },
        {
            title: tTableHeader("action"),
            dataIndex: "action",
            key: "action",
            align: "right",
            render: (_: unknown, record: TableDataSource) => {
                const currentPriceList = priceLists.find(pl => pl.id === record.key);

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="text-destructive"
                                disabled={isDeleting && deleteId === currentPriceList?.id}
                                onClick={() => currentPriceList && handleDeleteClick(currentPriceList)}
                            >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const dataSource: TableDataSource[] = priceLists?.map((pl, index) => ({
        key: pl?.id ?? '',
        no: index + 1,
        name: pl?.vendor?.name,
        from_date: pl?.from_date,
        to_date: pl?.to_date,
    })) || [];

    console.log(priceLists);

    return (
        <>
            <TableTemplate
                columns={columns}
                dataSource={dataSource}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
                isLoading={isLoading}
                perpage={perpage}
                setPerpage={setPerpage}
            />

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Price List</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this price list for &quot;{selectedPriceList?.vendor?.name}&quot;?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlertOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

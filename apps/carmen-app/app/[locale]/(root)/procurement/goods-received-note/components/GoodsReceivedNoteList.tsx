import { GoodsReceivedNoteListDto } from "@/dtos/grn.dto";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonLink from "@/components/ButtonLink";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";

interface GoodsReceivedNoteListProps {
  readonly goodsReceivedNotes: GoodsReceivedNoteListDto[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly isLoading: boolean;
  readonly totalItems?: number;
  readonly sort: SortConfig;
  readonly onSort: (field: string) => void;
}

export default function GoodsReceivedNoteList({
  goodsReceivedNotes,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  totalItems,
  sort,
  onSort,
}: GoodsReceivedNoteListProps) {
  const t = useTranslations("TableHeader");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { dateFormat, amount, currencyBase } = useAuth();
  const defaultAmount = { locales: 'en-US', minimumIntegerDigits: 2 }

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === goodsReceivedNotes.length) {
      // If all items are selected, unselect all
      setSelectedItems([]);
    } else {
      const allIds = goodsReceivedNotes
        .map((grn) => grn.id ?? "")
        .filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    goodsReceivedNotes?.length > 0 &&
    selectedItems.length === goodsReceivedNotes.length;


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
            aria-label={`Select ${record.grn_no}`}
          />
        );
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="grn_no"
          label={t("grn_number")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "grn_no",
      key: "grn_no",
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <ButtonLink href={`/procurement/goods-received-note/${record.key}`}>
            {record.grn_no ?? "-"}
          </ButtonLink>
        );
      },
    },
    {
      title: t("status"),
      dataIndex: "is_active",
      key: "is_active",
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <Badge variant={record.is_active ? "active" : "inactive"}>
            {record.is_active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      title: t("vendor"),
      dataIndex: "vendor_name",
      key: "vendor_name",
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        return record.vendor_name ?? "-";
      },
    },
    {
      title: t("date"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        return formatDateFns(record.created_at, dateFormat || 'yyyy-MM-dd');
      },
    },
    {
      title: t("amount"),
      dataIndex: "total_amount",
      key: "total_amount",
      align: "right",
      width: "w-[100px]",
      render: (_: unknown, record: TableDataSource) => {
        return formatPriceConf(record.total_amount, amount ?? defaultAmount, currencyBase ?? 'THB');
      },
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      align: "right",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-destructive"
                onClick={() => console.log(record.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>Print GRN</DropdownMenuItem>
              <DropdownMenuItem>Download PDF</DropdownMenuItem>
              <DropdownMenuItem>Copy Reference</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const dataSource: TableDataSource[] = goodsReceivedNotes?.map((grn) => ({
    key: grn.id ?? "",
    grn_no: grn.grn_no,
    is_active: grn.is_active,
    vendor_name: grn.vendor_name,
    created_at: grn.created_at,
    total_amount: grn.total_amount,
  })) || [];

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

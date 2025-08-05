import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseRequestListDto } from "@/dtos/purchase-request.dto";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import ButtonLink from "@/components/ButtonLink";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";

interface PurchaseRequestListProps {
  readonly purchaseRequests: PurchaseRequestListDto[];
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

export default function PurchaseRequestList({
  purchaseRequests,
  currentPage = 1,
  totalPages = 1,
  perpage = 10,
  onPageChange = () => { },
  isLoading,
  totalItems,
  sort,
  onSort,
  setPerpage,
}: PurchaseRequestListProps) {
  const t = useTranslations("TableHeader");
  const { dateFormat, amount, currencyBase } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const defaultAmount = { locales: 'en-US', minimumFractionDigits: 2 }

  const handleSelectAll = () => {
    if (selectedItems.length === purchaseRequests.length) {
      // If all items are selected, unselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all items
      const allIds = purchaseRequests.map((pr) => pr.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    purchaseRequests?.length > 0 &&
    selectedItems.length === purchaseRequests.length;

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
          columnKey="pr_no"
          label={t("pr_no")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "pr_no",
      key: "pr_no",
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        return <ButtonLink href={`/procurement/purchase-request/${record.key}`}>
          {record.pr_no ?? "-"}
        </ButtonLink>;
      },
    },
    {
      title: "Date",
      dataIndex: "pr_date",
      key: "pr_date",
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        return <div className="text-center">
          {formatDateFns(record.pr_date, dateFormat || 'yyyy-MM-dd')}
        </div>;
      },
    },
    {
      title: "Type",
      dataIndex: "workflow_name",
      key: "workflow_name",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "pr_status",
      key: "pr_status",
      align: "left",
    },
    {
      title: "Stage",
      dataIndex: "workflow_current_stage",
      key: "workflow_current_stage",
      align: "left",
    },
    {
      title: "Requestor",
      dataIndex: "requestor_name",
      key: "requestor_name",
      align: "left",
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      align: "left",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      align: "right",
      render: (_: unknown, record: TableDataSource) => {
        return <p>
          {formatPriceConf(record.total_amount, amount ?? defaultAmount, currencyBase ?? 'THB')}
        </p>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_: unknown, pr: TableDataSource) => {
        return <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">More options</span>
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Approve", pr.id);
                }}
              >
                Print
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Download", pr.id);
                }}
              >
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete", pr.id);
                }}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>;
      },
    },
  ];

  const dataSource: TableDataSource[] = purchaseRequests?.map((pr, index) => ({
    select: false,
    key: pr.id ?? "",
    no: index + 1,
    pr_no: pr.pr_no ?? "-",
    pr_date: pr.pr_date,
    workflow_name: pr.workflow_name,
    pr_status: pr.pr_status,
    workflow_current_stage: pr.workflow_current_stage,
    requestor_name: pr.requestor_name,
    department_name: pr.department_name,
    total_amount: pr.total_amount,
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
  );
}

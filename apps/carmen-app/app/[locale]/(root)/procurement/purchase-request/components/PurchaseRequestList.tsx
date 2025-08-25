import { useState } from "react";
import { Activity, Building, Calendar, DollarSign, FileDown, FileText, MoreHorizontal, Printer, Trash2, TypeIcon, User, Workflow } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
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
import { StatusBadge } from "@/components/ui-custom/StatusBadge";

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
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const tStatus = useTranslations("Status");
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const { dateFormat, amount, currencyBase } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getTypeName = (type: string) => {
    if (type === "General") {
      return tPurchaseRequest("general");
    }
    return tPurchaseRequest("market_list");
  }

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

  const convertStatus = (status: string) => {
    if (status === 'submit') {
      return tStatus("submit")
    }
    if (status === 'approved') {
      return tStatus("approved")
    }
    if (status === 'Completed') {
      return tStatus("completed")
    }

    if (status === 'pending') {
      return tStatus("pending")
    }
    if (status === 'approved') {
      return tStatus("approved")
    }
    return ''
  }

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
          label={tTableHeader("pr_no")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "pr_no",
      key: "pr_no",
      align: "left",
      icon: <FileText className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return <ButtonLink href={`/procurement/purchase-request/${record.key}`}>
          {record.pr_no ?? "-"}
        </ButtonLink>;
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="pr_date"
          label={tTableHeader("date")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "pr_date",
      key: "pr_date",
      align: "left",
      icon: <Calendar className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <div className="text-left">
            {formatDateFns(record.pr_date, dateFormat || 'yyyy-MM-dd')}
          </div>
        )
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="workflow_name"
          label={tTableHeader("type")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "workflow_name",
      key: "workflow_name",
      align: "left",
      icon: <TypeIcon className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <p>
            {getTypeName(record.workflow_name)}
          </p>
        )
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="pr_status"
          label={tTableHeader("status")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "pr_status",
      key: "pr_status",
      align: "left",
      icon: <Activity className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <div className="flex justify-center">
            {record.pr_status && (
              <StatusBadge status={record.pr_status}>
                {convertStatus(record.pr_status)}
              </StatusBadge>
            )}
          </div>
        )
      }
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="workflow_current_stage"
          label={tTableHeader("stage")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "workflow_current_stage",
      key: "workflow_current_stage",
      align: "left",
      icon: <Workflow className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <div className="flex justify-center">
            {record.pr_status && (
              <StatusBadge status={record.pr_status}>
                {convertStatus(record.pr_status)}
              </StatusBadge>
            )}
          </div>
        )
      }
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="requestor_name"
          label={tTableHeader("requestor")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "requestor_name",
      key: "requestor_name",
      align: "left",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="department_name"
          label={tTableHeader("department")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "department_name",
      key: "department_name",
      align: "left",
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: tTableHeader("amount"),
      dataIndex: "total_amount",
      key: "total_amount",
      align: "right",
      icon: <DollarSign className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return <p>
          {formatPriceConf(record.total_amount, amount ?? defaultAmount, currencyBase ?? 'THB')}
        </p>;
      },
    },
    {
      title: tTableHeader("action"),
      dataIndex: "action",
      key: "action",
      align: "right",
      render: (_: unknown, pr: TableDataSource) => {
        return <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">More options</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Approve", pr.id);
                }}
              >
                <Printer />
                {tCommon("print")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Download", pr.id);
                }}
              >
                <FileDown />
                {tCommon("export")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete", pr.id);
                }}
                className="text-red-500 hover:text-red-300"
              >
                <Trash2 />
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

import { Button } from "@/components/ui/button";
import { Calendar, FileText, FileType2, Info, MoreHorizontal, StickyNote, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import ButtonLink from "@/components/ButtonLink";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns } from "@/utils/config-system";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import CreditNoteCard from "./CreditNoteCard";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";

interface CreditNoteListProps {
  readonly creditNotes: CreditNoteGetAllDto[];
  readonly isLoading: boolean;
  readonly totalItems: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort: SortConfig;
  readonly onSort: (field: string) => void;

}

export default function CreditNoteList({
  creditNotes = [],
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  perpage,
  onPageChange,
  sort,
  onSort
}: CreditNoteListProps) {
  const { dateFormat } = useAuth();
  const tTableHeader = useTranslations("TableHeader");
  const tStatus = useTranslations("Status");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    if (!id) return;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === creditNotes.length) {
      setSelectedItems([]);
    } else {
      const allIds = creditNotes
        .filter((cn) => cn && cn.id)
        .map((cn) => cn.id as string);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    creditNotes?.length > 0 && selectedItems.length === creditNotes.length;

  const getStatusText = (status: string) => {
    if (status === 'in_progress') {
      return tStatus("in_progress");
    }
    if (status === 'completed') {
      return tStatus("completed");
    }
    if (status === 'cancelled') {
      return tStatus("cancelled");
    }
    return tStatus("draft");
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
          columnKey="cn_no"
          label={tTableHeader("reference")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "cn_no",
      key: "cn_no",
      align: "left",
      icon: <FileText className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <ButtonLink href={`/procurement/credit-note/${record.key}`}>
            {record.cn_no}
          </ButtonLink>
        );
      },
    },
    {
      title: tTableHeader("status"),
      dataIndex: "doc_status",
      key: "doc_status",
      align: "center",
      width: "w-32",
      icon: <FileText className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <StatusBadge status={record.doc_status}>
            {getStatusText(record.doc_status || "-")}
          </StatusBadge>
        );
      },
    },
    {
      title: tTableHeader("date"),
      dataIndex: "cn_date",
      key: "cn_date",
      align: "center",
      icon: <Calendar className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return formatDateFns(record.cn_date, dateFormat || 'yyyy/MM/dd');
      },
    },
    {
      title: tTableHeader("note"),
      dataIndex: "note",
      key: "note",
      align: "left",
      icon: <Info className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return <p className="max-w-32 truncate text-ellipsis">{record.note || "-"}</p>
      },
    },
    {
      title: tTableHeader("workflow_status"),
      dataIndex: "current_workflow_status",
      key: "current_workflow_status",
      align: "left",
      icon: <FileType2 className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return record.current_workflow_status || "-";
      },
    },
    {
      title: tTableHeader("last_action"),
      dataIndex: "last_action_name",
      key: "last_action_name",
      align: "left",
      icon: <StickyNote className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return record.last_action_name || "-";
      },
    },
    {
      title: tTableHeader("last_action_by"),
      dataIndex: "last_action_by_name",
      key: "last_action_by_name",
      align: "left",
      icon: <User className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return record.last_action_by_name || "-";
      },
    },
    {
      title: tTableHeader("last_action_date"),
      dataIndex: "last_action_date",
      key: "last_action_date",
      align: "left",
      icon: <Calendar className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return record.last_action_date || "-";
      },
    },
    {
      title: tTableHeader("action"),
      dataIndex: "action",
      key: "action",
      align: "right",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-destructive"
                onClick={() => console.log(record.id)}
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

  const dataSource: TableDataSource[] = creditNotes?.map((cn, index) => ({
    key: cn?.id || "",
    no: index + 1,
    cn_no: cn?.cn_no,
    doc_status: cn?.doc_status,
    cn_date: cn?.cn_date,
    note: cn?.note,
    current_workflow_status: cn?.current_workflow_status,
    last_action_name: cn?.last_action_name,
    last_action_by_name: cn?.last_action_by_name,
    last_action_date: cn?.last_action_date,
  })) || [];

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
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
      </div>

      <div className="grid gap-4 md:hidden">
        <CreditNoteCard
          creditNotes={creditNotes}
          selectAll={handleSelectAll}
          selectItem={handleSelectItem}
          isSelected={isAllSelected}
          isLoading={isLoading}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
}

import { VendorGetDto } from "@/dtos/vendor-management";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import ButtonLink from "@/components/ButtonLink";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VendorListProps {
  readonly vendors: VendorGetDto[];
  readonly getVendorName: (vendorId: string) => string;
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly sort: SortConfig;
  readonly onSort: (field: string) => void;
  readonly totalItems: number;
  readonly perpage: number;
}

export default function VendorList({
  vendors,
  getVendorName,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  sort,
  onSort,
  totalItems,
  perpage
}: VendorListProps) {
  const tCommon = useTranslations("Common");
  const tVendor = useTranslations("Vendor");

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    if (!id) return;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === vendors.length) {
      setSelectedItems([]);
    } else {
      const allIds = vendors
        .filter((v) => v && v.id)
        .map((v) => v.id as string);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    vendors?.length > 0 && selectedItems.length === vendors.length;

  const title = tVendor("title");

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
            aria-label={`Select ${record.name || "item"}`}
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
          label="Name"
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <ButtonLink href={`/vendor-management/vendor/${record.key}`}>
            {record.name}
          </ButtonLink>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "left",
    },
    {
      title: "Business Type",
      dataIndex: "business_type_name",
      key: "business_type_name",
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <Badge variant={record.status ? "active" : "inactive"}>
            {record.status ? tCommon('active') : tCommon('inactive')}
          </Badge>
        );
      },
    },

    {
      title: "Action",
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

  const dataSource: TableDataSource[] = vendors?.map((v, index) => ({
    key: v?.id || "",
    no: index + 1,
    name: v?.name,
    description: v?.description,
    business_type_name: v?.business_type_name,
    status: v?.is_active,
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
      perpage={perpage}
    />
  );
}
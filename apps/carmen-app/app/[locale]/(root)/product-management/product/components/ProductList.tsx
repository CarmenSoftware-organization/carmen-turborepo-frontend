"use client";

import { ProductGetDto } from "@/dtos/product.dto";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Activity, Box, Folder, Layers, List, MoreHorizontal, Package } from "lucide-react";
import { Link } from "@/lib/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import ButtonLink from "@/components/ButtonLink";

interface ProductListProps {
  readonly products?: ProductGetDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly onPageChange: (page: number) => void;
  readonly totalPages: number | undefined;
  readonly onDelete: (id: string) => void;
  readonly totalItems: number;
  readonly sort: SortConfig;
  readonly onSort: (field: string) => void;
}

export default function ProductList({
  products = [],
  isLoading,
  currentPage,
  onPageChange,
  totalPages = 1,
  onDelete,
  totalItems,
  sort,
  onSort,
}: ProductListProps) {
  const t = useTranslations("TableHeader");

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!products || products.length === 0) {
      return;
    }

    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      const allIds = products.map((pd) => pd.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const columns: TableColumn[] = [
    {
      title: (
        <Checkbox
          checked={selectedItems.length === products.length}
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
          columnKey="name"
          label={t("name")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "name",
      key: "name",
      icon: <List className="h-4 w-4" />,
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        const product = products.find(p => p.id === record.key);
        if (!product) return null;
        return (
          <div className="flex items-center gap-2">
            <ButtonLink href={`/product-management/product/${record.key}`}>
              {record.name}
            </ButtonLink>
            <Badge
              variant="secondary"
            >
              {record.code}
            </Badge>
          </div>
        );
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="category"
          label={t("category")}
          sort={sort}
          onSort={onSort}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "category",
      key: "category",
      align: "center",
      icon: <Folder className="h-4 w-4" />,
    },
    {
      title: t("sub_category"),
      dataIndex: "sub_category",
      key: "sub_category",
      align: "center",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      title: t("item_group"),
      dataIndex: "item_group",
      key: "item_group",
      align: "center",
      icon: <Box className="h-4 w-4" />,
    },
    {
      title: t("inventory_unit"),
      dataIndex: "inventory_unit",
      key: "inventory_unit",
      align: "center",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      icon: <Activity className="h-4 w-4" />,
      render: (status: string) => (
        <Badge
          variant={status === "active" ? "active" : "inactive"}
        >
          {status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-destructive cursor-pointer hover:bg-transparent" onClick={() => onDelete(record.key)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const dataSource: TableDataSource[] = products.map((product, index) => ({
    select: false,
    key: product.id,
    no: (currentPage - 1) * 10 + index + 1,
    name: product.name,
    code: product.code,
    category: product.product_category?.name,
    sub_category: product.product_sub_category?.name,
    item_group: product.product_item_group?.name,
    inventory_unit: product.inventory_unit_name,
    status: product.product_status_type,
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
    />
  );
}

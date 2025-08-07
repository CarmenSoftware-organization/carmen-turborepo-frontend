import { DepartmentGetListDto } from "@/dtos/department.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Activity, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ButtonLink from "@/components/ButtonLink";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface DepartmentListProps {
  readonly departments: DepartmentGetListDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: SortConfig;
  readonly onSort?: (field: string) => void;
  readonly selectedDepartments: string[];
  readonly onSelectAll: (isChecked: boolean) => void;
  readonly onSelect: (id: string) => void;
  readonly totalItems: number;
  readonly perpage?: number;
  readonly setPerpage?: (perpage: number) => void;
}

export default function DepartmentList({
  departments,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  sort,
  onSort,
  selectedDepartments,
  onSelectAll,
  onSelect,
  totalItems,
  perpage,
  setPerpage
}: DepartmentListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  const columns: TableColumn[] = [
    {
      title: (
        <Checkbox
          checked={selectedDepartments.length === departments.length}
          onCheckedChange={onSelectAll}
        />
      ),
      dataIndex: "select",
      key: "select",
      width: "w-8",
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        return <Checkbox checked={selectedDepartments.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
      },
    },
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      width: "w-8",
      align: "center",
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="name"
          label={t("name")}
          sort={sort ?? { field: "name", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "name",
      key: "name",
      icon: <List className="h-4 w-4" />,
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        const department = departments.find(d => d.id === record.key);
        if (!department) return null;
        return (
          <ButtonLink href={`/configuration/department/${department.id}`}>
            {department.name}
          </ButtonLink>
        );
      },
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      icon: <Info className="h-4 w-4" />,
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        return <p className="truncate max-w-[200px] inline-block ">{record.description}</p>
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="is_active"
          label={t("status")}
          sort={sort ?? { field: "is_active", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "is_active",
      key: "is_active",
      width: "w-0 md:w-20",
      align: "center",
      icon: <Activity className="h-4 w-4" />,
      render: (is_active: boolean) => (
        <StatusCustom is_active={is_active}>
          {is_active ? tCommon("active") : tCommon("inactive")}
        </StatusCustom>
      ),
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: "w-0 md:w-32",
      align: "right",
      render: (_: unknown, record: TableDataSource) => {
        const department = departments.find(d => d.id === record.key);
        if (!department) return null;
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
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const dataSource: TableDataSource[] = departments.map((department, index) => ({
    select: false,
    key: department.id,
    no: index + 1,
    name: department.name,
    description: department.description,
    is_active: department.is_active,
  }));

  return (
    <TableTemplate
      columns={columns}
      dataSource={dataSource}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      totalItems={totalItems}
      perpage={perpage}
      setPerpage={setPerpage}
    />
  )
}
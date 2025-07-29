import PaginationComponent from "@/components/PaginationComponent";
import { DepartmentGetListDto } from "@/dtos/department.dto";
import { getSortableColumnProps, renderSortIcon, SortConfig } from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ButtonLink from "@/components/ButtonLink";

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
  onSelect
}: DepartmentListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
  }

  const renderTableContent = () => {

    if (departments.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">No departments found</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return departments.map((department, index) => (
      <TableRow key={department.id}>
        <TableCell className="w-10">
          <Checkbox
            checked={selectedDepartments.includes(department.id)}
            onCheckedChange={() => handleSelect(department.id)}
          />
        </TableCell>
        <TableCell className="text-left w-10">
          {(currentPage - 1) * 10 + index + 1}
        </TableCell>
        <TableCell className="text-left w-[300px]">
          <div>
            <ButtonLink href={`/configuration/department/${department.id}`}>
              <p className="font-medium">{department.name}</p>
            </ButtonLink>
            {department.description && (
              <p className="text-xs text-muted-foreground mt-[-8px]">
                {department.description}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell className="text-left">
          <Badge variant={department.is_active ? "active" : "inactive"}>
            {department.is_active ? tCommon("active") : tCommon("inactive")}
          </Badge>
        </TableCell>
        <TableCell className="w-20 text-right">
          <Button
            variant="ghost"
            size={"sm"}
            aria-label="Edit department"
            className="h-7 w-7 hover:text-muted-foreground"
            asChild
          >
            <Link href={`/configuration/department/${department.id}`}>
              <FileText className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size={"sm"}
            aria-label={`${department.is_active ? "Deactivate" : "Activate"} department`}
            disabled={!department.is_active}
            className="h-7 w-7 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <Table className="border">
        <TableHeader className="sticky top-0 bg-muted">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={selectedDepartments.length === departments.length && departments.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="text-left w-10">#</TableHead>
            <TableHead {...getSortableColumnProps("name", sort, onSort)}>
              <div className="flex items-center text-left">
                {t("name")}
                {renderSortIcon("name", sort)}
              </div>
            </TableHead>
            <TableHead
              {...getSortableColumnProps("is_active", sort, onSort)}
            >
              <div className="flex items-center text-left">
                {t("status")}
                {renderSortIcon("is_active", sort)}
              </div>
            </TableHead>
            <TableHead className="w-20 text-right">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBodySkeleton rows={4} />
        ) : (
          <TableBody>
            {renderTableContent()}
          </TableBody>
        )}
      </Table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
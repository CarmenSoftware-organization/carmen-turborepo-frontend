import { useState } from "react";
import { FileText, MoreVertical, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import PaginationComponent from "@/components/PaginationComponent";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Link } from "@/lib/navigation";
import { convertPrStatus } from "@/utils/badge-status-color";
import { PurchaseRequestListDto } from "@/dtos/purchase-request.dto";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";

interface PurchaseRequestListProps {
  readonly purchaseRequests: PurchaseRequestListDto[];
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
  readonly isLoading: boolean;
}

interface FormatPriceConf {
  locales: string;
  minimumIntegerDigits: number;
}

export default function PurchaseRequestList({
  purchaseRequests,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
  isLoading,
}: PurchaseRequestListProps) {
  const t = useTranslations("TableHeader");
  const { dateFormat, amount, currencyBase } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const defaultAmount = { locales: 'en-US', minimumIntegerDigits: 2 }

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


  const renderTableContent = () => {
    if (isLoading) return <TableBodySkeleton rows={10} />;

    if (purchaseRequests.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={9} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground">
                  No purchase requests found
                </p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {purchaseRequests.map((pr) => (
          <TableRow key={pr.id}>
            <TableCell className="text-center w-10">
              <Checkbox
                id={`checkbox-${pr.id}`}
                checked={selectedItems.includes(pr.id ?? "")}
                onCheckedChange={() => handleSelectItem(pr.id ?? "")}
                aria-label={`Select ${pr.pr_no}`}
              />
            </TableCell>
            <TableCell>
              <Button variant={'ghost'} asChild className="p-0">
                <Link
                  href={`/procurement/purchase-request/${pr.id}`}
                  className="hover:underline text-primary hover:text-primary/80 font-medium"
                >
                  {pr.pr_no}
                </Link>
              </Button>

            </TableCell>
            <TableCell className="text-center">
              {pr.pr_status && (
                <Badge variant={pr.pr_status}>
                  {convertPrStatus(pr.pr_status)}
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-center">
              {pr.workflow_current_stage && (
                <Badge variant={pr.workflow_current_stage}>
                  {pr.workflow_current_stage}
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-center">
              {formatDateFns(pr.pr_date, dateFormat || 'yyyy-MM-dd')}
            </TableCell>
            <TableCell className="text-center">{pr.workflow_name ?? "-"}</TableCell>
            <TableCell>{pr.requestor_name}</TableCell>
            <TableCell>{pr.department_name}</TableCell>
            <TableCell>{formatPriceConf(pr.total_amount, amount ?? defaultAmount, currencyBase ?? 'THB')}</TableCell>
            <TableCell className="w-[100px] text-right">
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size={"sm"}
                  className="h-7 w-7 hover:text-muted-foreground"
                  asChild
                >
                  <Link href={`/procurement/purchase-request/${pr.id}`}>
                    <FileText className="h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size={"sm"}
                  className="h-7 w-7 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">More options</span>
                      <MoreVertical className="h-3 w-3" />
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
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Table className="border">
          <TableHeader className="sticky top-0 bg-muted">
            <TableRow>
              <TableHead className="w-10 text-center">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all purchase requests"
                />
              </TableHead>
              <TableHead className="w-[150px]">PR Number</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Stage</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead>Requestor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-[100px] text-right">
                {t("action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          {renderTableContent()}
        </Table>
      </div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

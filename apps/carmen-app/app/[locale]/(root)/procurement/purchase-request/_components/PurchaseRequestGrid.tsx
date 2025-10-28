import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseRequestListDto } from "@/dtos/purchase-request.dto";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import CardLoading from "@/components/loading/CardLoading";

interface PurchaseRequestGridProps {
  readonly purchaseRequests: PurchaseRequestListDto[];
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
  readonly isLoading?: boolean;
  readonly getTypeName: (type: string) => string;
  readonly convertStatus: (status: string) => string;
}

export default function PurchaseRequestGrid({
  purchaseRequests,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
  isLoading = false,
  getTypeName,
  convertStatus
}: PurchaseRequestGridProps) {
  const { dateFormat, amount, currencyBase } = useAuth();
  const tTableHeader = useTranslations('TableHeader');
  const tCommon = useTranslations("Common");
  const defaultAmount = { locales: 'en-US', minimumFractionDigits: 2 };
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === purchaseRequests.length) {
      setSelectedItems([]);
    } else {
      const allIds = purchaseRequests.map(pr => pr.id ?? '').filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected = purchaseRequests?.length > 0 && selectedItems.length === purchaseRequests.length;

  if (!isLoading) {
    return <CardLoading items={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
        >
          {isAllSelected ? tCommon("un_select_all") : tCommon("select_all")}
        </Button>
        {selectedItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} {tCommon("selected")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {purchaseRequests?.map((pr) => (
          <Card
            key={pr.id}
            className="transition-all duration-200 hover:shadow-lg hover:border-primary/50 flex flex-col h-full"
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`checkbox-${pr.id}`}
                    checked={selectedItems.includes(pr.id ?? '')}
                    onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                    aria-label={`Select ${pr.pr_no}`}
                    className="mt-1"
                  />
                  <p className="text-base font-semibold">{pr.pr_no}</p>
                </div>
                <div>
                  <Badge variant={pr.pr_status}>
                    {convertStatus(pr.pr_status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader("date")}</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatDateFns(pr.pr_date, dateFormat || 'yyyy-MM-dd')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader("type")}</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {getTypeName(pr.workflow_name ?? "-")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader('requestor')}</p>
                  <p className="text-sm font-medium text-muted-foreground">{pr.requestor_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader('department')}</p>
                  <p className="text-sm font-medium text-muted-foreground">{pr.department_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader("stage")}</p>
                  {pr.workflow_current_stage ? (
                    <p className="text-sm font-medium text-muted-foreground">{pr.workflow_current_stage}</p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">-</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader('amount')}</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatPriceConf(pr.total_amount, amount ?? defaultAmount, currencyBase ?? 'THB')}
                  </p>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground">{tTableHeader('description')}</p>
                <p className="text-sm font-medium text-muted-foreground">{pr.description ?? "-"}</p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end mt-auto px-3">
              <Button variant={'ghost'} size={'sm'} asChild>
                <Link href={`/procurement/purchase-request/${pr.id}`}>
                  <FileText />
                </Link>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete", pr.id);
                }}
                className="text-destructive cursor-pointer"
                size={'sm'}
                variant={'ghost'}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>

          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage - 1);
                }}
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(currentPage + 1);
                }}
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

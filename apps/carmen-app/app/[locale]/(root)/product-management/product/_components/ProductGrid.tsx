import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductListDto } from "@/dtos/product.dto";
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
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import CardLoading from "@/components/loading/CardLoading";

interface ProductGridProps {
  readonly products: ProductListDto[];
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
  readonly isLoading?: boolean;
}

export default function ProductGrid({
  products,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  isLoading = false,
}: ProductGridProps) {
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  console.log("product", products);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      const allIds = products.map((product) => product.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected = products?.length > 0 && selectedItems.length === products.length;

  if (isLoading) {
    return <CardLoading items={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {isAllSelected ? tCommon("un_select_all") : tCommon("select_all")}
        </Button>
        {selectedItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} {tCommon("selected")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="transition-all duration-200 hover:shadow-lg hover:border-primary/50 flex flex-col h-full"
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`checkbox-${product.id}`}
                    checked={selectedItems.includes(product.id ?? "")}
                    onCheckedChange={() => handleSelectItem(product.id ?? "")}
                    aria-label={`Select ${product.code}`}
                    className="mt-1"
                  />
                  <p className="text-base font-semibold">{product.code}</p>
                </div>
                <div>
                  <Badge variant={product.product_status_type}>
                    {product.product_status_type === "active"
                      ? tCommon("active")
                      : tCommon("inactive")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{tTableHeader("name")}</p>
                  <p className="text-sm font-medium text-muted-foreground">{product.name}</p>
                </div>
                {product.local_name && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{tTableHeader("local_name")}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {product.local_name}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{tTableHeader("category")}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {product.product_category?.name || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{tTableHeader("sub_category")}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {product.product_sub_category?.name || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{tTableHeader("item_group")}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {product.product_item_group?.name || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {tTableHeader("inventory_unit")}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {product.inventory_unit_name || "-"}
                    </p>
                  </div>
                </div>
                {product.description && (
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-muted-foreground">{tTableHeader("description")}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end mt-auto px-3">
              <Button variant={"ghost"} size={"sm"} asChild>
                <Link href={`/product-management/product/${product.id}`}>
                  <FileText />
                </Link>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Delete", product.id);
                }}
                className="text-destructive cursor-pointer"
                size={"sm"}
                variant={"ghost"}
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
  );
}

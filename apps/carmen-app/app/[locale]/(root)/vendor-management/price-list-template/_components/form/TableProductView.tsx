import { InitialProduct } from "@/components/lookup/product-tree-moq/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  initialProducts?: InitialProduct[];
}

export default function TableProductView({ initialProducts = [] }: Props) {
  const t = useTranslations("PriceListTemplate");

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs">
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>{t("product_name")}</TableHead>
          <TableHead>{t("order_unit")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initialProducts.length > 0 ? (
          initialProducts.map((product, index) => (
            <TableRow key={product.id} className="text-xs">
              <TableCell className="w-12 text-center">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="product_badge">{product.code || "-"}</Badge>
                  {product.name ?? "-"}
                </div>
              </TableCell>
              <TableCell>{product?.default_order?.unit_name || "-"}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center pb-5 text-center">
                <Package className="h-6 w-6 text-muted-foreground text-center" />
                <h3 className="mt-2 text-xs font-semibold">{t("no_products")}</h3>
                <p className="mb-4 text-xs text-muted-foreground max-w-sm">
                  {t("no_products_added_description")}
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

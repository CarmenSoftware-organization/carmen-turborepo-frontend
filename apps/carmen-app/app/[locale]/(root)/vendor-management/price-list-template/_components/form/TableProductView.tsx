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
              {t("no_products")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

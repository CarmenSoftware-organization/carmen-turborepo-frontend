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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("product_name")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialProducts.length > 0 ? (
            initialProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.name}
                    <Badge variant="product_badge">{product.code || "-"}</Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                {t("no_products")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Hash, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useCurrenciesQuery } from "@/hooks/use-currency";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly items: any[];
}

export default function Items({ items }: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tTableHeader = useTranslations("TableHeader");
  const { token, buCode, currencyBase } = useAuth();
  const { getCurrencyCode } = useCurrenciesQuery(token, buCode);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">{tPurchaseRequest("items")}</p>
        <Button variant="outlinePrimary" size={"sm"}>
          <Plus className="h-4 w-4" />
          {tPurchaseRequest("add_item")}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-10">
              <Checkbox />
            </TableHead>
            <TableHead className="text-center w-10">
              <Hash className="h-3 w-3" />
            </TableHead>
            <TableHead className="text-left">{tTableHeader("location")}</TableHead>
            <TableHead className="text-left">{tTableHeader("product")}</TableHead>
            <TableHead className="text-right">{tTableHeader("requested")}</TableHead>
            <TableHead className="text-right">{tTableHeader("approved")}</TableHead>
            <TableHead className="text-right">{tTableHeader("price")}</TableHead>
            <TableHead className="text-right">{tTableHeader("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center w-10">
                <Checkbox />
              </TableCell>
              <TableCell className="text-center w-10">{index + 1}</TableCell>
              <TableCell className="text-left">{item.location_name}</TableCell>
              <TableCell className="text-left">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <p>
                    {item.requested_qty} {item.requested_unit_name || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    (≈ {item.requested_base_qty} {item.inventory_unit_name || "-"})
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <p>
                    {item.approved_qty} {item.approved_unit_name || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <p>
                    {getCurrencyCode(item.currency_id)} {item.total_price}
                  </p>
                  <p>
                    {currencyBase} {item.base_total_price}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size={"sm"}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size={"sm"}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

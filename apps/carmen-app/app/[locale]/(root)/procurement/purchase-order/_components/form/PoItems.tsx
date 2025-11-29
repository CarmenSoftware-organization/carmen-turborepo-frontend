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

import { PurchaseOrderItemDto } from "@/dtos/procurement.dto";

interface PoItemsProps {
  readonly items: PurchaseOrderItemDto[];
}

export default function PoItems({ items }: PoItemsProps) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tTableHeader = useTranslations("TableHeader");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-medium">{tPurchaseOrder("items")}</p>
        <Button variant="outlinePrimary" size={"sm"}>
          <Plus className="h-4 w-4" />
          {tPurchaseOrder("add_item")}
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
            <TableHead className="text-left">{tTableHeader("no")}</TableHead>
            <TableHead className="text-left">{tTableHeader("name")}</TableHead>
            <TableHead className="text-right">{tTableHeader("order")}</TableHead>
            <TableHead className="text-right">{tTableHeader("tax")}</TableHead>
            <TableHead className="text-right">{tTableHeader("net")}</TableHead>
            <TableHead className="text-right">{tTableHeader("discount")}</TableHead>
            <TableHead className="text-right">{tTableHeader("amount")}</TableHead>
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
              <TableCell className="text-left">{item.no}</TableCell>
              <TableCell className="text-left">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {item.order_qty} {item.unit}
              </TableCell>
              <TableCell className="text-right">{item.tax}</TableCell>
              <TableCell className="text-right">{item.net}</TableCell>
              <TableCell className="text-right">{item.discount}</TableCell>
              <TableCell className="text-right">{item.amount}</TableCell>
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

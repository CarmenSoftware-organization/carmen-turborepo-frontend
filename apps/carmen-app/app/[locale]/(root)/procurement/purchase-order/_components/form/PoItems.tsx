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
        <p className="font-medium text-lg">{tPurchaseOrder("items")}</p>
        <Button variant="outlinePrimary" size={"sm"}>
          <Plus className="h-4 w-4" />
          {tPurchaseOrder("add_item")}
        </Button>
      </div>
      <div className="rounded-md border border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="text-center w-12 h-10">
                <Checkbox />
              </TableHead>
              <TableHead className="text-center w-12 h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Hash className="h-3.5 w-3.5 mx-auto" />
              </TableHead>
              <TableHead className="text-left h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("no")}
              </TableHead>
              <TableHead className="text-left h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("name")}
              </TableHead>
              <TableHead className="text-right h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("order")}
              </TableHead>
              <TableHead className="text-right h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("tax")}
              </TableHead>
              <TableHead className="text-right h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("net")}
              </TableHead>
              <TableHead className="text-right h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("discount")}
              </TableHead>
              <TableHead className="text-right h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("amount")}
              </TableHead>
              <TableHead className="text-right h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tTableHeader("action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/20 border-b border-border/50 last:border-0"
              >
                <TableCell className="text-center w-12 py-3">
                  <Checkbox />
                </TableCell>
                <TableCell className="text-center w-12 py-3 text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="text-left py-3 font-medium">{item.no}</TableCell>
                <TableCell className="text-left py-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right py-3 tabular-nums">
                  {item.order_qty}{" "}
                  <span className="text-muted-foreground text-xs ml-0.5">{item.unit}</span>
                </TableCell>
                <TableCell className="text-right py-3 tabular-nums text-muted-foreground">
                  {item.tax}
                </TableCell>
                <TableCell className="text-right py-3 tabular-nums text-muted-foreground">
                  {item.net}
                </TableCell>
                <TableCell className="text-right py-3 tabular-nums text-muted-foreground">
                  {item.discount}
                </TableCell>
                <TableCell className="text-right py-3 tabular-nums font-medium">
                  {item.amount}
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size={"icon"}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { StoreRequisitionItemDto } from "@/dtos/store-operation.dto";
import { Plus } from "lucide-react";
import { useState } from "react";
interface ItemStoreRequisitionProps {
  readonly mode: formType;
  readonly items: StoreRequisitionItemDto[];
}

export default function ItemStoreRequisition({ mode, items }: ItemStoreRequisitionProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      const allIds = items.map((item) => item.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  return (
    <Card className="p-2 space-y-2">
      <div className="flex justify-between items-center p-2">
        <p className="text-base font-medium">Items</p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="default" size="sm" disabled={mode === formType.VIEW}>
            <Plus />
            Add Item
          </Button>
        </div>
      </div>
      <Table className="border">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>
              <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Required Qty</TableHead>
            <TableHead>Approved Qty</TableHead>
            <TableHead>Issued Qty</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  id={`sr-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.required_qty}</TableCell>
              <TableCell>{item.approved_qty}</TableCell>
              <TableCell>{item.issued_qty}</TableCell>
              <TableCell>{item.total_amount}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

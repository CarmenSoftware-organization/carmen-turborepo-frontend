import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NumberInput from "@/components/form-custom/NumberInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MoqItem {
  id: string; // internal id for key
  unit_id: string;
  unit_name: string;
  note: string;
  qty: number;
}

interface MoqInlineEditProps {
  defaultUnitName?: string;
}

export function MoqInlineEdit({ defaultUnitName = "pcs" }: MoqInlineEditProps) {
  const [items, setItems] = useState<MoqItem[]>([]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        unit_id: "",
        unit_name: defaultUnitName,
        note: "",
        qty: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof MoqItem, value: string | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="mt-3 space-y-2 border-t pt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">MOQ List</h4>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleAddItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 text-xs">
            <div className="w-[80px]">
              <Select
                value={item.unit_name}
                onValueChange={(val) => handleUpdateItem(item.id, "unit_name", val)}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={defaultUnitName}>{defaultUnitName}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[80px]">
              <NumberInput
                classNames="h-7 text-xs"
                placeholder="Qty"
                value={item.qty}
                onChange={(value) => handleUpdateItem(item.id, "qty", value)}
              />
            </div>
            <div className="flex-1">
              <Input
                className="h-7 text-xs"
                placeholder="Note"
                value={item.note}
                onChange={(e) => handleUpdateItem(item.id, "note", e.target.value)}
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will remove the MOQ item.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleRemoveItem(item.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
}

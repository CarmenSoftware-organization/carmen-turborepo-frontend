"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
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
import { MoqItem } from "./types";

interface MoqInlineEditProps {
  readonly defaultUnitId: string;
  readonly defaultUnitName: string;
  readonly items: MoqItem[];
  readonly onChange: (items: MoqItem[]) => void;
}

export function MoqInlineEdit({
  defaultUnitId,
  defaultUnitName,
  items,
  onChange,
}: MoqInlineEditProps) {
  const handleAddItem = () => {
    onChange([
      ...items,
      {
        unit_id: defaultUnitId,
        unit_name: defaultUnitName,
        note: "",
        qty: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof MoqItem, value: string | number) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="mt-3 space-y-2 border-t pt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">MOQ List</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-xs">
            <div className="w-[80px]">
              <Select
                value={item.unit_id || defaultUnitId}
                onValueChange={(val) => {
                  const newItems = [...items];
                  newItems[index] = {
                    ...newItems[index],
                    unit_id: val,
                    unit_name: val === defaultUnitId ? defaultUnitName : item.unit_name,
                  };
                  onChange(newItems);
                }}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultUnitId && (
                    <SelectItem value={defaultUnitId}>{defaultUnitName}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[80px]">
              <NumberInput
                classNames="h-7 text-xs"
                placeholder="Qty"
                value={item.qty}
                onChange={(value) => handleUpdateItem(index, "qty", value)}
              />
            </div>
            <div className="flex-1">
              <Input
                className="h-7 text-xs"
                placeholder="Note"
                value={item.note}
                onChange={(e) => handleUpdateItem(index, "note", e.target.value)}
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive"
                >
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
                  <AlertDialogAction onClick={() => handleRemoveItem(index)}>
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

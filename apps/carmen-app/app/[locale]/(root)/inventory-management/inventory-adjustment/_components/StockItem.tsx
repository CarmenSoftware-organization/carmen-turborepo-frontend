import { StockDetailsDto, InventoryAdjustmentFormValues } from "@/dtos/inventory-adjustment.dto";
import { UseFormReturn } from "react-hook-form";
import { TableCell, TableRow } from "@/components/ui/table";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { Button } from "@/components/ui/button";
import { Save, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  index: number;
  form: UseFormReturn<InventoryAdjustmentFormValues>;
  isEditing: boolean;
  isViewMode: boolean;
  onToggleEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function StockItem({
  index,
  form,
  isEditing,
  isViewMode,
  onToggleEdit,
  onRemove,
}: Props) {
  const watchedValues = form.watch(`details.${index}`);

  return (
    <TableRow className={cn("h-9 border-b-muted", isEditing && "bg-muted/50")}>
      <TableCell className="text-center font-medium px-2 py-1 text-xs h-9 w-[40px]">
        {index + 1}
      </TableCell>
      <TableCell className="px-2 py-1 h-9">
        <FormField
          control={form.control}
          name={`details.${index}.product_name`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    placeholder="Product Name"
                    className="h-8 text-xs rounded-sm"
                  />
                </FormControl>
              ) : (
                <span className="text-xs truncate block max-w-[200px]">{field.value || "-"}</span>
              )}
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="px-2 py-1 h-9">
        <FormField
          control={form.control}
          name={`details.${index}.location_name`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    placeholder="Location"
                    className="h-8 text-xs rounded-sm"
                  />
                </FormControl>
              ) : (
                <span className="text-xs truncate block max-w-[150px]">{field.value || "-"}</span>
              )}
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right px-2 py-1 h-9 w-[100px]">
        <FormField
          control={form.control}
          name={`details.${index}.qty`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    type="number"
                    className="text-right h-8 text-xs rounded-sm"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              ) : (
                <span className="text-xs">{field.value?.toLocaleString() || 0}</span>
              )}
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right px-2 py-1 h-9 w-[120px]">
        <FormField
          control={form.control}
          name={`details.${index}.cost_per_unit`}
          render={({ field }) => (
            <FormItem className="space-y-0">
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    type="number"
                    className="text-right h-8 text-xs rounded-sm"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              ) : (
                <span className="text-xs">{field.value?.toLocaleString() || 0}</span>
              )}
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right px-2 py-1 text-xs h-9 w-[120px]">
        {((watchedValues?.qty || 0) * (watchedValues?.cost_per_unit || 0)).toLocaleString()}
      </TableCell>
      {!isViewMode && (
        <TableCell className="text-center px-1 py-1 h-9 w-[80px]">
          <div className="flex items-center justify-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted"
              onClick={() => onToggleEdit(index)}
            >
              {isEditing ? <Save className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

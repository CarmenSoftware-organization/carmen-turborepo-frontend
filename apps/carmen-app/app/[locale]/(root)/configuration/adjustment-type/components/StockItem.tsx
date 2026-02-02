import { StockDetailsDto } from "@/dtos/adjustment-type.dto";
import { UseFormReturn } from "react-hook-form";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { Button } from "@/components/ui/button";
import { Save, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockItemFormValues {
  description?: string;
  doc_status: string;
  note?: string;
  stock_in_detail: StockDetailsDto[];
}

interface Props {
  index: number;
  form: UseFormReturn<StockItemFormValues>;
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
  const watchedValues = form.watch(`stock_in_detail.${index}`);

  return (
    <TableRow className={cn(isEditing && "bg-muted/50")}>
      <TableCell className="text-center font-medium">{index + 1}</TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.product_name`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate {...field} placeholder="Product Name" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.location_name`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate {...field} placeholder="Location Name" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.qty`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    type="number"
                    className="text-right"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              ) : (
                <span>{field.value?.toLocaleString() || 0}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.cost_per_unit`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    type="number"
                    className="text-right"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              ) : (
                <span>{field.value?.toLocaleString() || 0}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        {((watchedValues?.qty || 0) * (watchedValues?.cost_per_unit || 0)).toLocaleString()}
      </TableCell>
      {!isViewMode && (
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => onToggleEdit(index)}>
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

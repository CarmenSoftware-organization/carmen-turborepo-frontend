import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ProductFormValues } from "@/dtos/product.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_LABELS } from "./ProductAttribute";

export interface AttributeItemType {
  label: string;
  value: string;
  data_type: string;
}

interface AttributeItemProps {
  mode: "view" | "edit";
  attribute?: AttributeItemType;
  index: number;
  control?: Control<ProductFormValues>;
  onRemove?: () => void;
  tProducts?: (key: string) => string;
  tProductLabels?: (key: string) => string;
}

export default function AttributeItem({
  mode,
  attribute,
  index,
  control,
  onRemove,
  tProducts,
  tProductLabels,
}: AttributeItemProps) {
  if (mode === "view" && attribute) {
    return (
      <div className="space-y-1">
        <p className="font-semibold text-sm">{attribute.label}</p>
        <p className="text-xs text-muted-foreground">{attribute.value}</p>
      </div>
    );
  }

  if (mode === "edit" && control && onRemove && tProducts && tProductLabels) {
    return (
      <div className="flex items-center gap-2">
        <FormField
          control={control}
          name={`product_info.info.${index}.label`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={tProductLabels("select_label")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_LABELS.map((label) => (
                      <SelectItem key={label} value={label}>
                        {tProductLabels(label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`product_info.info.${index}.value`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder={tProducts("enter_value")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="hover:text-destructive hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return null;
}

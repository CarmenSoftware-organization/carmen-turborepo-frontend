import { Control, useFieldArray } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/form-custom/form";
import { Button } from "@/components/ui/button";
import { Percent, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import NumberInput from "@/components/form-custom/NumberInput";
import FormBoolean from "@/components/form-custom/form-boolean";
import { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductFormValues } from "@/dtos/product.dto";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import AttributeItem, { AttributeItemType } from "./AttributeItem";

interface ProductAttributeProps {
  readonly control: Control<ProductFormValues>;
  readonly currentMode: formType;
}

export default function ProductAttribute({ control, currentMode }: ProductAttributeProps) {
  const tProducts = useTranslations("Products");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_info.info",
  });

  const handleAddAttribute = () => {
    append({ label: "", value: "", data_type: "string" });
  };

  const isViewMode = useMemo(() => currentMode === formType.VIEW, [currentMode]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base text-muted-foreground font-semibold">
          {tProducts("product_attribute")}
        </h2>
        {currentMode !== formType.VIEW && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddAttribute}
                  className="w-7 h-7"
                  disabled={isViewMode}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tProducts("add_attribute")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols- gap-4">
        <FormField
          control={control}
          name="product_info.price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tProducts("price")}</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  placeholder={tProducts("price")}
                  disabled={isViewMode}
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="product_info.price_deviation_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tProducts("price_deviation_limit")} (%)</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  placeholder={tProducts("price_deviation_limit")}
                  disabled={isViewMode}
                  min={0}
                  max={100}
                  suffix={<Percent className="h-3 w-3" />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="product_info.qty_deviation_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tProducts("qty_deviation_limit")} (%)</FormLabel>
              <FormControl>
                <NumberInput
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  placeholder={tProducts("qty_deviation_limit")}
                  disabled={isViewMode}
                  min={0}
                  max={100}
                  suffix={<Percent className="h-3 w-3" />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="product_info.barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tProducts("barcode")}</FormLabel>
              <FormControl>
                <InputValidate
                  placeholder={tProducts("barcode")}
                  {...field}
                  disabled={isViewMode}
                  minLength={6}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="product_info.is_used_in_recipe"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormBoolean
                value={field.value}
                onChange={field.onChange}
                label={tProducts("used_in_recipe")}
                type="checkbox"
                disabled={isViewMode}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="product_info.is_sold_directly"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormBoolean
                value={field.value}
                onChange={field.onChange}
                label={tProducts("sold_directly")}
                type="checkbox"
                disabled={isViewMode}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {isViewMode ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {fields && fields.length > 0 ? (
            fields.map((field, index) => (
              <AttributeItem
                key={field.id}
                mode="view"
                attribute={field as unknown as AttributeItemType}
                index={index}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{tProducts("no_attributes_added")}</p>
          )}
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <AttributeItem
              key={field.id}
              mode="edit"
              control={control}
              index={index}
              onRemove={() => remove(index)}
              tProducts={tProducts}
            />
          ))}
        </>
      )}
    </Card>
  );
}

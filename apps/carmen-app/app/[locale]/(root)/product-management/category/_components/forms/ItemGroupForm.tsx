import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryNode, createItemGroupSchema, type ItemGroupFormData } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import FormBoolean from "@/components/form-custom/form-boolean";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
interface ItemGroupFormProps {
  readonly mode: formType;
  readonly selectedNode?: CategoryNode;
  readonly parentNode?: CategoryNode;
  readonly onSubmit: (data: ItemGroupFormData) => void;
  readonly onCancel: () => void;
}

export function ItemGroupForm({
  mode,
  selectedNode,
  parentNode,
  onSubmit,
  onCancel,
}: ItemGroupFormProps) {
  const tCommon = useTranslations("Common");
  const tCategory = useTranslations("Category");
  const tAction = useTranslations("Action");

  const [parentName, setParentName] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (mode === formType.EDIT && selectedNode) {
      setParentId(selectedNode.product_subcategory_id || "");
      if (parentNode && selectedNode.product_subcategory_id === parentNode.id) {
        setParentName(parentNode.name);
      }
    } else if (parentNode) {
      setParentId(parentNode.id);
      setParentName(parentNode.name);
    }
  }, [mode, selectedNode, parentNode]);

  const ItemGroupFormSchema = useMemo(
    () =>
      createItemGroupSchema({
        codeRequired: tCategory("code_required"),
        nameRequired: tCategory("name_required"),
      }),
    [tCategory]
  ).omit({ id: true });

  const form = useForm<ItemGroupFormData>({
    resolver: zodResolver(ItemGroupFormSchema),
    defaultValues: {
      code: selectedNode?.code ?? "",
      name: selectedNode?.name ?? "",
      description: selectedNode?.description ?? "",
      product_subcategory_id: selectedNode?.product_subcategory_id || parentNode?.id || "",
      is_active: selectedNode?.is_active ?? true,
      price_deviation_limit:
        selectedNode?.price_deviation_limit ?? parentNode?.price_deviation_limit ?? 0,
      qty_deviation_limit:
        selectedNode?.qty_deviation_limit ?? parentNode?.qty_deviation_limit ?? 0,
      is_used_in_recipe: selectedNode?.is_used_in_recipe ?? parentNode?.is_used_in_recipe ?? false,
      is_sold_directly: selectedNode?.is_sold_directly ?? parentNode?.is_sold_directly ?? false,
      tax_profile_id: selectedNode?.tax_profile_id ?? parentNode?.tax_profile_id ?? "",
      tax_profile_name: selectedNode?.tax_profile_name ?? parentNode?.tax_profile_name ?? "",
      tax_rate: selectedNode?.tax_rate ?? parentNode?.tax_rate ?? 0,
    },
  });

  useEffect(() => {
    if (parentId) {
      form.setValue("product_subcategory_id", parentId);
    }
  }, [parentId, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="product_subcategory_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCategory("subcategory")}</FormLabel>
              <FormControl>
                <Input value={parentName} disabled className="bg-muted" />
              </FormControl>
              <input type="hidden" {...field} value={parentId || field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("code")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="price_deviation_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tCategory("price_deviation_limit")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter Price Deviation Limit"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qty_deviation_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tCategory("qty_deviation_limit")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="Enter Quantity Deviation Limit"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="is_used_in_recipe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-2">
                <div>
                  <FormLabel className="text-xs">{tCategory("used_in_recipe")}</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_sold_directly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-2">
                <div>
                  <FormLabel className="text-xs">{tCategory("sold_directly")}</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tax_profile_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCategory("tax_profile")}</FormLabel>
              <FormControl>
                <LookupTaxProfile
                  value={field.value}
                  displayName={form.watch("tax_profile_name")}
                  onValueChange={field.onChange}
                  onSelectObject={(selected) => {
                    form.setValue("tax_profile_name", selected.name);
                    form.setValue("tax_rate", Number(selected.tax_rate));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="py-2">
              <FormControl>
                <FormBoolean
                  value={field.value}
                  onChange={field.onChange}
                  label={tCommon("active")}
                  type="checkbox"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{mode === formType.EDIT ? tAction("edit") : tAction("add")}</Button>
        </div>
      </form>
    </Form>
  );
}

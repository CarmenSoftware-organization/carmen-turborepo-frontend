import { useForm, useWatch } from "react-hook-form";
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
import { CategoryNode } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import FormBoolean from "@/components/form-custom/form-boolean";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
import NumberInput from "@/components/form-custom/NumberInput";
import { Percent } from "lucide-react";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { z } from "zod";

export type CategoryType = "category" | "subcategory" | "itemgroup";

const categorySchema = (messages?: {
  codeRequired?: string;
  nameRequired?: string;
  taxProfileRequired?: string;
  taxProfileNameRequired?: string;
  taxRateRequired?: string;
}) =>
  z.object({
    id: z.string().optional(),
    code: z.string().min(1, { message: messages?.codeRequired ?? "Code is required" }),
    name: z.string().min(1, { message: messages?.nameRequired ?? "Name is required" }),
    price_deviation_limit: z.number(),
    qty_deviation_limit: z.number(),
    description: z.string().optional(),
    is_active: z.boolean(),
    is_used_in_recipe: z.boolean(),
    is_sold_directly: z.boolean(),
    is_edit_type: z.boolean().optional(),
    tax_profile_id: z
      .string()
      .min(1, { message: messages?.taxProfileRequired ?? "Tax profile is required" }),
    tax_profile_name: z
      .string()
      .min(1, { message: messages?.taxProfileNameRequired ?? "Tax profile name is required" }),
    tax_rate: z
      .number()
      .min(0, { message: messages?.taxRateRequired ?? "Tax rate must be a positive number" }),
    // Parent fields - optional depending on type
    product_category_id: z.string().optional(),
    product_subcategory_id: z.string().optional(),
  });

export type CategoryFormData = z.infer<ReturnType<typeof categorySchema>>;

interface Props {
  readonly type: CategoryType;
  readonly mode: formType;
  readonly selectedNode?: CategoryNode;
  readonly parentNode?: CategoryNode;
  readonly onSubmit: (data: CategoryFormData) => void;
  readonly onCancel: () => void;
}

export function CategoryForm({ type, mode, selectedNode, parentNode, onSubmit, onCancel }: Props) {
  const tCommon = useTranslations("Common");
  const tCategory = useTranslations("Category");
  const tAction = useTranslations("Action");

  const [parentName, setParentName] = useState("");
  const [parentId, setParentId] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<CategoryFormData | null>(null);

  // Set parent information for subcategory and itemgroup
  useEffect(() => {
    if (type === "category") return;

    const parentIdField = type === "subcategory" ? "product_category_id" : "product_subcategory_id";

    if (mode === formType.EDIT && selectedNode) {
      const nodeParentId = selectedNode[parentIdField as keyof CategoryNode] as string;
      setParentId(nodeParentId || "");
      if (parentNode && nodeParentId === parentNode.id) {
        setParentName(`${parentNode.code} - ${parentNode.name}`);
      }
    } else if (parentNode) {
      setParentId(parentNode.id);
      setParentName(`${parentNode.code} - ${parentNode.name}`);
    }
  }, [type, mode, selectedNode, parentNode]);

  // Create schema with translated messages
  const formSchema = useMemo(
    () =>
      categorySchema({
        codeRequired: tCategory("code_required"),
        nameRequired: tCategory("name_required"),
        taxProfileRequired: tCategory("tax_profile_required"),
        taxProfileNameRequired: tCategory("tax_profile_name_required"),
        taxRateRequired: tCategory("tax_rate_required"),
      }),
    [tCategory]
  );

  const defaultValues = useMemo((): CategoryFormData => {
    const baseValues: CategoryFormData = {
      code: selectedNode?.code ?? "",
      name: selectedNode?.name ?? "",
      description: selectedNode?.description ?? "",
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
    };

    if (type === "category") {
      return {
        ...baseValues,
        id: selectedNode?.id ?? "",
      };
    }

    if (type === "subcategory") {
      return {
        ...baseValues,
        product_category_id: selectedNode?.product_category_id || parentNode?.id || "",
      };
    }

    // itemgroup
    return {
      ...baseValues,
      product_subcategory_id: selectedNode?.product_subcategory_id || parentNode?.id || "",
    };
  }, [type, selectedNode, parentNode]);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Watch tax_profile_name for LookupTaxProfile
  const taxProfileName = useWatch({
    control: form.control,
    name: "tax_profile_name",
  });

  // Update parent ID in form when it changes
  useEffect(() => {
    if (type === "category" || !parentId) return;

    const fieldName = type === "subcategory" ? "product_category_id" : "product_subcategory_id";
    form.setValue(fieldName, parentId);
  }, [type, parentId, form]);

  const handleTaxProfileSelect = useCallback(
    (selected: { name: string; tax_rate: string | number }) => {
      form.setValue("tax_profile_name", selected.name);
      form.setValue("tax_rate", Number(selected.tax_rate));
    },
    [form]
  );

  const handleSubmit = (data: CategoryFormData) => {
    const isRecipeChanged = selectedNode?.is_used_in_recipe !== data.is_used_in_recipe;
    const isSoldChanged = selectedNode?.is_sold_directly !== data.is_sold_directly;

    if ((isRecipeChanged || isSoldChanged) && mode === formType.EDIT) {
      setPendingData(data);
      setShowConfirmDialog(true);
      return;
    }

    onSubmit(data);
  };

  const handleConfirm = () => {
    if (pendingData) {
      onSubmit({ ...pendingData, is_edit_type: true });
      setShowConfirmDialog(false);
      setPendingData(null);
    }
  };

  // Get parent field label based on type
  const getParentLabel = () => {
    switch (type) {
      case "subcategory":
        return tCategory("category");
      case "itemgroup":
        return tCategory("subcategory");
      default:
        return "";
    }
  };

  // Get parent field name based on type
  const getParentFieldName = (): "product_category_id" | "product_subcategory_id" => {
    return type === "subcategory" ? "product_category_id" : "product_subcategory_id";
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          {/* Parent Field - only for subcategory and itemgroup */}
          {type !== "category" && (
            <FormField
              control={form.control}
              name={getParentFieldName()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getParentLabel()}</FormLabel>
                  <FormControl>
                    <Input value={parentName} disabled className="bg-muted" />
                  </FormControl>
                  <input type="hidden" {...field} value={parentId || field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="code"
            required
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tCommon("code")}</FormLabel>
                <FormControl>
                  <InputValidate {...field} maxLength={15} />
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
                  <InputValidate {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_profile_id"
            required
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tCategory("tax_profile")}</FormLabel>
                <FormControl>
                  <LookupTaxProfile
                    value={field.value}
                    displayName={taxProfileName}
                    onValueChange={field.onChange}
                    onSelectObject={handleTaxProfileSelect}
                  />
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
                    <NumberInput
                      value={field.value ?? 0}
                      onChange={field.onChange}
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
              control={form.control}
              name="qty_deviation_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tCategory("qty_deviation_limit")}</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      min={0}
                      max={100}
                      suffix={<Percent className="h-3 w-3" />}
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
                  <TextareaValidate {...field} maxLength={256} />
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
            <Button type="button" variant="outline" onClick={onCancel}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit">
              {mode === formType.EDIT ? tAction("edit") : tAction("add")}
            </Button>
          </div>
        </form>
      </Form>

      <DeleteConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirm}
        title={tCategory("confirm_edit")}
        description={tCategory("confirm_edit_description")}
      />
    </>
  );
}

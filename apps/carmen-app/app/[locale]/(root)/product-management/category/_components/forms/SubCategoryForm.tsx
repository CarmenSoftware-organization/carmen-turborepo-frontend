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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryNode,
  createSubCategorySchema,
  type SubCategoryFormData,
} from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import FormBoolean from "@/components/form-custom/form-boolean";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
interface SubCategoryFormProps {
  readonly mode: formType;
  readonly selectedNode?: CategoryNode;
  readonly parentNode?: CategoryNode;
  readonly onSubmit: (data: SubCategoryFormData) => void;
  readonly onCancel: () => void;
}

export function SubCategoryForm({
  mode,
  selectedNode,
  parentNode,
  onSubmit,
  onCancel,
}: SubCategoryFormProps) {
  const tCommon = useTranslations("Common");
  const tCategory = useTranslations("Category");
  const tAction = useTranslations("Action");

  const [parentName, setParentName] = useState("");
  const [parentId, setParentId] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<SubCategoryFormData | null>(null);

  // Set parent information when editing or creating
  useEffect(() => {
    if (mode === formType.EDIT && selectedNode) {
      // When editing, get the parent ID from the selected node
      setParentId(selectedNode.product_category_id || "");

      // For edit mode, we need to find the parent name from the parent_category_id
      if (parentNode && selectedNode.product_category_id === parentNode.id) {
        setParentName(parentNode.name);
      }
    } else if (parentNode) {
      // When creating, use the parent node provided
      setParentId(parentNode.id);
      setParentName(parentNode.name);
    }
  }, [mode, selectedNode, parentNode]);

  const SubCategoryFormSchema = useMemo(
    () =>
      createSubCategorySchema({
        codeRequired: tCategory("code_required"),
        nameRequired: tCategory("name_required"),
      }),
    [tCategory]
  ).omit({ id: true });

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      code: selectedNode?.code ?? "",
      name: selectedNode?.name ?? "",
      description: selectedNode?.description ?? "",
      product_category_id: selectedNode?.product_category_id || parentNode?.id || "",
      is_active: selectedNode?.is_active ?? true,
      price_deviation_limit: selectedNode?.price_deviation_limit ?? 0,
      qty_deviation_limit: selectedNode?.qty_deviation_limit ?? 0,
      is_used_in_recipe: selectedNode?.is_used_in_recipe ?? parentNode?.is_used_in_recipe ?? false,
      is_sold_directly: selectedNode?.is_sold_directly ?? parentNode?.is_sold_directly ?? false,
      tax_profile_id: selectedNode?.tax_profile_id ?? "754acf6d-333b-441d-a7f9-b77f069da933",
      tax_profile_name: selectedNode?.tax_profile_name ?? "VAT 2%",
      tax_rate: selectedNode?.tax_rate ?? 2,
    },
  });

  // Update form values when parent information changes
  useEffect(() => {
    if (parentId) {
      form.setValue("product_category_id", parentId);
    }
  }, [parentId, form]);

  const handleSubmit = (data: SubCategoryFormData) => {
    // Check if is_used_in_recipe or is_sold_directly has changed
    const isRecipeChanged = selectedNode?.is_used_in_recipe !== data.is_used_in_recipe;
    const isSoldChanged = selectedNode?.is_sold_directly !== data.is_sold_directly;

    if ((isRecipeChanged || isSoldChanged) && mode === formType.EDIT) {
      setPendingData(data);
      setShowConfirmDialog(true);
      return;
    }

    // If no changes to these fields or in add mode, submit directly
    onSubmit(data);
  };

  const handleConfirm = () => {
    if (pendingData) {
      onSubmit({ ...pendingData, is_edit_type: true });
      setShowConfirmDialog(false);
      setPendingData(null);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="product_category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tCategory("category")}</FormLabel>
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
            <Button type="submit">
              {mode === formType.EDIT ? tAction("edit") : tAction("add")}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCategory("confirm_edit")}</AlertDialogTitle>
            <AlertDialogDescription>{tCategory("confirm_edit_description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{tAction("continue")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

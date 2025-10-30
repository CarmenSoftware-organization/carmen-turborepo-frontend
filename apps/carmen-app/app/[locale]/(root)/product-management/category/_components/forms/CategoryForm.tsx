import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryDto, CategoryNode, createCategorySchema } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import FormBoolean from "@/components/form-custom/form-boolean";
interface CategoryFormProps {
  readonly mode: formType;
  readonly selectedNode?: CategoryNode;
  readonly onSubmit: (data: CategoryDto) => void;
  readonly onCancel: () => void;
}

export function CategoryForm({ mode, selectedNode, onSubmit, onCancel }: CategoryFormProps) {
  const tCategory = useTranslations("Category");
  const tCommon = useTranslations("Common");
  const tAction = useTranslations("Action");

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<CategoryDto | null>(null);

  const CategorySchema = useMemo(
    () =>
      createCategorySchema({
        codeRequired: tCategory("name_required"),
        nameRequired: tCategory("code_required"),
      }),
    [tCommon]
  );

  const form = useForm<CategoryDto>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      id: selectedNode?.id ?? "",
      name: selectedNode?.name ?? "",
      code: selectedNode?.code ?? "",
      description: selectedNode?.description ?? "",
      is_active: true,
      price_deviation_limit: selectedNode?.price_deviation_limit ?? 0,
      qty_deviation_limit: selectedNode?.qty_deviation_limit ?? 0,
      is_used_in_recipe: selectedNode?.is_used_in_recipe ?? false,
      is_sold_directly: selectedNode?.is_sold_directly ?? false,
    },
  });

  const handleSubmit = (data: CategoryDto) => {
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
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
              {tAction("cancel")}
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
            <AlertDialogAction onClick={handleConfirm}>{tCommon("continue")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

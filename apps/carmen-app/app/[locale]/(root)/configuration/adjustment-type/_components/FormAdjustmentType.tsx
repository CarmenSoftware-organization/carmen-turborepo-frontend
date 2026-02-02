"use client";

import { useAuth } from "@/context/AuthContext";
import {
  createAdjustmentTypeFormSchema,
  AdjustmentTypeDto,
  AdjustmentTypeFormValues,
} from "@/dtos/adjustment-type.dto";
import { formType } from "@/dtos/form.dto";
import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save, X, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";
import FormBoolean from "@/components/form-custom/form-boolean";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useRouter } from "@/lib/navigation";
import {
  adjustmentTypeQueryKey,
  useAdjustmentTypeCreateMutation,
  useUpdateAdjustmentTypeMutation,
  useDeleteAdjustmentTypeMutation,
} from "@/hooks/use-adjustment-type";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { STOCK_IN_OUT_TYPE_PAYLOAD } from "@/dtos/stock-in-out.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";

interface Props {
  readonly defaultValues?: AdjustmentTypeDto;
  mode: formType;
  onViewMode?: () => void;
}

export default function FormAdjustmentType({ defaultValues, mode, onViewMode }: Props) {
  const { token, buCode } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tAdj = useTranslations("AdjustmentType");

  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const createMutation = useAdjustmentTypeCreateMutation(token, buCode);
  const updateMutation = useUpdateAdjustmentTypeMutation(token, buCode);
  const deleteMutation = useDeleteAdjustmentTypeMutation(token, buCode);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isViewMode = currentMode === formType.VIEW;
  const isAddMode = currentMode === formType.ADD;

  const adjustmentTypeSchema = useMemo(
    () =>
      createAdjustmentTypeFormSchema({
        codeRequired: tAdj("errors.code_required"),
        codeMaxLength: tAdj("errors.code_max_length"),
        nameRequired: tAdj("errors.name_required"),
        typeRequired: tAdj("errors.type_required"),
      }),
    [tAdj]
  );

  const form = useForm<AdjustmentTypeFormValues>({
    resolver: zodResolver(adjustmentTypeSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      type: defaultValues?.type || undefined,
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active ?? true,
    },
  });

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
    onViewMode?.();
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  const onCancel = () => {
    if (currentMode === formType.EDIT) {
      form.reset();
      handleViewMode();
    } else {
      router.back();
    }
  };

  const handleSubmit = (data: AdjustmentTypeFormValues) => {
    if (currentMode === formType.EDIT && defaultValues?.id) {
      updateMutation.mutate(
        { id: defaultValues.id, data },
        {
          onSuccess: () => {
            toastSuccess({ message: tAdj("edit_success") });
            queryClient.invalidateQueries({
              queryKey: [adjustmentTypeQueryKey, buCode, defaultValues.id],
            });
            queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
            handleViewMode();
          },
          onError: () => {
            toastError({ message: tAdj("edit_error") });
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: (response: unknown) => {
          // Type assertion to access response data if needed, generic post returns potentially unknown
          // Assuming standard structure if using config.api wrappers typically returing data
          const res = response as { data?: { id?: string } };
          if (res?.data?.id) {
            toastSuccess({ message: tAdj("add_success") });
            router.push(`/configuration/adjustment-type/${res.data.id}`);
            queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
            handleViewMode();
          } else {
            // Fallback if ID is not directly in data.id structure
            toastSuccess({ message: tAdj("add_success") });
            router.push(`/configuration/adjustment-type`); // Go back to list
            queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
          }
        },
        onError: () => {
          toastError({ message: tAdj("add_error") });
        },
      });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (defaultValues?.id) {
      deleteMutation.mutate(defaultValues.id, {
        onSuccess: () => {
          toastSuccess({ message: tAdj("delete_success") });
          queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
          setDeleteDialogOpen(false);
          router.push("/configuration/adjustment-type");
        },
        onError: () => {
          toastError({ message: tAdj("delete_error") });
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        {/* Header - Compact ERP Style */}
        <div className="sticky top-0 z-20 bg-background border-b px-4 py-2 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex flex-col">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        className="text-xs hover:text-foreground transition-colors"
                        href="/configuration/adjustment-type"
                      >
                        {tAdj("title")}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-semibold">
                      {isAddMode ? tAdj("new_reference") : defaultValues?.code}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-2 mt-2">
                <h1 className="text-lg font-bold tracking-tight leading-none truncate max-w-[300px] md:max-w-[500px]">
                  {isAddMode ? tAdj("new_adjustment_type") : defaultValues?.name}
                </h1>
                {!isAddMode && (
                  <Badge
                    variant={defaultValues?.is_active ? "active" : "destructive"}
                    className={cn("h-5 px-1.5 text-[10px] uppercase")}
                  >
                    {defaultValues?.is_active ? tAdj("active") : tAdj("inactive")}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isViewMode ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleEditMode}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {tAdj("edit")}
                </Button>
                {!isAddMode && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {tAdj("delete")}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onCancel}>
                  <X className="w-3.5 h-3.5" />
                  {tAdj("cancel")}
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary/90 hover:bg-primary"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      {tAdj("save")}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <FormProvider {...form}>
            {/* Main Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                required
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold">{tAdj("code")}</FormLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={5}
                        placeholder={tAdj("enter_code")}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                required
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold">{tAdj("name")}</FormLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={100}
                        placeholder={tAdj("enter_name")}
                        className="h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                required
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold">{tAdj("type")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isViewMode}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder={tAdj("select_type")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={STOCK_IN_OUT_TYPE_PAYLOAD.STOCK_IN}>
                          {tAdj("stock_in")}
                        </SelectItem>
                        <SelectItem value={STOCK_IN_OUT_TYPE_PAYLOAD.STOCK_OUT}>
                          {tAdj("stock_out")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="col-span-1 flex flex-col justify-end pb-2">
                    <FormControl>
                      <FormBoolean
                        value={field.value}
                        onChange={field.onChange}
                        label={tAdj("active_status")}
                        type="checkbox"
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-3 space-y-1">
                    <FormLabel className="text-xs font-semibold">{tAdj("description")}</FormLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={500}
                        placeholder={isViewMode ? "-" : tAdj("enter_description")}
                        className="min-h-[80px] resize-none text-sm"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormProvider>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tAdj("delete_adjustment_type")}
        description={tAdj("confirm_delete_description", { name: defaultValues?.name || "" })}
        isLoading={isDeleting}
      />
    </>
  );
}

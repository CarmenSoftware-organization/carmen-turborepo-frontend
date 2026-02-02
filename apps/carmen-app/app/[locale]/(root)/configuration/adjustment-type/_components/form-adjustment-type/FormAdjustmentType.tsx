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
import { Save, X, Pencil, Trash2 } from "lucide-react";
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

interface Props {
  readonly defaultValues?: AdjustmentTypeDto;
  mode: formType;
  onViewMode?: () => void;
}

export default function FormAdjustmentType({ defaultValues, mode, onViewMode }: Props) {
  const { token, buCode } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

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
        codeRequired: "Code is required",
        codeMaxLength: "Code max length is 5",
        nameRequired: "Name is required",
        typeRequired: "Type is required",
      }),
    []
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
            toastSuccess({ message: "Edit success" });
            queryClient.invalidateQueries({
              queryKey: [adjustmentTypeQueryKey, buCode, defaultValues.id],
            });
            queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
            handleViewMode();
          },
          onError: () => {
            toastError({ message: "Edit error" });
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
            toastSuccess({ message: "Add success" });
            router.push(`/configuration/adjustment-type/${res.data.id}`);
            queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
            handleViewMode();
          } else {
            // Fallback if ID is not directly in data.id structure
            toastSuccess({ message: "Add success" });
            router.push(`/configuration/adjustment-type`); // Go back to list
            queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
          }
        },
        onError: () => {
          toastError({ message: "Add error" });
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
          toastSuccess({ message: "Delete success" });
          queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
          setDeleteDialogOpen(false);
          router.push("/configuration/adjustment-type");
        },
        onError: () => {
          toastError({ message: "Delete error" });
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <>
      <div className="m-4 pb-10">
        <div className="sticky top-0 z-20 bg-background border-b border-border">
          <div className="flex items-center justify-between mb-2 pb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link className="text-xs" href="/configuration/adjustment-type">
                      Adjustment Type
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {isAddMode ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold">New</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold">
                      {defaultValues?.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-end gap-2">
              {isViewMode ? (
                <>
                  <Button size="sm" onClick={handleEditMode}>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  {!isAddMode && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FormProvider {...form}>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <InputValidate
                          {...field}
                          disabled={isViewMode}
                          maxLength={5}
                          placeholder="Enter code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <InputValidate
                          {...field}
                          disabled={isViewMode}
                          maxLength={100}
                          placeholder="Enter name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isViewMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={STOCK_IN_OUT_TYPE_PAYLOAD.STOCK_IN}>
                            Stock In
                          </SelectItem>
                          <SelectItem value={STOCK_IN_OUT_TYPE_PAYLOAD.STOCK_OUT}>
                            Stock Out
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
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4 h-[72px]">
                      <FormControl>
                        <FormBoolean
                          value={field.value}
                          onChange={field.onChange}
                          label="Active"
                          type="checkbox"
                          disabled={isViewMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={500}
                        placeholder="Enter description"
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
        title="Delete Adjustment Type"
        description={`Are you sure you want to delete "${defaultValues?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}

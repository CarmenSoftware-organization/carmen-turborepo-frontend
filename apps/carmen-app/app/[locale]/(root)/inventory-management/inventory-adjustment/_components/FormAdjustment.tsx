"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm, useFieldArray, FormProvider, UseFormReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Save, X, Pencil, Trash2, Plus, Package, Loader2, Send } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useRouter } from "@/lib/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StockItem from "./StockItem";
import { formatDate } from "@/utils/format/date";
import {
  DOC_STATUS,
  INVENTORY_ADJUSTMENT_TYPE,
  INVENTORY_ADJUSTMENT_TYPE_PAYLOAD,
  inventoryAdjustmentFormSchema,
  InventoryAdjustmentFormValues,
  InventoryAdjustmentStockInDto,
  InventoryAdjustmentStockOutDto,
  StockDetailsDto,
} from "@/dtos/inventory-adjustment.dto";
import {
  queryKeyInventoryAdjustment,
  useDeleteInventoryAdjustmentMutation,
  useInventoryAdjustmentMutation,
  useUpdateInventoryAdjustmentMutation,
} from "@/hooks/use-inventory-adjustment";

interface Props {
  mode: formType;
  form_type: INVENTORY_ADJUSTMENT_TYPE;
  initValues?: InventoryAdjustmentStockInDto | InventoryAdjustmentStockOutDto;
}

export default function FormAdjustment({ mode, form_type, initValues }: Props) {
  const { token, buCode, dateFormat } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRows, setEditingRows] = useState<Set<number>>(new Set());

  const createMutation = useInventoryAdjustmentMutation(token, buCode, form_type);
  const updateMutation = useUpdateInventoryAdjustmentMutation(token, buCode, form_type);
  const deleteMutation = useDeleteInventoryAdjustmentMutation(token, buCode, form_type);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isViewMode = currentMode === formType.VIEW;
  const isAddMode = currentMode === formType.ADD;

  const documentNo = useMemo(() => {
    if (!initValues) return "";
    if (form_type === INVENTORY_ADJUSTMENT_TYPE.STOCK_IN) {
      return (initValues as InventoryAdjustmentStockInDto).si_no;
    }
    return (initValues as InventoryAdjustmentStockOutDto).so_no;
  }, [initValues, form_type]);

  const form = useForm<InventoryAdjustmentFormValues>({
    resolver: zodResolver(inventoryAdjustmentFormSchema),
    defaultValues: {
      description: initValues?.description || "",
      doc_status: initValues?.doc_status || DOC_STATUS.IN_PROGRESS,
      note: initValues?.note || "",
      details: initValues?.details || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  // Handlers
  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  const handleAdd = useCallback(() => {
    const newIndex = fields.length;
    const newItem: StockDetailsDto = {
      product_id: "",
      product_name: "",
      product_local_name: "",
      location_id: "",
      location_code: "",
      location_name: "",
      qty: 0,
      cost_per_unit: 0,
      total_cost: 0,
      description: "",
      note: "",
    };
    append(newItem);
    setEditingRows((prev) => new Set(prev).add(newIndex));
  }, [fields.length, append]);

  const handleToggleEdit = useCallback((index: number) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
      setEditingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        const updatedSet = new Set<number>();
        newSet.forEach((idx) => {
          if (idx > index) {
            updatedSet.add(idx - 1);
          } else {
            updatedSet.add(idx);
          }
        });
        return updatedSet;
      });
    },
    [remove]
  );

  const onCancel = () => {
    if (currentMode === formType.EDIT) {
      form.reset();
      setEditingRows(new Set());
      handleViewMode();
    } else {
      router.back();
    }
  };

  const handleSubmit = (data: InventoryAdjustmentFormValues, statusOverride?: string) => {
    const payload = {
      description: data.description,
      doc_status: statusOverride || data.doc_status,
      note: data.note,
      inventory_adjustment_type:
        form_type === INVENTORY_ADJUSTMENT_TYPE.STOCK_IN
          ? INVENTORY_ADJUSTMENT_TYPE_PAYLOAD.STOCK_IN
          : INVENTORY_ADJUSTMENT_TYPE_PAYLOAD.STOCK_OUT,
      details: {
        add: data.details.filter((item) => !item.id),
        update: data.details.filter((item) => item.id),
        remove: [],
      },
    };

    if (currentMode === formType.EDIT && initValues?.id) {
      updateMutation.mutate(
        { id: initValues.id, data: payload },
        {
          onSuccess: () => {
            toastSuccess({ message: "Edit success" });
            queryClient.invalidateQueries({
              queryKey: [queryKeyInventoryAdjustment, buCode, initValues.id],
            });
            queryClient.invalidateQueries({ queryKey: [queryKeyInventoryAdjustment, buCode] });
            handleViewMode();
          },
          onError: () => {
            toastError({ message: "Edit error" });
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (response: unknown) => {
          const res = response as { data?: { id?: string } };
          if (res?.data?.id) {
            toastSuccess({ message: "Add success" });
            router.push(`/configuration/adjustment-type/${form_type}/${res.data.id}`);
            queryClient.invalidateQueries({ queryKey: [queryKeyInventoryAdjustment, buCode] });
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
    if (initValues?.id) {
      deleteMutation.mutate(initValues.id, {
        onSuccess: () => {
          toastSuccess({ message: "Delete success" });
          queryClient.invalidateQueries({ queryKey: [queryKeyInventoryAdjustment, buCode] });
          setDeleteDialogOpen(false);
          router.push("/inventory-management/inventory-adjustment");
        },
        onError: () => {
          toastError({ message: "Delete error" });
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  const typeLabel = form_type === INVENTORY_ADJUSTMENT_TYPE.STOCK_IN ? "Stock In" : "Stock Out";

  // Calculate totals
  const watchedItems = form.watch("details");
  const totalQty = watchedItems?.reduce((sum, item) => sum + (item?.qty || 0), 0) || 0;
  const grandTotal =
    watchedItems?.reduce((sum, item) => sum + (item?.qty || 0) * (item?.cost_per_unit || 0), 0) ||
    0;

  const isSubmited = useWatch({
    control: form.control,
    name: "doc_status",
  });

  return (
    <>
      <div className="m-4 pb-10">
        {/* Header */}
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
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs">{typeLabel}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {isAddMode ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold">New</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold">{documentNo}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            {isSubmited && (
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
                    <Button variant="outline" size="sm" onClick={onCancel} disabled={isPending}>
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={form.handleSubmit((data) =>
                        handleSubmit(data, DOC_STATUS.IN_PROGRESS)
                      )}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={form.handleSubmit((data) =>
                        handleSubmit(data, DOC_STATUS.COMPLETED)
                      )}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FormProvider {...form}>
            <div className="py-4 space-y-4">
              {/* Document Info Card */}
              {!isAddMode && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Document Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Document No.</span>
                        <p className="font-semibold">{documentNo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Type</span>
                        <div className="font-medium">
                          <Badge
                            variant="outline"
                            className={cn(
                              form_type === INVENTORY_ADJUSTMENT_TYPE.STOCK_IN
                                ? "border-green-500 text-green-600"
                                : "border-orange-500 text-orange-600"
                            )}
                          >
                            {typeLabel}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Status</span>
                        <div className="font-medium">
                          <Badge variant={initValues?.doc_status} className="font-bold">
                            {initValues?.doc_status?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created At</span>
                        <p className="font-medium text-sm">
                          {formatDate(initValues?.created_at, dateFormat || "yyyy-MM-dd")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Form Fields Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
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
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Note */}
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <TextareaValidate
                            {...field}
                            disabled={isViewMode}
                            maxLength={500}
                            placeholder="Enter note"
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Stock Details Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Stock Details</CardTitle>
                    {!isViewMode && (
                      <Button type="button" size="sm" onClick={handleAdd}>
                        <Plus className="w-4 h-4" />
                        Add Item
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-sm">No items yet</p>
                      {!isViewMode && (
                        <p className="text-xs mt-1">Click &quot;Add Item&quot; to start</p>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-[50px] text-center">#</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right w-[100px]">Qty</TableHead>
                            <TableHead className="text-right w-[120px]">Cost/Unit</TableHead>
                            <TableHead className="text-right w-[120px]">Total</TableHead>
                            {!isViewMode && (
                              <TableHead className="w-[100px] text-center">Action</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => (
                            <StockItem
                              key={field.id}
                              index={index}
                              form={form}
                              isEditing={editingRows.has(index)}
                              isViewMode={isViewMode}
                              onToggleEdit={handleToggleEdit}
                              onRemove={handleRemove}
                            />
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow className="bg-muted/30 font-semibold">
                            <TableCell colSpan={3} className="text-right">
                              Total
                            </TableCell>
                            <TableCell className="text-right">
                              {totalQty.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right text-primary">
                              {grandTotal.toLocaleString()}
                            </TableCell>
                            {!isViewMode && <TableCell />}
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </FormProvider>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${typeLabel}`}
        description={`Are you sure you want to delete "${documentNo}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}

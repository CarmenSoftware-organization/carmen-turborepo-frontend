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
import { STOCK_IN_OUT_TYPE, STOCK_IN_OUT_TYPE_PAYLOAD } from "@/dtos/stock-in-out.dto";

interface Props {
  mode: formType;
  form_type: STOCK_IN_OUT_TYPE;
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
    if (form_type === STOCK_IN_OUT_TYPE.STOCK_IN) {
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
        form_type === STOCK_IN_OUT_TYPE.STOCK_IN
          ? STOCK_IN_OUT_TYPE_PAYLOAD.STOCK_IN
          : STOCK_IN_OUT_TYPE_PAYLOAD.STOCK_OUT,
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

  const typeLabel = form_type === STOCK_IN_OUT_TYPE.STOCK_IN ? "Stock In" : "Stock Out";

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
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        href="/configuration/adjustment-type"
                      >
                        Inventory Adjustment
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-semibold">{typeLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="text-lg font-bold tracking-tight leading-none">
                  {isAddMode ? "New Adjustment" : documentNo}
                </h1>
                {!isAddMode && (
                  <Badge
                    variant={initValues?.doc_status}
                    className="h-5 px-1.5 text-[10px] uppercase"
                  >
                    {initValues?.doc_status}
                  </Badge>
                )}
              </div>
            </div>

            {/* Compact Info Strip (Only visible in View/Edit mode) */}
            {!isAddMode && (
              <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground border-l pl-4 ml-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold">Type</span>
                  <span
                    className={cn(
                      "font-medium",
                      form_type === STOCK_IN_OUT_TYPE.STOCK_IN
                        ? "text-green-600"
                        : "text-orange-600"
                    )}
                  >
                    {typeLabel}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold">Date</span>
                  <span className="font-medium text-foreground">
                    {formatDate(initValues?.created_at, dateFormat || "yyyy-MM-dd")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isSubmited && (
            <div className="flex items-center gap-2">
              {isViewMode ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={handleEditMode}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  {!isAddMode && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={onCancel}
                    disabled={isPending}
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary/90 hover:bg-primary"
                    onClick={form.handleSubmit((data) =>
                      handleSubmit(data, DOC_STATUS.IN_PROGRESS)
                    )}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={form.handleSubmit((data) => handleSubmit(data, DOC_STATUS.COMPLETED))}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <FormProvider {...form}>
            {/* Header Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-muted-foreground">
                      Description
                    </FormLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={500}
                        placeholder={isViewMode ? "-" : "Enter description"}
                        className="min-h-[60px] resize-none text-sm"
                        rows={2}
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
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold text-muted-foreground">
                      Note
                    </FormLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={500}
                        placeholder={isViewMode ? "-" : "Enter note"}
                        className="min-h-[60px] resize-none text-sm"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock Items Table */}
            <div className="border rounded-md bg-card shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  Stock Details
                </h3>
                {!isViewMode && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs"
                    onClick={handleAdd}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Item
                  </Button>
                )}
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-muted">
                      <TableHead className="w-[40px] text-center h-9 text-xs">#</TableHead>
                      <TableHead className="h-9 text-xs">Product</TableHead>
                      <TableHead className="h-9 text-xs">Location</TableHead>
                      <TableHead className="text-right w-[100px] h-9 text-xs">Qty</TableHead>
                      <TableHead className="text-right w-[120px] h-9 text-xs">Cost/Unit</TableHead>
                      <TableHead className="text-right w-[120px] h-9 text-xs">Total</TableHead>
                      {!isViewMode && (
                        <TableHead className="w-[80px] text-center h-9 text-xs">Action</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={isViewMode ? 6 : 7}
                          className="h-[150px] text-center text-muted-foreground"
                        >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <Package className="w-8 h-8 opacity-20" />
                            <span className="text-xs">No items added</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => (
                        <StockItem
                          key={field.id}
                          index={index}
                          form={form}
                          isEditing={editingRows.has(index)}
                          isViewMode={isViewMode}
                          onToggleEdit={handleToggleEdit}
                          onRemove={handleRemove}
                        />
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-muted/30 font-semibold border-t">
                      <TableCell colSpan={3} className="text-right py-2 text-xs">
                        Total
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs">
                        {totalQty.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right py-2 text-xs">-</TableCell>
                      <TableCell className="text-right py-2 text-xs text-primary">
                        {grandTotal.toLocaleString()}
                      </TableCell>
                      {!isViewMode && <TableCell className="py-2" />}
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${typeLabel}`}
        description={`Are you sure you want to delete "${documentNo}"?`}
        isLoading={isDeleting}
      />
    </>
  );
}

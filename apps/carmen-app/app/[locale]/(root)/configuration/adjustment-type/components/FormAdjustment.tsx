"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm, useFieldArray, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  ADJUSTMENT_TYPE,
  ADJUSTMENT_TYPE_PAYLOAD,
  AdjustmentStockInDto,
  AdjustmentStockOutDto,
  stockDetailsSchema,
  StockDetailsDto,
} from "@/dtos/adjustment-type.dto";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Save, X, Pencil, Trash2, Plus, Package, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
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
import {
  useAdjustmentTypeMutation,
  useUpdateAdjustmentTypeMutation,
  useDeleteAdjustmentTypeMutation,
  queryKeyAdjustmentType,
} from "@/hooks/use-adjustment-type";
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

// Form Schema - ใช้ stockDetailsSchema จาก DTO
const formSchema = z.object({
  description: z.string().optional(),
  doc_status: z.string().default("draft"),
  note: z.string().optional(),
  stock_in_detail: z.array(stockDetailsSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  mode: formType;
  form_type: ADJUSTMENT_TYPE;
  initValues?: AdjustmentStockInDto | AdjustmentStockOutDto;
}

// Stock Detail Row Component
interface StockDetailRowProps {
  index: number;
  form: UseFormReturn<FormValues>;
  isEditing: boolean;
  isViewMode: boolean;
  onToggleEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function StockDetailRow({
  index,
  form,
  isEditing,
  isViewMode,
  onToggleEdit,
  onRemove,
}: StockDetailRowProps) {
  const watchedValues = form.watch(`stock_in_detail.${index}`);

  return (
    <TableRow className={cn(isEditing && "bg-muted/50")}>
      <TableCell className="text-center font-medium">{index + 1}</TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.product_name`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate {...field} placeholder="Product Name" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.location_name`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate {...field} placeholder="Location Name" />
                </FormControl>
              ) : (
                <span>{field.value || "-"}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.qty`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    type="number"
                    className="text-right"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              ) : (
                <span>{field.value?.toLocaleString() || 0}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        <FormField
          control={form.control}
          name={`stock_in_detail.${index}.cost_per_unit`}
          render={({ field }) => (
            <FormItem>
              {isEditing && !isViewMode ? (
                <FormControl>
                  <InputValidate
                    {...field}
                    type="number"
                    className="text-right"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              ) : (
                <span>{field.value?.toLocaleString() || 0}</span>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        {((watchedValues?.qty || 0) * (watchedValues?.cost_per_unit || 0)).toLocaleString()}
      </TableCell>
      {!isViewMode && (
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggleEdit(index)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export default function FormAdjustment({ mode, form_type, initValues }: Props) {
  const { token, buCode } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRows, setEditingRows] = useState<Set<number>>(new Set());

  const createMutation = useAdjustmentTypeMutation(token, buCode, form_type);
  const updateMutation = useUpdateAdjustmentTypeMutation(token, buCode, form_type);
  const deleteMutation = useDeleteAdjustmentTypeMutation(token, buCode, form_type);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isViewMode = currentMode === formType.VIEW;
  const isAddMode = currentMode === formType.ADD;

  const documentNo = useMemo(() => {
    if (!initValues) return "";
    if (form_type === ADJUSTMENT_TYPE.STOCK_IN) {
      return (initValues as AdjustmentStockInDto).si_no;
    }
    return (initValues as AdjustmentStockOutDto).so_no;
  }, [initValues, form_type]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initValues?.description || "",
      doc_status: initValues?.doc_status || "draft",
      note: initValues?.note || "",
      stock_in_detail: initValues?.stock_in_detail || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stock_in_detail",
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

  const handleSubmit = (data: FormValues) => {
    const payload = {
      description: data.description,
      doc_status: data.doc_status,
      note: data.note,
      adjustment_type:
        form_type === ADJUSTMENT_TYPE.STOCK_IN
          ? ADJUSTMENT_TYPE_PAYLOAD.STOCK_IN
          : ADJUSTMENT_TYPE_PAYLOAD.STOCK_OUT,
      stock_in_detail: {
        add: data.stock_in_detail.filter((item) => !item.id),
        update: data.stock_in_detail.filter((item) => item.id),
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
              queryKey: [queryKeyAdjustmentType, buCode, initValues.id],
            });
            queryClient.invalidateQueries({ queryKey: [queryKeyAdjustmentType, buCode] });
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
            queryClient.invalidateQueries({ queryKey: [queryKeyAdjustmentType, buCode] });
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
          queryClient.invalidateQueries({ queryKey: [queryKeyAdjustmentType, buCode] });
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

  const typeLabel = form_type === ADJUSTMENT_TYPE.STOCK_IN ? "Stock In" : "Stock Out";

  // Calculate totals
  const watchedItems = form.watch("stock_in_detail");
  const totalQty = watchedItems?.reduce((sum, item) => sum + (item?.qty || 0), 0) || 0;
  const grandTotal =
    watchedItems?.reduce((sum, item) => sum + (item?.qty || 0) * (item?.cost_per_unit || 0), 0) ||
    0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">Completed</Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                  <Button size="sm" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </>
              )}
            </div>
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
                        <p className="font-medium">
                          <Badge
                            variant="outline"
                            className={cn(
                              form_type === ADJUSTMENT_TYPE.STOCK_IN
                                ? "border-green-500 text-green-600"
                                : "border-orange-500 text-orange-600"
                            )}
                          >
                            {typeLabel}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Status</span>
                        <p className="font-medium">{getStatusBadge(initValues?.doc_status || "")}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created At</span>
                        <p className="font-medium text-sm">
                          {initValues?.created_at
                            ? new Date(initValues.created_at).toLocaleDateString("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
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
                            <StockDetailRow
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
                            <TableCell className="text-right">{totalQty.toLocaleString()}</TableCell>
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

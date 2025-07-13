"use client";

import JsonViewer from "@/components/JsonViewer";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import {
  PrSchemaV2Dto,
  prSchemaV2,
  PurchaseRequestByIdDto,
} from "@/dtos/pr.dto";
import { usePrMutation, useUpdatePrMutation } from "@/hooks/usePr";
import { Link, useRouter } from "@/lib/navigation";
import {
  ArrowLeftRightIcon,
  CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Pencil,
  Printer,
  Save,
  Share,
  X,
  XCircleIcon,
  CalendarIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { convertPrStatus } from "@/utils/helper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// เพิ่ม type definition
interface PurchaseRequestDetailItem {
  id?: string;
  tempId?: string;
  location_id: string;
  location_name?: string;
  product_id: string;
  product_name?: string;
  vendor_id: string;
  vendor_name?: string;
  price_list_id: string;
  pricelist_detail_id?: string;
  description: string;
  requested_qty: number;
  requested_unit_id: string;
  requested_unit_name?: string;
  requested_unit_conversion_factor?: number;
  approved_qty: number;
  approved_unit_id: string;
  approved_unit_name?: string;
  approved_unit_conversion_factor?: number;
  approved_base_qty: number;
  requested_base_qty: number;
  inventory_unit_id?: string;
  currency_id: string;
  currency_name?: string;
  exchange_rate: number;
  exchange_rate_date: string;
  price: number;
  total_price: number;
  foc_qty: number;
  foc_unit_id: string;
  foc_unit_name?: string;
  tax_profile_id?: string;
  tax_profile_name?: string;
  tax_rate: number;
  tax_amount: number;
  is_tax_adjustment: boolean;
  discount_rate: number;
  discount_amount: number;
  is_discount_adjustment: boolean;
  delivery_date: string;
  delivery_point_id: string;
  delivery_point_name?: string;
  comment: string;
  isNew?: boolean;
  isModified?: boolean;
}

interface MainPrFormProps {
  readonly mode: formType;
  readonly initValues?: PurchaseRequestByIdDto;
}

export default function MainForm({ mode, initValues }: MainPrFormProps) {
  const router = useRouter();
  const { token, tenantId, user, departments } = useAuth();
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [openLog, setOpenLog] = useState(false);

  // State สำหรับจัดการ purchase request detail items
  const [prItems, setPrItems] = useState<PurchaseRequestDetailItem[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [tempEditData, setTempEditData] =
    useState<PurchaseRequestDetailItem | null>(null);

  // Convert initValues to our interface
  const convertToDetailItem = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: Record<string, any>,
    index: number
  ): PurchaseRequestDetailItem => ({
    id: item.id,
    tempId: `temp-${index}`,
    location_id: item.location_id || "",
    location_name: item.location_name || "",
    product_id: item.product_id || "",
    product_name: item.product_name || "",
    vendor_id: item.vendor_id || "",
    vendor_name: item.vendor_name || "",
    price_list_id: item.price_list_id || "",
    pricelist_detail_id: item.pricelist_detail_id || "",
    description: item.description || "",
    requested_qty: item.requested_qty || 0,
    requested_unit_id: item.requested_unit_id || "",
    requested_unit_name: item.requested_unit_name || "",
    requested_unit_conversion_factor:
      item.requested_unit_conversion_factor || 0,
    approved_qty: item.approved_qty || 0,
    approved_unit_id: item.approved_unit_id || "",
    approved_unit_name: item.approved_unit_name || "",
    approved_unit_conversion_factor: item.approved_unit_conversion_factor || 0,
    approved_base_qty: item.approved_base_qty || 0,
    requested_base_qty: item.requested_base_qty || 0,
    inventory_unit_id: item.inventory_unit_id || "",
    currency_id: item.currency_id || "",
    currency_name: item.currency_name || "",
    exchange_rate: item.exchange_rate || 1,
    exchange_rate_date: item.exchange_rate_date || new Date().toISOString(),
    price: item.price || 0,
    total_price: item.total_price || 0,
    foc_qty: item.foc_qty || 0,
    foc_unit_id: item.foc_unit_id || "",
    foc_unit_name: item.foc_unit_name || "",
    tax_profile_id: item.tax_profile_id || "",
    tax_profile_name: item.tax_profile_name || "",
    tax_rate: item.tax_rate || 0,
    tax_amount: item.tax_amount || 0,
    is_tax_adjustment: item.is_tax_adjustment || false,
    discount_rate: item.discount_rate || 0,
    discount_amount: item.discount_amount || 0,
    is_discount_adjustment: item.is_discount_adjustment || false,
    delivery_date: item.delivery_date || new Date().toISOString(),
    delivery_point_id: item.delivery_point_id || "",
    delivery_point_name: item.delivery_point_name || "",
    comment: item.comment || "",
    isNew: false,
    isModified: false,
  });

  // Initialize items จาก initValues
  useEffect(() => {
    if (initValues?.purchase_request_detail) {
      const items = initValues.purchase_request_detail.map((item, index) =>
        convertToDetailItem(item, index)
      ) as PurchaseRequestDetailItem[];
      setPrItems(items);
    }
  }, [initValues]);

  const defaultValues = {
    pr_no: initValues?.pr_no ?? "",
    pr_date: initValues?.pr_date ?? new Date().toISOString(),
    pr_status: initValues?.pr_status ?? "draft",
    requestor_id: user?.id ?? "",
    department_id: departments?.id ?? "",
    is_active: initValues?.is_active ?? true,
    doc_version: initValues?.doc_version
      ? parseFloat(initValues.doc_version.toString())
      : 1.0,
    note: initValues?.note ?? "",
    description: initValues?.description ?? "",
    workflow_id: initValues?.workflow_id ?? "",
    workflow_name: initValues?.workflow_name ?? "",
    workflow_history: initValues?.workflow_history || [],
    purchase_request_detail: {
      add: [],
      update: [],
      delete: [],
    },
  };

  const form = useForm<PrSchemaV2Dto>({
    resolver: zodResolver(prSchemaV2),
    defaultValues,
    mode: "onChange",
  });

  // Function สำหรับเตรียมข้อมูลก่อน submit
  const preparePurchaseRequestDetailData = () => {
    const addItems = prItems
      .filter((item) => item.isNew)
      .map((item) => ({
        location_id: item.location_id,
        product_id: item.product_id,
        vendor_id: item.vendor_id,
        price_list_id: item.price_list_id,
        pricelist_detail_id: item.pricelist_detail_id,
        description: item.description,
        requested_qty: item.requested_qty,
        requested_unit_id: item.requested_unit_id,
        requested_unit_name: item.requested_unit_name,
        requested_conversion_unit_factor: item.requested_unit_conversion_factor,
        approved_qty: item.approved_qty,
        approved_unit_id: item.approved_unit_id,
        approved_unit_name: item.approved_unit_name,
        approved_conversion_unit_factor: item.approved_unit_conversion_factor,
        approved_base_qty: item.approved_base_qty,
        requested_base_qty: item.requested_base_qty,
        inventory_unit_id: item.inventory_unit_id,
        currency_id: item.currency_id,
        currency_name: item.currency_name,
        exchange_rate: item.exchange_rate,
        exchange_rate_date: item.exchange_rate_date,
        price: item.price,
        total_price: item.total_price,
        foc: item.foc_qty,
        foc_unit_id: item.foc_unit_id,
        foc_unit_name: item.foc_unit_name,
        tax_type_inventory_id: item.tax_profile_id,
        tax_type: item.tax_profile_name || "include",
        tax_rate: item.tax_rate,
        tax_amount: item.tax_amount,
        is_tax_adjustment: item.is_tax_adjustment,
        is_discount: item.discount_rate > 0,
        discount_rate: item.discount_rate,
        discount_amount: item.discount_amount,
        is_discount_adjustment: item.is_discount_adjustment,
        is_active: true,
        delivery_date: item.delivery_date,
        delivery_point_id: item.delivery_point_id,
        note: item.comment,
      }));

    const updateItems = prItems
      .filter((item) => !item.isNew && item.isModified)
      .map((item) => ({
        id: item.id,
        location_id: item.location_id,
        product_id: item.product_id,
        vendor_id: item.vendor_id,
        price_list_id: item.price_list_id,
        pricelist_detail_id: item.pricelist_detail_id,
        description: item.description,
        requested_qty: item.requested_qty,
        requested_unit_id: item.requested_unit_id,
        requested_unit_name: item.requested_unit_name,
        requested_conversion_unit_factor: item.requested_unit_conversion_factor,
        approved_qty: item.approved_qty,
        approved_unit_id: item.approved_unit_id,
        approved_unit_name: item.approved_unit_name,
        approved_conversion_unit_factor: item.approved_unit_conversion_factor,
        approved_base_qty: item.approved_base_qty,
        requested_base_qty: item.requested_base_qty,
        inventory_unit_id: item.inventory_unit_id,
        currency_id: item.currency_id,
        currency_name: item.currency_name,
        exchange_rate: item.exchange_rate,
        exchange_rate_date: item.exchange_rate_date,
        price: item.price,
        total_price: item.total_price,
        foc: item.foc_qty,
        foc_unit_id: item.foc_unit_id,
        foc_unit_name: item.foc_unit_name,
        tax_type_inventory_id: item.tax_profile_id,
        tax_type: item.tax_profile_name || "include",
        tax_rate: item.tax_rate,
        tax_amount: item.tax_amount,
        is_tax_adjustment: item.is_tax_adjustment,
        is_discount: item.discount_rate > 0,
        discount_rate: item.discount_rate,
        discount_amount: item.discount_amount,
        is_discount_adjustment: item.is_discount_adjustment,
        is_active: true,
        delivery_date: item.delivery_date,
        delivery_point_id: item.delivery_point_id,
        note: item.comment,
      }));

    const deleteItems = deletedItemIds.map((id) => ({ id }));

    return {
      add: addItems,
      update: updateItems,
      delete: deleteItems,
    };
  };

  // อัปเดต form field เมื่อ prItems หรือ deletedItemIds เปลี่ยนแปลง
  useEffect(() => {
    const purchaseRequestDetailData = preparePurchaseRequestDetailData();
    form.setValue("purchase_request_detail", purchaseRequestDetailData);
  }, [prItems, deletedItemIds, form,]);

  // Function สำหรับเพิ่มรายการใหม่
  const handleAddNewItem = () => {
    const newItem: PurchaseRequestDetailItem = {
      id: undefined,
      tempId: `new-${Date.now()}`,
      location_id: "",
      location_name: "",
      product_id: "",
      product_name: "",
      vendor_id: "",
      vendor_name: "",
      price_list_id: "",
      pricelist_detail_id: "",
      description: "",
      requested_qty: 0,
      requested_unit_id: "",
      requested_unit_name: "",
      requested_unit_conversion_factor: 0,
      approved_qty: 0,
      approved_unit_id: "",
      approved_unit_name: "",
      approved_unit_conversion_factor: 0,
      approved_base_qty: 0,
      requested_base_qty: 0,
      inventory_unit_id: "",
      currency_id: "",
      currency_name: "",
      exchange_rate: 1,
      exchange_rate_date: new Date().toISOString(),
      price: 0,
      total_price: 0,
      foc_qty: 0,
      foc_unit_id: "",
      foc_unit_name: "",
      tax_profile_id: "",
      tax_profile_name: "",
      tax_rate: 0,
      tax_amount: 0,
      is_tax_adjustment: false,
      discount_rate: 0,
      discount_amount: 0,
      is_discount_adjustment: false,
      delivery_date: new Date().toISOString(),
      delivery_point_id: "",
      delivery_point_name: "",
      comment: "",
      isNew: true,
      isModified: false,
    };

    setPrItems((prev) => [...prev, newItem]);
    setEditingRowIndex(prItems.length);
    setTempEditData(newItem);
  };

  // Function สำหรับเริ่มการแก้ไขรายการ
  const handleStartEdit = (index: number) => {
    setEditingRowIndex(index);
    setTempEditData({ ...prItems[index] });
  };

  // Function สำหรับอัปเดตข้อมูลชั่วคราว
  const handleUpdateTempData = (
    field: keyof PurchaseRequestDetailItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    if (tempEditData) {
      const updatedData = { ...tempEditData, [field]: value };

      // คำนวณราคารวมถ้าเป็นการเปลี่ยน quantity หรือ price
      if (field === "requested_qty" || field === "price") {
        const qty =
          field === "requested_qty" ? value : tempEditData.requested_qty;
        const price = field === "price" ? value : tempEditData.price;
        updatedData.total_price = qty * price;
      }

      setTempEditData(updatedData);
    }
  };

  // Function สำหรับยืนยันการแก้ไข
  const handleConfirmEdit = () => {
    if (editingRowIndex !== null && tempEditData) {
      setPrItems((prev) =>
        prev.map((item, i) => {
          if (i === editingRowIndex) {
            const updatedItem = { ...tempEditData };
            // Mark เป็น modified ถ้าไม่ใช่รายการใหม่
            if (!item.isNew) {
              updatedItem.isModified = true;
            }
            return updatedItem;
          }
          return item;
        })
      );
      setEditingRowIndex(null);
      setTempEditData(null);
    }
  };

  // Function สำหรับยกเลิกการแก้ไข
  const handleCancelEdit = () => {
    if (editingRowIndex !== null && tempEditData?.isNew) {
      // ถ้าเป็นรายการใหม่ที่ยังไม่ได้ confirm ให้ลบออก
      setPrItems((prev) => prev.filter((_, i) => i !== editingRowIndex));
    }
    setEditingRowIndex(null);
    setTempEditData(null);
  };

  // Function สำหรับลบรายการ
  const handleDeleteItem = (index: number) => {
    const item = prItems[index];

    // ถ้าเป็นรายการที่มี id (คือรายการเก่า) ให้เก็บ id ไว้ใน deletedItemIds
    if (item.id) {
      setDeletedItemIds((prev) => [...prev, item.id as string]);
    }

    // ลบรายการออกจาก prItems
    setPrItems((prev) => prev.filter((_, i) => i !== index));

    // ถ้ากำลังแก้ไขรายการที่ลบ ให้ reset editing state
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
      setTempEditData(null);
    }
  };

  // ใช้ useFieldArray สำหรับจัดการ purchase request detail items
  // const { fields, append, remove, update } = useFieldArray({
  //   control: form.control,
  //   name: "purchase_request_detail",
  // });

  const { mutate: createPr, isPending: isCreatePending } = usePrMutation(
    token,
    tenantId,
    {
      onSuccess: (response: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response as any;
        if (responseData?.data?.id) {
          toastSuccess({ message: "Purchase Request created successfully" });
          router.push(`/procurement/purchase-request/${responseData.data.id}`);
        }
        setCurrentMode(formType.VIEW);
      },
      onError: () => {
        toastError({ message: "Error creating Purchase Request" });
      },
    }
  );

  const { mutate: updatePr, isPending: isUpdatePending } = useUpdatePrMutation(
    token,
    tenantId,
    {
      onSuccess: (response: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response as any;
        if (responseData) {
          toastSuccess({ message: "Purchase Request updated successfully" });
        }
        setCurrentMode(formType.VIEW);
      },
      onError: () => {
        toastError({ message: "Error updating Purchase Request" });
      },
    }
  );

  // อัปเดต onSubmit function
  const onSubmit = async (data: PrSchemaV2Dto) => {
    try {
      const purchaseRequestDetailData = preparePurchaseRequestDetailData();

      const submitData = {
        ...data,
        purchase_request_detail: purchaseRequestDetailData,
      };

      console.log("Submit data:", submitData);

      if (currentMode === formType.ADD) {
        createPr(submitData);
      } else if (currentMode === formType.EDIT && initValues?.id) {
        updatePr({ id: initValues.id, data: submitData });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toastError({ message: "Error in form submission" });
    }
  };

  const isReadOnly = currentMode === formType.VIEW;

  return (
    <div className="relative">
      <div className="flex gap-4 relative">
        <ScrollArea
          className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
        >
          <Card className="p-4 mb-2">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Link href="/procurement/purchase-request">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>

                    <div className="flex items-start gap-2">
                      {mode === formType.ADD ? (
                        <p className="text-base font-bold">Purchase Request</p>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-bold">
                            {initValues?.pr_no}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created on{" "}
                            {initValues?.created_at
                              ? format(
                                  new Date(initValues?.created_at ?? ""),
                                  "dd MMM yyyy"
                                )
                              : ""}
                          </p>
                        </div>
                      )}
                      {initValues?.pr_status && (
                        <Badge variant={initValues?.pr_status}>
                          {convertPrStatus(initValues?.pr_status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentMode === formType.VIEW ? (
                      <>
                        <Button
                          variant="outline"
                          size={"sm"}
                          className="px-2 text-xs"
                          onClick={() =>
                            router.push("/procurement/purchase-request")
                          }
                        >
                          <ChevronLeft /> Back
                        </Button>
                        <Button
                          variant="default"
                          size={"sm"}
                          className="px-2 text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentMode(formType.EDIT);
                          }}
                        >
                          <Pencil /> Edit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size={"sm"}
                          className="px-2 text-xs"
                          onClick={() =>
                            currentMode === formType.ADD
                              ? router.push("/procurement/purchase-request")
                              : setCurrentMode(formType.VIEW)
                          }
                        >
                          <X /> Cancel
                        </Button>
                        <Button
                          variant="default"
                          size={"sm"}
                          className="px-2 text-xs"
                          type="submit"
                          disabled={isCreatePending || isUpdatePending}
                        >
                          <Save />
                          {isCreatePending || isUpdatePending
                            ? "Saving..."
                            : "Save"}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size={"sm"}
                      className="px-2 text-xs"
                    >
                      <Printer />
                      Print
                    </Button>

                    <Button
                      variant="outline"
                      size={"sm"}
                      className="px-2 text-xs"
                    >
                      <FileDown />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size={"sm"}
                      className="px-2 text-xs"
                    >
                      <Share />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Purchase Request Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* PR Number */}
                  <FormField
                    control={form.control}
                    name="pr_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หมายเลข PR</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="PR-XXXX"
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PR Date */}
                  <FormField
                    control={form.control}
                    name="pr_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>วันที่ PR</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isReadOnly}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "dd/MM/yyyy")
                                ) : (
                                  <span>เลือกวันที่</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(date?.toISOString());
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PR Status */}
                  <FormField
                    control={form.control}
                    name="pr_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>สถานะ PR</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isReadOnly}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกสถานะ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Requestor ID */}
                  <FormField
                    control={form.control}
                    name="requestor_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ผู้ขอ</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ID ผู้ขอ"
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Department ID */}
                  <FormField
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>แผนก</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ID แผนก"
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Workflow ID */}
                  <FormField
                    control={form.control}
                    name="workflow_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workflow</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ID Workflow"
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Workflow Name */}
                  <FormField
                    control={form.control}
                    name="workflow_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ Workflow</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ชื่อ Workflow"
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Document Version */}
                  <FormField
                    control={form.control}
                    name="doc_version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เวอร์ชันเอกสาร</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            placeholder="1.0"
                            disabled={isReadOnly}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Is Active */}
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            เปิดใช้งาน
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รายละเอียด</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="รายละเอียดของ Purchase Request"
                          disabled={isReadOnly}
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
                      <FormLabel>หมายเหตุ *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="หมายเหตุ"
                          disabled={isReadOnly}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Request Detail Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">รายการสินค้า</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isReadOnly}
                      onClick={handleAddNewItem}
                    >
                      เพิ่มรายการ
                    </Button>
                  </div>

                  {prItems.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">สถานที่</TableHead>
                            <TableHead className="w-[200px]">สินค้า</TableHead>
                            <TableHead className="w-[150px]">ผู้ขาย</TableHead>
                            <TableHead className="w-[100px]">จำนวน</TableHead>
                            <TableHead className="w-[100px]">หน่วย</TableHead>
                            <TableHead className="w-[100px]">ราคา</TableHead>
                            <TableHead className="w-[100px]">รวม</TableHead>
                            <TableHead className="w-[200px]">
                              รายละเอียด
                            </TableHead>
                            <TableHead className="w-[120px]">จัดการ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prItems.map((item, index) => (
                            <TableRow
                              key={item.id || item.tempId || index}
                              className={
                                editingRowIndex === index ? "bg-blue-50" : ""
                              }
                            >
                              {editingRowIndex === index ? (
                                // Edit Mode
                                <>
                                  {/* Location */}
                                  <TableCell>
                                    <Input
                                      value={tempEditData?.location_name || ""}
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "location_name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="สถานที่"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Product */}
                                  <TableCell>
                                    <Input
                                      value={tempEditData?.product_name || ""}
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "product_name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="สินค้า"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Vendor */}
                                  <TableCell>
                                    <Input
                                      value={tempEditData?.vendor_name || ""}
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "vendor_name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="ผู้ขาย"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Quantity */}
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={
                                        tempEditData?.requested_qty.toString() ||
                                        "0"
                                      }
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "requested_qty",
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      placeholder="จำนวน"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Unit */}
                                  <TableCell>
                                    <Input
                                      value={
                                        tempEditData?.requested_unit_name || ""
                                      }
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "requested_unit_name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="หน่วย"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Price */}
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={
                                        tempEditData?.price.toString() || "0"
                                      }
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "price",
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      placeholder="ราคา"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Total Price */}
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={
                                        tempEditData?.total_price.toString() ||
                                        "0"
                                      }
                                      readOnly
                                      placeholder="รวม"
                                      className="text-sm h-8 bg-gray-100 border-gray-300"
                                    />
                                  </TableCell>

                                  {/* Description */}
                                  <TableCell>
                                    <Input
                                      value={tempEditData?.description || ""}
                                      onChange={(e) =>
                                        handleUpdateTempData(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      placeholder="รายละเอียด"
                                      className="text-sm h-8 border-blue-300 focus:border-blue-500"
                                    />
                                  </TableCell>

                                  {/* Actions - Edit Mode */}
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={handleConfirmEdit}
                                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                        title="ยืนยัน"
                                      >
                                        <CheckCircleIcon className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelEdit}
                                        className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                                        title="ยกเลิก"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </>
                              ) : (
                                // View Mode
                                <>
                                  {/* Location */}
                                  <TableCell>
                                    <div className="text-sm">
                                      {item.location_name || "-"}
                                    </div>
                                  </TableCell>

                                  {/* Product */}
                                  <TableCell>
                                    <div className="text-sm">
                                      {item.product_name || "-"}
                                    </div>
                                  </TableCell>

                                  {/* Vendor */}
                                  <TableCell>
                                    <div className="text-sm">
                                      {item.vendor_name || "-"}
                                    </div>
                                  </TableCell>

                                  {/* Quantity */}
                                  <TableCell>
                                    <div className="text-sm text-right">
                                      {item.requested_qty}
                                    </div>
                                  </TableCell>

                                  {/* Unit */}
                                  <TableCell>
                                    <div className="text-sm">
                                      {item.requested_unit_name || "-"}
                                    </div>
                                  </TableCell>

                                  {/* Price */}
                                  <TableCell>
                                    <div className="text-sm text-right">
                                      {item.price.toLocaleString()}
                                    </div>
                                  </TableCell>

                                  {/* Total Price */}
                                  <TableCell>
                                    <div className="text-sm text-right font-medium">
                                      {item.total_price.toLocaleString()}
                                    </div>
                                  </TableCell>

                                  {/* Description */}
                                  <TableCell>
                                    <div className="text-sm">
                                      {item.description || "-"}
                                    </div>
                                  </TableCell>

                                  {/* Actions - View Mode */}
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={isReadOnly}
                                        onClick={() => handleStartEdit(index)}
                                        className="h-8 w-8 p-0 border-blue-300 text-blue-600 hover:bg-blue-50"
                                        title="แก้ไข"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isReadOnly}
                                            className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                                            title="ลบ"
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              ยืนยันการลบ
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              คุณต้องการลบรายการนี้หรือไม่?
                                              การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              ยกเลิก
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleDeleteItem(index)
                                              }
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              ลบ
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ไม่มีรายการสินค้า
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </Card>

          <div className="grid grid-cols-2 gap-2">
            <JsonViewer data={initValues || {}} />
            <JsonViewer data={form.watch()} />
          </div>
          {/* <JsonViewer data={diffData} /> */}

          <div
            className={`fixed bottom-6 ${openLog ? "right-1/4" : "right-6"} flex gap-2 z-50 bg-background border shadow-lg p-2 rounded-lg`}
          >
            <Button size={"sm"} className="h-7 px-2 text-xs">
              <CheckCircleIcon className="w-4 h-4" />
              Approve
            </Button>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="h-7 px-2 text-xs"
            >
              <XCircleIcon className="w-4 h-4" />
              Reject
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              className="h-7 px-2 text-xs"
            >
              <ArrowLeftRightIcon className="w-4 h-4" />
              Send Back
            </Button>
          </div>
        </ScrollArea>
        {openLog && (
          <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
            <div className="flex flex-col gap-4">hello</div>
          </div>
        )}
      </div>
      <Button
        aria-label={openLog ? "Close log panel" : "Open log panel"}
        onClick={() => setOpenLog(!openLog)}
        variant="default"
        size="sm"
        className="fixed right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-l-full rounded-r-none z-50 shadow-lg"
      >
        {openLog ? (
          <ChevronRight className="h-6 w-6" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}

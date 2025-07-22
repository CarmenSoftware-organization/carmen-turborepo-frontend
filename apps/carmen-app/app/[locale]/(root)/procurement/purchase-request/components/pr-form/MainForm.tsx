"use client";

import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import {
  PurchaseRequestByIdDto,
  PurchaseRequestCreateFormDto,
  PurchaseRequestUpdateFormDto,
  PurchaseRequestDetail,
  CreatePurchaseRequestSchema,
  UpdatePurchaseRequestSchema,
} from "@/dtos/purchase-request.dto";
import { usePrMutation, useUpdatePrMutation } from "@/hooks/usePr";
import { useRouter } from "@/lib/navigation";
import {
  ArrowLeftRightIcon,
  CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
  XCircleIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
} from "@/components/ui/form";
import HeadForm from "./HeadForm";
import ActionFields from "./ActionFields";
import TableItems from "./TableItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetPr from "./BudgetPr";
import WorkflowPr from "./WorkflowPr";
import TransactionSummaryPurchaseRequest from "./TransactionSummaryPurchaseRequest";

interface MainPrFormProps {
  readonly mode: formType;
  readonly initValues?: PurchaseRequestByIdDto;
}

export default function MainForm({ mode, initValues }: MainPrFormProps) {
  const router = useRouter();
  const { token, tenantId, user, departments } = useAuth();
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [openLog, setOpenLog] = useState(false);

  // State สำหรับจัดการ purchase request detail items - ใช้ PurchaseRequestDetail แทน
  const [prItems, setPrItems] = useState<PurchaseRequestDetail[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);
  // เพิ่ม UI state สำหรับจัดการ isNew และ isModified
  const [itemUIState, setItemUIState] = useState<Record<string, { isNew: boolean; isModified: boolean }>>({});

  // Helper functions สำหรับจัดการ UI state
  const markItemAsNew = (itemId: string) => {
    setItemUIState(prev => ({ ...prev, [itemId]: { isNew: true, isModified: false } }));
  };

  const markItemAsModified = (itemId: string) => {
    setItemUIState(prev => ({ ...prev, [itemId]: { ...prev[itemId], isModified: true } }));
  };

  const isItemNew = (itemId: string) => itemUIState[itemId]?.isNew || false;
  const isItemModified = (itemId: string) => itemUIState[itemId]?.isModified || false;

  // Convert initValues to PurchaseRequestDetail interface
  const convertToDetailItem = (
    item: any,
    index: number
  ): PurchaseRequestDetail => ({
    id: item.id || `temp-${index}`,
    purchase_request_id: item.purchase_request_id || initValues?.id || "",

    // Product Info
    product_id: item.product_id || "",
    product_name: item.product_name || "",
    product_local_name: item.product_local_name || null,

    // Location Info
    location_id: item.location_id || "",
    location_name: item.location_name || "",
    delivery_point_id: item.delivery_point_id || "",
    delivery_point_name: item.delivery_point_name || "",
    delivery_date: item.delivery_date || new Date().toISOString(),

    // Unit Info
    inventory_unit_id: item.inventory_unit_id || "",
    inventory_unit_name: item.inventory_unit_name || "",

    // Vendor Info
    vendor_id: item.vendor_id || "",
    vendor_name: item.vendor_name || "",

    // PriceList Info
    pricelist_detail_id: item.pricelist_detail_id || null,
    pricelist_no: item.pricelist_no || null,
    pricelist_unit: item.pricelist_unit || "",
    pricelist_price: item.pricelist_price || "",

    // Currency Info
    currency_id: item.currency_id || "",
    currency_name: item.currency_name || "",
    exchange_rate: item.exchange_rate || 1,
    exchange_rate_date: item.exchange_rate_date || new Date().toISOString(),

    // Quantity Info
    requested_qty: item.requested_qty || 0,
    requested_unit_id: item.requested_unit_id || "",
    requested_unit_name: item.requested_unit_name || "",
    requested_unit_conversion_factor: item.requested_unit_conversion_factor || 1,
    requested_base_qty: item.requested_base_qty || 0,

    // Approved Quantity Info
    approved_qty: item.approved_qty || 0,
    approved_unit_id: item.approved_unit_id || "",
    approved_unit_name: item.approved_unit_name || "",
    approved_unit_conversion_factor: item.approved_unit_conversion_factor || 1,
    approved_base_qty: item.approved_base_qty || 0,

    // FOC Quantity Info
    foc_qty: item.foc_qty || 0,
    foc_unit_id: item.foc_unit_id || "",
    foc_unit_name: item.foc_unit_name || "",
    foc_unit_conversion_factor: item.foc_unit_conversion_factor || 1,
    foc_base_qty: item.foc_base_qty || 0,

    // Tax Info
    tax_profile_id: item.tax_profile_id || null,
    tax_profile_name: item.tax_profile_name || null,
    tax_rate: item.tax_rate || 0,
    tax_amount: item.tax_amount || 0,
    base_tax_amount: item.base_tax_amount || 0,
    is_tax_adjustment: item.is_tax_adjustment || false,

    // Discount Info
    discount_rate: item.discount_rate || 0,
    discount_amount: item.discount_amount || 0,
    base_discount_amount: item.base_discount_amount || 0,
    is_discount_adjustment: item.is_discount_adjustment || false,

    // Price Calculation
    sub_total_price: item.sub_total_price || null,
    net_amount: item.net_amount || 0,
    total_price: item.total_price || 0,
    base_price: item.base_price || null,
    base_sub_total_price: item.base_sub_total_price || null,
    base_net_amount: item.base_net_amount || 0,
    base_total_price: item.base_total_price || 0,

    // Detail Common Info
    sequence_no: item.sequence_no || index + 1,
    description: item.description || "",
    comment: item.comment || null,
    history: item.history,
    stages_status: item.stages_status,
    info: item.info,
    dimension: item.dimension,

    // Audit Info
    doc_version: item.doc_version || "1.0",
    created_at: item.created_at || new Date().toISOString(),
    created_by_id: item.created_by_id || user?.id || "",
    updated_at: item.updated_at || new Date().toISOString(),
    updated_by_id: item.updated_by_id,
    deleted_at: item.deleted_at,
    deleted_by_id: item.deleted_by_id,
  });

  // Initialize items จาก initValues
  useEffect(() => {
    if (initValues?.purchase_request_detail) {
      const items = initValues.purchase_request_detail.map((item, index) =>
        convertToDetailItem(item, index)
      );
      setPrItems(items);

      // Initialize UI state สำหรับ existing items
      const uiState: Record<string, { isNew: boolean; isModified: boolean }> = {};
      items.forEach(item => {
        uiState[item.id] = { isNew: false, isModified: false };
      });
      setItemUIState(uiState);
    }
  }, [initValues]);

  const defaultValues: PurchaseRequestCreateFormDto = {
    pr_date: new Date(initValues?.pr_date || new Date().toISOString()),
    requestor_id: user?.id,
    department_id: departments?.id,
    workflow_id: initValues?.workflow_id,
    description: initValues?.description || null,
    note: initValues?.note || null,
    info: initValues?.info,
    dimension: initValues?.dimension,
    purchase_request_detail: {
      add: [],
    },
  };

  const form = useForm<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>({
    resolver: zodResolver(currentMode === formType.ADD ? CreatePurchaseRequestSchema : UpdatePurchaseRequestSchema),
    defaultValues,
    mode: "onChange",
  });

  // Function สำหรับเตรียมข้อมูลก่อน submit - แก้ไขให้ตรงกับ schema
  const preparePurchaseRequestDetailData = () => {
    const addItems = prItems
      .filter((item) => isItemNew(item.id))
      .map((item) => ({
        product_id: item.product_id,
        location_id: item.location_id,
        inventory_unit_id: item.inventory_unit_id,
        delivery_point_id: item.delivery_point_id,
        delivery_date: new Date(item.delivery_date),
        vendor_id: item.vendor_id,
        requested_qty: item.requested_qty,
        requested_unit_id: item.requested_unit_id,
        requested_unit_conversion_factor: item.requested_unit_conversion_factor,
        currency_id: item.currency_id,
        exchange_rate: item.exchange_rate,
        exchange_rate_date: new Date(item.exchange_rate_date),
        description: item.description,
        comment: item.comment,
        sequence_no: item.sequence_no,
        // Price fields - แก้ไข null to undefined
        price: item.total_price,
        total_price: item.total_price,
        sub_total_price: item.sub_total_price || undefined,
        net_amount: item.net_amount,
        base_price: item.base_price || undefined,
        base_sub_total_price: item.base_sub_total_price || undefined,
        base_net_amount: item.base_net_amount,
        base_total_price: item.base_total_price,
        // Tax fields
        tax_profile_id: item.tax_profile_id || undefined,
        tax_profile_name: item.tax_profile_name || undefined,
        tax_rate: item.tax_rate,
        tax_amount: item.tax_amount,
        is_tax_adjustment: item.is_tax_adjustment,
        base_tax_amount: item.base_tax_amount,
        total_amount: item.tax_amount,
        // Discount fields
        discount_rate: item.discount_rate,
        discount_amount: item.discount_amount,
        is_discount_adjustment: item.is_discount_adjustment,
        base_discount_amount: item.base_discount_amount,
        // FOC fields
        foc_qty: item.foc_qty,
        foc_unit_id: item.foc_unit_id || undefined,
        foc_unit_conversion_rate: item.foc_unit_conversion_factor,
        note: item.comment || undefined,
        info: item.info,
        dimension: item.dimension,
      }));

    const updateItems = prItems
      .filter((item) => !isItemNew(item.id) && isItemModified(item.id))
      .map((item) => ({
        id: item.id,
        product_id: item.product_id,
        location_id: item.location_id,
        inventory_unit_id: item.inventory_unit_id,
        delivery_point_id: item.delivery_point_id,
        delivery_date: new Date(item.delivery_date),
        vendor_id: item.vendor_id,
        requested_qty: item.requested_qty,
        requested_unit_id: item.requested_unit_id,
        requested_unit_conversion_factor: item.requested_unit_conversion_factor,
        approved_qty: item.approved_qty,
        approved_unit_id: item.approved_unit_id || undefined,
        approved_base_qty: item.approved_base_qty,
        approved_unit_conversion_factor: item.approved_unit_conversion_factor,
        foc_qty: item.foc_qty,
        foc_unit_id: item.foc_unit_id || undefined,
        foc_unit_conversion_rate: item.foc_unit_conversion_factor,
        currency_id: item.currency_id,
        exchange_rate: item.exchange_rate,
        exchange_rate_date: new Date(item.exchange_rate_date),
        description: item.description,
        comment: item.comment,
        sequence_no: item.sequence_no,
        // Price fields
        price: item.total_price,
        total_price: item.total_price,
        sub_total_price: item.sub_total_price || undefined,
        net_amount: item.net_amount,
        base_price: item.base_price || undefined,
        base_sub_total_price: item.base_sub_total_price || undefined,
        base_net_amount: item.base_net_amount,
        base_total_price: item.base_total_price,
        // Tax fields
        tax_profile_id: item.tax_profile_id || undefined,
        tax_profile_name: item.tax_profile_name || undefined,
        tax_rate: item.tax_rate,
        tax_amount: item.tax_amount,
        is_tax_adjustment: item.is_tax_adjustment,
        base_tax_amount: item.base_tax_amount,
        total_amount: item.tax_amount,
        // Discount fields
        discount_rate: item.discount_rate,
        discount_amount: item.discount_amount,
        is_discount_adjustment: item.is_discount_adjustment,
        base_discount_amount: item.base_discount_amount,
        note: item.comment || undefined,
        info: item.info,
        dimension: item.dimension,
      }));

    const removeItems = deletedItemIds.map((id) => ({ id }));

    if (currentMode === formType.ADD) {
      return { add: addItems };
    } else {
      return {
        add: addItems,
        update: updateItems,
        remove: removeItems,
      };
    }
  };

  // อัปเดต form field เมื่อ prItems หรือ deletedItemIds เปลี่ยนแปลง
  useEffect(() => {
    const purchaseRequestDetailData = preparePurchaseRequestDetailData();
    form.setValue("purchase_request_detail", purchaseRequestDetailData);
  }, [prItems, deletedItemIds, itemUIState, currentMode, form]);

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
  const onSubmit = async (data: PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto) => {
    try {
      const purchaseRequestDetailData = preparePurchaseRequestDetailData();

      const submitData = {
        ...data,
        purchase_request_detail: purchaseRequestDetailData,
      };

      console.log("Submit data:", submitData);

      if (currentMode === formType.ADD) {
        createPr(submitData as PurchaseRequestCreateFormDto);
      } else if (currentMode === formType.EDIT && initValues?.id) {
        updatePr({ id: initValues.id, data: submitData as PurchaseRequestUpdateFormDto });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toastError({ message: "Error in form submission" });
    }
  };

  const isReadOnly = currentMode === formType.VIEW;

  const statusInfo = {
    create_date: initValues?.created_at,
    status: initValues?.pr_status,
    workflow_status: initValues?.workflow_name,
  };

  // Adapter function to convert PurchaseRequestDetail to TableItems interface
  const convertToTableItemFormat = () => {
    return prItems.map(item => ({
      ...item,
      // Map missing fields for backward compatibility
      price_list_id: item.pricelist_no || "",
      price: item.total_price,
      isNew: isItemNew(item.id),
      isModified: isItemModified(item.id),
      tempId: item.id,
    }));
  };

  // Handle items change from TableItems component
  const handleItemsChange = (updatedItems: any[]) => {
    const convertedItems = updatedItems.map(item => {
      // Find existing item or create new one
      const existingItem = prItems.find(p => p.id === item.id || p.id === item.tempId);

      if (existingItem) {
        return {
          ...existingItem,
          ...item,
          total_price: item.price || item.total_price,
        };
      } else {
        // New item
        return convertToDetailItem(item, prItems.length);
      }
    });

    setPrItems(convertedItems);

    // Update UI state
    updatedItems.forEach(item => {
      if (item.isNew) {
        markItemAsNew(item.id || item.tempId);
      } else if (item.isModified) {
        markItemAsModified(item.id || item.tempId);
      }
    });
  };

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
                <ActionFields
                  mode={mode}
                  currentMode={currentMode}
                  initValues={initValues}
                  isCreatePending={isCreatePending}
                  isUpdatePending={isUpdatePending}
                  onModeChange={setCurrentMode}
                />

                <HeadForm form={form as any} isReadOnly={isReadOnly} statusInfo={statusInfo} />

                <Tabs defaultValue="items">
                  <TabsList className="w-full h-8">
                    <TabsTrigger className="w-full text-xs" value="items">
                      Items
                    </TabsTrigger>
                    <TabsTrigger className="w-full text-xs" value="budget">
                      Budget
                    </TabsTrigger>
                    <TabsTrigger className="w-full text-xs" value="workflow">
                      Workflow
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="items" className="mt-2">
                    <TableItems
                      prItems={convertToTableItemFormat() as any}
                      isReadOnly={isReadOnly}
                      onItemsChange={handleItemsChange}
                      onDeletedIdsChange={setDeletedItemIds}
                      mode={currentMode}
                    />
                  </TabsContent>
                  <TabsContent value="budget" className="mt-2">
                    <BudgetPr mode={currentMode} />
                  </TabsContent>
                  <TabsContent value="workflow" className="mt-2">
                    <WorkflowPr workflowData={initValues?.workflow_history} />
                  </TabsContent>
                </Tabs>

              </form>
            </Form>
          </Card>

          <TransactionSummaryPurchaseRequest />

          {/* <div className="grid grid-cols-2 gap-2">
            <JsonViewer data={initValues || {}} />
            <JsonViewer data={form.watch()} />
          </div> */}
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
            <p className="flex flex-col gap-4">hello</p>
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

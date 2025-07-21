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
  PurchaseRequestDetailItem,
} from "@/dtos/pr.dto";
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

  // State สำหรับจัดการ purchase request detail items
  const [prItems, setPrItems] = useState<PurchaseRequestDetailItem[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);

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

  const statusInfo = {
    create_date: initValues?.created_at,
    status: initValues?.pr_status,
    workflow_status: initValues?.workflow_name,
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

                <HeadForm form={form} isReadOnly={isReadOnly} statusInfo={statusInfo} />

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
                      prItems={prItems}
                      isReadOnly={isReadOnly}
                      onItemsChange={setPrItems}
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

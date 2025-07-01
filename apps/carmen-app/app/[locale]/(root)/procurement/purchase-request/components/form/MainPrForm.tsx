"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import {
  PrSchemaV2Dto,
  prSchemaV2,
  PurchaseRequestByIdDto,
  PurchaseRequestDetailItemDto,
} from "@/dtos/pr.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleIcon,
  ArrowLeftRightIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Save,
  X,
  XCircleIcon,
  Printer,
  FileDown,
  Share,
} from "lucide-react";
import { useState, useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import HeadPrForm from "./HeadPrForm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemPr from "./ItemPr";
import WorkflowPr from "./WorkflowPr";
import ItemPrDialog from "./ItemPrDialog";
import { useAuth } from "@/context/AuthContext";
import { usePrMutation, useUpdatePrMutation } from "@/hooks/usePr";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import BudgetPr from "./BudgetPr";
import ActivityLog from "../../../goods-received-note/components/ActivityLog";
import CommentGrn from "../../../goods-received-note/components/CommentGrn";
import { format } from "date-fns";
import JsonViewer from "@/components/JsonViewer";
import { checkDiff } from "@/constants/check-diff";

const mockData = {
  pr_no: "",
  pr_date: "2025-06-25T17:00:00.000Z",
  pr_status: "draft",
  requestor_id: "1bfdb891-58ee-499c-8115-34a964de8122",
  department_id: "11be5acd-e53f-4f2c-9361-8daf0306ed75",
  is_active: true,
  doc_version: 1,
  note: "",
  description: "daew",
  workflow_id: "f224d743-7cfa-46f6-8f72-85b14c6a355e",
  workflow_name: "",
  workflow_history: [],
  purchase_request_detail: {
    add: [
      {
        location_id: "213f41eb-6916-4275-ac53-afe6b7880dd2",
        product_id: "7fb2a1cd-7fd3-486b-b8e9-d2d461535b7f",
        vendor_id: "2375bcba-81bf-4236-a35c-2798acbd321f",
        price_list_id: "",
        description: "dad",
        requested_qty: 2,
        requested_unit_id: "0730ff57-fcf2-4df4-a044-986dbac67934",
        approved_qty: 3,
        approved_unit_id: "0730ff57-fcf2-4df4-a044-986dbac67934",
        approved_base_qty: 0,
        approved_conversion_unit_factor: 0,
        requested_conversion_unit_factor: 0,
        requested_base_qty: 0,
        currency_id: "0540e6ca-8a08-47ef-b104-522834d5026f",
        exchange_rate: 1,
        exchange_rate_date: "2025-06-26T08:44:56.293Z",
        price: 3,
        total_price: 6,
        foc: 2,
        foc_unit_id: "0730ff57-fcf2-4df4-a044-986dbac67934",
        tax_type: "none",
        tax_rate: 0,
        tax_amount: 0,
        is_tax_adjustment: true,
        is_discount: true,
        discount_rate: 0,
        discount_amount: 0,
        is_discount_adjustment: false,
        is_active: true,
        note: "",
        delivery_date: "2025-06-26T08:44:56.293Z",
        delivery_point_id: "086fc8ef-cb01-4a7f-b421-0ec2bdfb10bf",
        inventory_unit_id: "0730ff57-fcf2-4df4-a044-986dbac67934",
        pricelist_detail_id: "69e5eafe-e30a-4633-aed6-124c005ad665",
        tax_type_inventory_id: "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
      },
    ],
    update: [],
    delete: [],
  },
};

type ItemWithId = PurchaseRequestDetailItemDto & { id: string };

// Actions for the items reducer
type ItemAction =
  | { type: "INITIALIZE_ITEMS"; payload: ItemWithId[] }
  | { type: "ADD_ITEM"; payload: Omit<PurchaseRequestDetailItemDto, "id"> }
  | {
      type: "UPDATE_ITEM";
      payload: { id: string; data: Partial<PurchaseRequestDetailItemDto> };
    }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "CLEAR_ITEMS" };

// Reducer for managing items
const itemsReducer = (
  state: ItemWithId[],
  action: ItemAction
): ItemWithId[] => {
  switch (action.type) {
    case "INITIALIZE_ITEMS":
      return action.payload;
    case "ADD_ITEM":
      return [...state, { ...action.payload, id: uuidv4() } as ItemWithId];
    case "UPDATE_ITEM":
      return state.map((item) =>
        item.id === action.payload.id
          ? ({ ...item, ...action.payload.data } as ItemWithId)
          : item
      );
    case "DELETE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "CLEAR_ITEMS":
      return [];
    default:
      return state;
  }
};

interface MainPrFormProps {
  readonly mode: formType;
  readonly initValues?: PurchaseRequestByIdDto;
  readonly docType?: string;
}

export default function MainPrForm({ mode, initValues }: MainPrFormProps) {
  const router = useRouter();
  const { token, tenantId, user, departments } = useAuth();
  const [openLog, setOpenLog] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [openDialogItemPr, setOpenDialogItemPr] = useState<boolean>(false);
  const [currentItemData, setCurrentItemData] = useState<
    ItemWithId | undefined
  >(undefined);
  const [currentItems, dispatchItems] = useReducer(itemsReducer, []);

  const {
    mutate: createPr,
    isPending: isCreatePending,
    isError: isCreateError,
  } = usePrMutation(token, tenantId, {
    onSuccess: (response: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response as any;
      if (responseData?.data?.id) {
        router.push(`/procurement/purchase-request/${responseData.data.id}`);
      } else {
        setCurrentMode(formType.VIEW);
      }
    },
  });
  
  const {
    mutate: updatePr,
    isSuccess: isUpdateSuccess,
    isPending: isUpdatePending,
    isError: isUpdateError,
  } = useUpdatePrMutation(token, tenantId);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Initialize current items when initValues changes
  useEffect(() => {
    if (initValues?.purchase_request_detail) {
      const itemsWithIds = initValues.purchase_request_detail.map((item) => ({
        ...item,
        id: item.id || uuidv4(),
      })) as unknown as ItemWithId[];
      dispatchItems({ type: "INITIALIZE_ITEMS", payload: itemsWithIds });
    } else {
      dispatchItems({ type: "CLEAR_ITEMS" });
    }
  }, [initValues?.purchase_request_detail]);

  // Clear currentItemData when dialog closes
  useEffect(() => {
    if (!openDialogItemPr) {
      setCurrentItemData(undefined);
    }
  }, [openDialogItemPr]);

  // Add useEffect to calculate total amount when items change
  useEffect(() => {
    const total = currentItems.reduce(
      (sum, item) => sum + (item.total_price || 0),
      0
    );
    setTotalAmount(total);
  }, [currentItems]);

  const defaultValues = {
    pr_no: initValues?.pr_no ?? "",
    pr_date: initValues?.pr_date ?? new Date().toISOString(),
    pr_status: initValues?.pr_status ?? "draft",
    requestor_id: user?.id,
    department_id: departments?.id,
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

  const watchForm = form.watch();

  const diffData = checkDiff(mockData, watchForm);

  // Debug form state
  useEffect(() => {
    const { isDirty, errors, isValid } = form.formState;
    console.log("Form Debug:", {
      isDirty,
      isValid,
      errors,
      hasErrors: Object.keys(errors).length > 0,
      errorFields: Object.keys(errors),
    });
  }, [form.formState]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setCurrentMode(formType.VIEW);
      toastSuccess({ message: "Purchase Request updated successfully" });
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isCreateError) {
      toastError({ message: "Error creating Purchase Request" });
    }
  }, [isCreateError]);

  useEffect(() => {
    if (isUpdateError) {
      toastError({ message: "Error updating Purchase Request" });
    }
  }, [isUpdateError]);

  const onSubmit = async (data: PrSchemaV2Dto) => {
    console.log("data", data);
    try {
      if (currentMode === formType.ADD) {
        createPr(data);
        // Navigation will be handled by onSuccess callback in usePrMutation
      } else if (currentMode === formType.EDIT && initValues?.id) {
        updatePr({ id: initValues.id, data });
        setCurrentMode(formType.VIEW);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toastError({ message: "Error in form submission" });
    }
  };

  const handleDialogItemPr = (
    e: React.MouseEvent,
    data: Record<string, unknown> & { id?: string }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentItemData(data as ItemWithId);
    setOpenDialogItemPr(true);
  };

  const handleSaveItemDialog = (
    itemData: Record<string, unknown> & { id?: string }
  ) => {
    const formItems = form.getValues("purchase_request_detail");

    if (!itemData.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...newItemData } = itemData;
      const typedNewItemData = newItemData as Omit<
        PurchaseRequestDetailItemDto,
        "id"
      >;

      dispatchItems({ type: "ADD_ITEM", payload: typedNewItemData });

      const updatedItems = {
        ...formItems,
        add: [
          ...(formItems.add || []),
          typedNewItemData as PurchaseRequestDetailItemDto,
        ],
      };
      form.setValue("purchase_request_detail", updatedItems);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _updateId, ...updateData } = itemData;
      const typedUpdateData =
        updateData as Partial<PurchaseRequestDetailItemDto>;

      dispatchItems({
        type: "UPDATE_ITEM",
        payload: { id: itemData.id, data: typedUpdateData },
      });

      const updatedItems = {
        ...formItems,
        update: [
          ...(formItems.update || []).filter(
            (item: PurchaseRequestDetailItemDto) =>
              (item as ItemWithId).id !== itemData.id
          ),
          itemData as PurchaseRequestDetailItemDto,
        ],
      };
      form.setValue("purchase_request_detail", updatedItems);
    }

    console.log("Updated items with reducer");
    setCurrentItemData(undefined);
    setOpenDialogItemPr(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const formItems = form.getValues("purchase_request_detail");

    const updatedItems = {
      ...formItems,
      delete: [...(formItems.delete || []), { id: itemId }],
    };

    form.setValue("purchase_request_detail", updatedItems);
    dispatchItems({ type: "DELETE_ITEM", payload: itemId });
  };

  const convertPrStatus = (status: string) => {
    if (status === "draft") {
      return "Draft";
    } else if (status === "work_in_process") {
      return "Work in Progress";
    } else if (status === "approved") {
      return "Approved";
    } else if (status === "rejected") {
      return "Rejected";
    } else if (status === "cancelled") {
      return "Cancelled";
    }
  };

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
                <HeadPrForm
                  control={form.control}
                  mode={currentMode}
                  prNo={initValues?.pr_no}
                  statusInfo={statusInfo}
                  totalAmount={totalAmount}
                />
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
                    <ItemPr
                      itemsPr={currentItems}
                      mode={currentMode}
                      openDetail={handleDialogItemPr}
                      onDeleteItem={handleDeleteItem}
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

          <div className="grid grid-cols-2 gap-2">
            <JsonViewer data={mockData} />
            <JsonViewer data={watchForm} />
          </div>
          <JsonViewer data={diffData} />

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
            <div className="flex flex-col gap-4">
              <CommentGrn />
              <ActivityLog />
            </div>
          </div>
        )}

        <ItemPrDialog
          open={openDialogItemPr}
          onOpenChange={setOpenDialogItemPr}
          isLoading={false}
          mode={currentMode}
          formValues={currentItemData}
          onSave={handleSaveItemDialog}
        />
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

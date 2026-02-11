"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { Card } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActionFields from "./ActionFields";
import HeadPoForm from "./HeadPoForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import PoItems from "./PoItems";
import Docs from "./Docs";
import { Form } from "@/components/form-custom/form";
import { PoDetailDto } from "@/dtos/po.dto";
import { PoFormSchema, PoFormValues } from "../../_schema/po.schema";
import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { usePoMutation, usePoUpdateMutation, usePoDeleteMutation } from "@/hooks/use-po";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";

interface PoFormProps {
  readonly poData?: PoDetailDto;
  readonly mode: formType;
}

// Helper function to get tomorrow's date
const getTomorrow = () => addDays(new Date(), 1).toISOString();

export default function PoForm({ poData, mode }: PoFormProps) {
  const { buCode, token } = useAuth();
  const { dateFormat, currencyBase } = useBuConfig();
  const router = useRouter();
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createMutation = usePoMutation(token, buCode);
  const updateMutation = usePoUpdateMutation(token, buCode);
  const deleteMutation = usePoDeleteMutation(token, buCode);

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const defaultValues: PoFormValues = {
    vendor_id: "",
    vendor_name: "",
    delivery_date: getTomorrow(),
    currency_id: "",
    currency_name: "",
    exchange_rate: 1,
    description: "",
    order_date: getTomorrow(),
    credit_term_id: "",
    credit_term_name: "",
    credit_term_value: 0,
    buyer_id: "",
    buyer_name: "",
    email: "",
    remarks: "",
    note: "",
  };

  const form = useForm<PoFormValues>({
    resolver: zodResolver(PoFormSchema),
    defaultValues,
  });

  // Reset form when poData changes
  useEffect(() => {
    if (poData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = poData as any;
      const rawItems = data?.purchase_order_detail ?? data?.details ?? [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const details = rawItems.map((item: any) => ({
        id: item.id,
        sequence: item.sequence_no ?? item.sequence ?? 0,
        product_id: item.info?.product_id ?? item.product_id ?? "",
        product_name: item.info?.product_name ?? item.product_name ?? "",
        product_local_name: item.info?.product_local_name ?? item.product_local_name ?? null,
        order_unit_id: item.order_unit_id ?? "",
        order_unit_name: item.order_unit_name ?? "",
        order_unit_conversion_factor: item.order_unit_conversion_factor ?? 1,
        order_qty: item.order_qty ?? 0,
        base_unit_id: item.base_unit_id ?? "",
        base_unit_name: item.base_unit_name ?? "",
        base_qty: item.base_qty ?? 0,
        price: item.price ?? 0,
        sub_total_price: item.sub_total_price ?? 0,
        net_amount: item.net_amount ?? 0,
        total_price: item.total_price ?? 0,
        tax_profile_id: item.tax_profile_id ?? null,
        tax_profile_name: item.tax_profile_name ?? null,
        tax_rate: item.tax_rate ?? 0,
        tax_amount: item.tax_amount ?? 0,
        is_tax_adjustment: item.is_tax_adjustment ?? false,
        discount_rate: item.discount_rate ?? 0,
        discount_amount: item.discount_amount ?? 0,
        is_discount_adjustment: item.is_discount_adjustment ?? false,
        is_foc: item.is_foc ?? false,
        pr_detail: item.pr_detail ?? [],
        description: item.description ?? "",
        note: item.note ?? "",
      }));

      // Get current form values to preserve fields not returned by API
      const currentValues = form.getValues();

      form.reset({
        id: data.id,
        vendor_id: data.vendor_id,
        vendor_name: data.vendor?.name ?? data.vendor_name ?? "",
        delivery_date: data.delivery_date,
        currency_id: data.currency_id,
        currency_name: data.currency?.name ?? data.currency_name ?? "",
        exchange_rate: data.exchange_rate ?? 1,
        description: data.description ?? "",
        order_date: data.order_date,
        // credit_term: API returns only number value, preserve id/name from form
        credit_term_id: data.credit_term_id ?? currentValues.credit_term_id ?? "",
        credit_term_name: data.credit_term_name ?? currentValues.credit_term_name ?? "",
        credit_term_value:
          typeof data.credit_term === "number" ? data.credit_term : (data.credit_term_value ?? 0),
        // buyer: API returns only name, preserve id from form
        buyer_id: data.buyer_id ?? currentValues.buyer_id ?? "",
        buyer_name: data.buyer_name ?? "",
        email: data.email ?? "",
        remarks: data.remarks ?? "",
        note: data.note ?? "",
        details,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poData]);

  const vendorId = useWatch({ control: form.control, name: "vendor_id" });
  const currencyId = useWatch({ control: form.control, name: "currency_id" });
  const canSubmit = Boolean(vendorId && currencyId);

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!poData?.id) return;

    deleteMutation.mutate(poData.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toastSuccess({ message: tPurchaseOrder("del_po_success") });
        router.push("/procurement/purchase-order");
      },
      onError: () => {
        toastError({ message: tPurchaseOrder("del_po_failed") });
      },
    });
  };

  const onSubmit = (data: PoFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...payloadWithoutId } = data;

    // Prepare details array - remove id from new items, keep id for existing items
    const details = data.details?.map((item) => {
      // Remove undefined optional fields for cleaner payload
      const cleanItem = { ...item };
      if (cleanItem.product_local_name === null) delete cleanItem.product_local_name;
      if (cleanItem.tax_profile_id === null) delete cleanItem.tax_profile_id;
      if (cleanItem.tax_profile_name === null) delete cleanItem.tax_profile_name;
      return cleanItem;
    });

    const payload = {
      ...payloadWithoutId,
      details: details && details.length > 0 ? details : undefined,
    };

    if (currentMode === formType.ADD) {
      // Remove id from details for create
      const createPayload = {
        ...payload,
        details: payload.details?.map(({ id: itemId, ...rest }) => rest),
      };

      createMutation.mutate(createPayload, {
        onSuccess: (response) => {
          const newId = response?.data?.id;
          if (newId) {
            router.replace(`/procurement/purchase-order/${newId}`);
            toastSuccess({ message: tPurchaseOrder("add_po_success") });
            setCurrentMode(formType.VIEW);
          }
        },
        onError: () => {
          toastError({ message: tPurchaseOrder("add_po_failed") });
        },
      });
    } else if (currentMode === formType.EDIT && poData?.id) {
      updateMutation.mutate(
        { id: poData.id, data: payload },
        {
          onSuccess: () => {
            toastSuccess({ message: tPurchaseOrder("update_po_success") });
            setCurrentMode(formType.VIEW);
          },
          onError: () => {
            toastError({ message: tPurchaseOrder("update_po_failed") });
          },
        }
      );
    }
  };

  return (
    <DetailsAndComments>
      <Card className="p-4 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ActionFields
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
              title={poData?.po_no ?? ""}
              isPending={isPending}
              canSubmit={canSubmit}
              onDelete={poData?.id ? handleOpenDeleteDialog : undefined}
            />
            <HeadPoForm
              form={form}
              currentMode={currentMode}
              buCode={buCode}
              dateFormat={dateFormat ?? "yyyy-MM-dd"}
              currencyBase={currencyBase ?? "THB"}
            />
            <Tabs defaultValue="items">
              <TabsList className={"mt-4"}>
                <TabsTrigger className="w-full h-6" value="items">
                  {tPurchaseOrder("items")}
                </TabsTrigger>
                <TabsTrigger className="w-full h-6" value="docs">
                  {tPurchaseOrder("docs")}
                </TabsTrigger>
              </TabsList>
              <div className="mt-2">
                <TabsContent value="items" className="mt-0">
                  <PoItems form={form} currentMode={currentMode} buCode={buCode} token={token} />
                </TabsContent>
                <TabsContent value="docs" className="mt-0">
                  <Docs docs={[]} />
                </TabsContent>
              </div>
            </Tabs>
          </form>
        </Form>
      </Card>
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tPurchaseOrder("del_po_title")}
        description={tPurchaseOrder("del_po_desc")}
      />
    </DetailsAndComments>
  );
}

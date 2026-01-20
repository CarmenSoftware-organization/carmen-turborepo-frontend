"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { Card } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import ActivityLog from "../ActivityLog";
import CommentPo from "../CommentPo";
import { Form } from "@/components/form-custom/form";
import { PoDetailDto } from "@/dtos/po.dto";
import { PoFormSchema, PoFormValues } from "../../_schema/po.schema";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface PoFormProps {
  readonly poData?: PoDetailDto;
  readonly mode: formType;
}

export default function PoForm({ poData, mode }: PoFormProps) {
  const { buCode, token } = useAuth();
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isPending = false; // TODO: Replace with actual mutation state

  const defaultValues: PoFormValues = {
    vendor_id: "",
    vendor_name: "",
    delivery_date: new Date().toISOString(),
    currency_id: "",
    currency_name: "",
    exchange_rate: 1,
    description: "",
    order_date: new Date().toISOString(),
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

  useEffect(() => {
    if (poData) {
      form.reset({
        id: poData.id,
        vendor_id: poData.vendor_id,
        vendor_name: poData.vendor_name,
        delivery_date: poData.delivery_date,
        currency_id: poData.currency_id,
        currency_name: poData.currency_name,
        exchange_rate: poData.exchange_rate,
        description: poData.description,
        order_date: poData.order_date,
        credit_term_id: poData.credit_term_id,
        credit_term_name: poData.credit_term_name,
        credit_term_value: poData.credit_term_value,
        buyer_id: poData.buyer_id,
        buyer_name: poData.buyer_name,
        email: poData.email,
        remarks: poData.remarks,
        note: poData.note,
      });
    }
  }, [poData, form]);

  const watchVendorId = form.watch("vendor_id");
  const watchCurrencyId = form.watch("currency_id");
  const canSubmit = Boolean(watchVendorId && watchCurrencyId);

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete mutation
    setIsDeleteDialogOpen(false);
    toastSuccess({ message: tPurchaseOrder("delete_po_success") });
  };

  const onSubmit = (data: PoFormValues) => {
    console.log("Form data:", data);
    if (currentMode === formType.ADD) {
      // TODO: Implement create mutation
      toastSuccess({ message: tPurchaseOrder("add_po_success") });
      setCurrentMode(formType.VIEW);
    } else if (currentMode === formType.EDIT && poData?.id) {
      // TODO: Implement update mutation
      toastSuccess({ message: tPurchaseOrder("update_po_success") });
      setCurrentMode(formType.VIEW);
    }
  };

  console.log("po data", poData);

  return (
    <DetailsAndComments activityComponent={<ActivityLog />} commentComponent={<CommentPo />}>
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
            <HeadPoForm form={form} currentMode={currentMode} buCode={buCode} />
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
                  <PoItems
                    form={form}
                    currentMode={currentMode}
                    originalItems={poData?.details || []}
                  />
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

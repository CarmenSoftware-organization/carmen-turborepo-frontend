"use client";

import { formType } from "@/dtos/form.dto";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Pencil,
  Save,
  X,
  Printer,
  FileDown,
  Share,
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeadCnForm from "./HeadCnForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import {
  CreditNoteByIdDto,
  CreditNoteFormDto,
  CreditNoteSubmitDto,
  creditNoteSubmitSchemaDto,
} from "../../dto/cdn.dto";
import ItemsCn from "./ItemsCn";
import { CREDIT_NOTE_TYPE } from "@/constants/enum";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import {
  useCreateCreditNote,
  useUpdateCreditNote,
} from "@/hooks/useCreditNote";
import { format } from "date-fns";
import { useCnReasonQuery } from "@/hooks/useCnReason";
import DetailsAndComments from "@/components/DetailsAndComments";
interface CnFormProps {
  readonly mode: formType;
  readonly initialValues?: CreditNoteByIdDto;
}

export default function CnForm({ initialValues, mode }: CnFormProps) {
  const { token, tenantId } = useAuth();
  const createMutation = useCreateCreditNote(token, tenantId);
  const updateMutation = useUpdateCreditNote(
    token,
    tenantId,
    initialValues?.id ?? ""
  );
  const { getCnReasonName } = useCnReasonQuery({
    token: token || "",
    tenantId: tenantId || "",
  });

  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const defaultValues: CreditNoteFormDto = {
    cn_date: initialValues?.cn_date ?? new Date().toISOString(),
    credit_note_type:
      (initialValues?.credit_note_type as CREDIT_NOTE_TYPE) ??
      CREDIT_NOTE_TYPE.QUANTITY_RETURN,
    vendor_id: initialValues?.vendor_id ?? "",
    currency_id: initialValues?.currency_id ?? "",
    exchange_rate: initialValues?.exchange_rate ?? 1,
    exchange_rate_date:
      initialValues?.exchange_rate_date ?? new Date().toISOString(),
    grn_id: initialValues?.grn_id ?? "",
    grn_date: initialValues?.grn_date ?? new Date().toISOString(),
    cn_reason_id: initialValues?.cn_reason_id ?? "",
    invoice_no: initialValues?.invoice_no ?? "",
    invoice_date: initialValues?.invoice_date ?? new Date().toISOString(),
    tax_invoice_no: initialValues?.tax_invoice_no ?? "",
    tax_invoice_date:
      initialValues?.tax_invoice_date ?? new Date().toISOString(),
    note: initialValues?.note ?? "",
    description: initialValues?.description ?? null,
    credit_note_detail: {
      data:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (initialValues?.credit_note_detail as any)?.data?.map((item: any) => ({
          id: item.id,
          description: item.description,
          note: item.note,
          location_id: item.location_id,
          product_id: item.product_id,
          return_qty: item.return_qty,
          return_unit_id: item.return_unit_id,
          return_conversion_factor: item.return_conversion_factor,
          return_base_qty: item.return_base_qty,
          price: item.price,
          tax_type_inventory_id: item.tax_type_inventory_id,
          tax_rate: item.tax_rate || 0,
          tax_amount: item.tax_amount,
          is_tax_adjustment: item.is_tax_adjustment,
          discount_rate: item.discount_rate || 0,
          discount_amount: item.discount_amount ?? 0,
          is_discount_adjustment: item.is_discount_adjustment,
          extra_cost_amount: item.extra_cost_amount,
          base_price: item.base_price || 0,
          base_tax_amount: item.base_tax_amount,
          base_discount_amount: item.base_discount_amount,
          base_extra_cost_amount: item.base_extra_cost_amount,
          total_price: item.total_price,
        })) ?? [],
      add: [],
      update: [],
      remove: [],
    },
  };

  const form = useForm<CreditNoteSubmitDto>({
    resolver: zodResolver(creditNoteSubmitSchemaDto),
    defaultValues,
    mode: "onChange",
  });

  const creditNoteDetail = form.watch("credit_note_detail");

  useEffect(() => {
    console.log("creditNoteDetail changed:", creditNoteDetail);
  }, [creditNoteDetail]);

  const convertStatus = (status?: string) => {
    if (!status) return "Draft";
    const statusMap: Record<string, string> = {
      draft: "Draft",
      work_in_process: "Work in Progress",
      approved: "Approved",
      rejected: "Rejected",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const handleSubmit = async (data: CreditNoteSubmitDto) => {
    try {
      if (mode === formType.ADD) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await createMutation.mutateAsync(data as any)) as {
          id?: string;
        };
        toastSuccess({ message: "Credit note created successfully" });
        console.log("result", result);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateMutation.mutateAsync(data as any);
        toastSuccess({ message: "Credit note updated successfully" });
      }
    } catch (error) {
      console.error("Error saving credit note:", error);
      toastError({
        message:
          mode === formType.ADD
            ? "Failed to create credit note"
            : "Failed to update credit note",
      });
    } finally {
      setCurrentMode(formType.VIEW);
    }
  };

  // Watch form state changes
  const { isDirty, isValid, errors } = form.formState;
  const watchCnForm = form.watch();

  console.log("watchCnForm", watchCnForm);

  // Debug form state changes
  useEffect(() => {
    console.log("🔄 Form state changed:");
    console.log("- isDirty:", isDirty);
    console.log("- isValid:", isValid);
    console.log("- errors:", errors);
    console.log("- watched values:", watchCnForm);
  }, [isDirty, isValid, errors, watchCnForm]);

  return (
    <DetailsAndComments
      commentPanel={<p>hello 2</p>}
    >
      <Card className="p-4 mb-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link href="/procurement/credit-note">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                {mode === formType.ADD ? (
                  <p className="text-base font-bold">Credit Note</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-bold">
                      {initialValues?.cn_no}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created at{" "}
                      {format(
                        new Date(initialValues?.cn_date ?? ""),
                        "PPP"
                      )}
                    </p>
                  </div>
                )}
                {initialValues?.doc_status && (
                  <Badge
                    variant={initialValues?.doc_status}
                    className="rounded-full text-xs"
                  >
                    {convertStatus(initialValues?.doc_status)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {currentMode === formType.VIEW ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() => window.history.back()}
                    >
                      <ChevronLeft /> Back
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() => setCurrentMode(formType.EDIT)}
                    >
                      <Pencil /> Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() =>
                        currentMode === formType.ADD
                          ? window.history.back()
                          : setCurrentMode(formType.VIEW)
                      }
                    >
                      <X /> Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="px-2 text-xs"
                      type="submit"
                    >
                      <Save /> Save
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 text-xs"
                >
                  <Printer /> Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 text-xs"
                >
                  <FileDown /> Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 text-xs"
                >
                  <Share /> Share
                </Button>
              </div>
            </div>
            <HeadCnForm
              control={form.control}
              mode={currentMode}
              cnNo={initialValues?.cn_no}
              getCnReasonName={getCnReasonName}
            />
            <Tabs defaultValue="items">
              <TabsList className="w-full">
                <TabsTrigger className="w-full text-xs" value="items">
                  Items
                </TabsTrigger>
                <TabsTrigger
                  className="w-full text-xs"
                  value="stock_movement"
                >
                  Stock Movement
                </TabsTrigger>
                <TabsTrigger
                  className="w-full text-xs"
                  value="journal_entries"
                >
                  Journal Entries
                </TabsTrigger>
                <TabsTrigger className="w-full text-xs" value="tax_entries">
                  Tax Entries
                </TabsTrigger>
              </TabsList>
              <TabsContent value="items" className="mt-2">
                <ItemsCn control={form.control} mode={currentMode} />
              </TabsContent>
              <TabsContent value="stock_movement" className="mt-2">
                <h1>Stock Movement</h1>
              </TabsContent>
              <TabsContent value="journal_entries" className="mt-2">
                <h1>Journal Entries</h1>
              </TabsContent>
              <TabsContent value="tax_entries" className="mt-2">
                <h1>Tax Entries</h1>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </Card>
    </DetailsAndComments>
  )
}

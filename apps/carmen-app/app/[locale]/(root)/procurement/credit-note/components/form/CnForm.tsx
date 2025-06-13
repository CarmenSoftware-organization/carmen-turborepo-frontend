"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditNoteGetAllDto,
  creditNoteFormSchema,
  CreditNoteFormDto,
  CreditNoteDetailFormDto,
} from "@/dtos/credit-note.dto";
import { formType } from "@/dtos/form.dto";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Save,
  X,
  Printer,
  FileDown,
  Share,
} from "lucide-react";
import CnItemDialog from "./CnItemDialog";
import { Link, useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CnItem from "./CnItem";
import HeadCnForm from "./HeadCnForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { nanoid } from "nanoid";
import { useAuth } from "@/context/AuthContext";
import {
  useCreateCreditNote,
  useUpdateCreditNote,
} from "@/hooks/useCreditNote";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface CnFormProps {
  readonly creditNote?: CreditNoteGetAllDto;
  readonly mode: formType;
}

export default function CnForm({ creditNote, mode }: CnFormProps) {
  const { token, tenantId } = useAuth();
  const router = useRouter();
  const createMutation = useCreateCreditNote(token, tenantId);
  const updateMutation = useUpdateCreditNote(
    token,
    tenantId,
    creditNote?.id ?? ""
  );

  const [openLog, setOpenLog] = useState(false);
  const [openDialogItemCn, setOpenDialogItemCn] = useState(false);
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [currentItemData, setCurrentItemData] = useState<
    CreditNoteDetailFormDto | undefined
  >();

  const defaultValues: CreditNoteFormDto = {
    cn_date: creditNote?.cn_date ?? new Date().toISOString(),
    note: creditNote?.note ?? null,
    credit_note_detail: {
      add: [],
      update: [],
      delete: [],
    },
  };

  const form = useForm<CreditNoteFormDto>({
    resolver: zodResolver(creditNoteFormSchema),
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

  const handleSaveItem = (data: CreditNoteDetailFormDto) => {
    console.log("handleSaveItem called with data:", data);

    const currentValues = form.getValues();
    console.log("Current form values:", currentValues);

    // Check if item exists in any array
    const existingInAdd = currentValues.credit_note_detail.add.find(
      (item) => item.id === data.id
    );
    const existingInUpdate = currentValues.credit_note_detail.update.find(
      (item) => item.id === data.id
    );

    if (existingInAdd) {
      // Update in add array
      const newAddItems = currentValues.credit_note_detail.add.map((item) =>
        item.id === data.id ? { ...data } : item
      );
      form.setValue("credit_note_detail.add", newAddItems);
    } else if (existingInUpdate) {
      // Update in update array
      const newUpdateItems = currentValues.credit_note_detail.update.map(
        (item) => (item.id === data.id ? { ...data } : item)
      );
      form.setValue("credit_note_detail.update", newUpdateItems);
    } else if (data.id) {
      // Existing item not in any array - add to update
      form.setValue("credit_note_detail.update", [
        ...currentValues.credit_note_detail.update,
        data,
      ]);
    } else {
      // New item - add to add array with new temporary id
      const tempId = `temp_${nanoid()}`;
      form.setValue("credit_note_detail.add", [
        ...currentValues.credit_note_detail.add,
        { ...data, id: tempId },
      ]);
    }

    setOpenDialogItemCn(false);
    setCurrentItemData(undefined);
  };

  const handleDeleteItem = (itemId: string) => {
    const currentValues = form.getValues();

    // Remove from add array if present
    const newAddItems = currentValues.credit_note_detail.add.filter(
      (item) => item.id !== itemId
    );
    form.setValue("credit_note_detail.add", newAddItems);

    // Remove from update array if present
    const newUpdateItems = currentValues.credit_note_detail.update.filter(
      (item) => item.id !== itemId
    );
    form.setValue("credit_note_detail.update", newUpdateItems);

    // Add to delete array if it was an existing item
    const wasExistingItem = currentValues.credit_note_detail.update.some(
      (item) => item.id === itemId
    );
    if (wasExistingItem) {
      form.setValue("credit_note_detail.delete", [
        ...currentValues.credit_note_detail.delete,
        itemId,
      ]);
    }
  };

  const handleSubmit = async (data: CreditNoteFormDto) => {

    try {
      if (mode === formType.ADD) {
        await createMutation.mutateAsync(data);
        toastSuccess({ message: "Credit note created successfully" });
      } else {
        await updateMutation.mutateAsync(data);
        toastSuccess({ message: "Credit note updated successfully" });
      }
      router.push("/procurement/credit-note");
    } catch (error) {
      console.error("Error saving credit note:", error);
      toastError({
        message:
          mode === formType.ADD
            ? "Failed to create credit note"
            : "Failed to update credit note",
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-4 relative">
        <ScrollArea
          className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Card className="p-4 mb-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Link href="/procurement/credit-note">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    {mode === formType.ADD ? (
                      <p className="text-base font-bold">Credit Note</p>
                    ) : (
                      <p className="text-base font-bold">{creditNote?.cn_no}</p>
                    )}
                    {creditNote?.doc_status && (
                      <Badge
                        variant={creditNote.doc_status}
                        className="rounded-full text-xs"
                      >
                        {convertStatus(creditNote.doc_status)}
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
                  cnNo={creditNote?.cn_no}
                />
                <Tabs defaultValue="items">
                  <TabsList className="w-full">
                    <TabsTrigger className="w-full text-xs" value="items">
                      Items Details
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
                    <CnItem
                      itemsCn={[
                        ...creditNoteDetail.add,
                        ...creditNoteDetail.update,
                      ].filter(
                        (item) =>
                          !creditNoteDetail.delete.includes(item.id ?? "")
                      )}
                      mode={currentMode}
                      openDetail={(e, data) => {
                        console.log("openDetail called with data:", data);
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentItemData(data);
                        setOpenDialogItemCn(true);
                      }}
                      onDeleteItem={(itemId) => {
                        console.log("onDeleteItem called with id:", itemId);
                        handleDeleteItem(itemId);
                      }}
                    />
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
              </Card>
            </form>
          </Form>
          <pre>{JSON.stringify(creditNote, null, 2)}</pre>
        </ScrollArea>

        {openLog && (
          <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
            <div className="flex flex-col gap-4">
              <h1>Comment</h1>
              <h1>Activity Log</h1>
            </div>
          </div>
        )}
      </div>

      <CnItemDialog
        open={openDialogItemCn}
        onOpenChange={setOpenDialogItemCn}
        isLoading={false}
        mode={currentMode}
        formValues={currentItemData}
        onSave={handleSaveItem}
      />

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

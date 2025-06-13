"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditNoteGetAllDto,
  creditNoteFormSchema,
  CreditNoteFormDto,
  CreditNoteDetailFormDto,
} from "@/dtos/credit-note.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
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
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CnItem from "./CnItem";
import HeadCnForm from "./HeadCnForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

interface CnFormProps {
  readonly creditNote?: CreditNoteGetAllDto;
  readonly mode: formType;
}

export default function CnForm({ creditNote, mode }: CnFormProps) {
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
    const { credit_note_detail } = form.getValues();

    if (data.id) {
      // Update existing item
      const updatedItems = credit_note_detail.update.map((item) =>
        item.id === data.id ? data : item
      );
      form.setValue("credit_note_detail.update", updatedItems);
    } else {
      // Add new item
      form.setValue("credit_note_detail.add", [
        ...credit_note_detail.add,
        data,
      ]);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const { credit_note_detail } = form.getValues();
    form.setValue("credit_note_detail.delete", [
      ...credit_note_detail.delete,
      itemId,
    ]);
  };

  return (
    <div className="relative">
      <div className="flex gap-4 relative">
        <ScrollArea
          className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))}>
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
                        ...form.getValues().credit_note_detail.add,
                        ...form.getValues().credit_note_detail.update,
                      ].filter(
                        (item) =>
                          !form
                            .getValues()
                            .credit_note_detail.delete.includes(item.id ?? "")
                      )}
                      mode={currentMode}
                      openDetail={(e, data) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentItemData(data);
                        setOpenDialogItemCn(true);
                      }}
                      onDeleteItem={handleDeleteItem}
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

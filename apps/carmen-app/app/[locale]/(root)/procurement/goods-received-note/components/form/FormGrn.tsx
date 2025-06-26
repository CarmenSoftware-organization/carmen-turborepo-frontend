"use client";

import { formType } from "@/dtos/form.dto";
import { CreateGRNDto, GetGrnByIdDto, grnPostSchema } from "@/dtos/grn.dto";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRightIcon,
  CheckCircleIcon,
  ChevronRight,
  ChevronLeft,
  XCircleIcon,
  Pencil,
  X,
  Save,
  Printer,
  FileDown,
  Share,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useRouter } from "@/lib/navigation";
import { format } from "date-fns";
import GrnFormHeader from "./GrnFormHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityLog from "../ActivityLog";
import CommentGrn from "../CommentGrn";
import { DOC_TYPE } from "@/constants/enum";
import ItemGrn from "./ItemGrn";
import ExtraCost from "./ExtraCost";
import { Badge } from "@/components/ui/badge";

// TODO: Implement these components
const BudgetGrn = ({ mode }: { mode: formType }) => (
  <div className="p-4 border rounded-md">
    BudgetGrn Placeholder (Mode: {mode})
  </div>
);
const WorkflowGrn = ({ workflowData }: { workflowData: unknown }) => (
  <div className="p-4 border rounded-md">
    WorkflowGrn Placeholder Data: {JSON.stringify(workflowData)}
  </div>
);

interface FormGrnProps {
  readonly mode: formType;
  readonly initialValues?: GetGrnByIdDto;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
  const router = useRouter();
  const [openLog, setOpenLog] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const isCreatePending = false;
  const isUpdatePending = false;
  const createGrn = (data: CreateGRNDto) => console.log("Creating GRN:", data);
  const updateGrn = ({ id, data }: { id: string; data: CreateGRNDto }) =>
    console.log("Updating GRN:", { id, data });

  const defaultValues: CreateGRNDto = {
    invoice_no: initialValues?.invoice_no ?? "",
    invoice_date: initialValues?.invoice_date ?? new Date().toISOString(),
    description: initialValues?.description ?? "",
    doc_status: initialValues?.doc_status ?? "draft",
    doc_type: initialValues?.doc_type ?? DOC_TYPE.MANUAL,
    vendor_id: initialValues?.vendor_id ?? "",
    currency_id: initialValues?.currency_id ?? "",
    currency_rate: initialValues?.currency_rate ?? 0,
    workflow_id: initialValues?.workflow_id ?? "",
    current_workflow_status:
      initialValues?.current_workflow_status ?? "pending",
    signature_image_url: initialValues?.signature_image_url ?? "",
    received_by_id: initialValues?.received_by_id ?? "",
    received_at: initialValues?.received_at ?? new Date().toISOString(),
    credit_term_id: initialValues?.credit_term_id ?? "",
    payment_due_date:
      initialValues?.payment_due_date ?? new Date().toISOString(),
    good_received_note_detail: {
      initData: initialValues?.good_received_note_detail ?? [],
      add: [],
      update: [],
      delete: [],
    },
    extra_cost: {
      name: initialValues?.extra_cost?.name ?? "",
      allocate_extra_cost_type:
        initialValues?.extra_cost?.allocate_extra_cost_type,
      note: initialValues?.extra_cost?.note ?? "",
      extra_cost_detail: {
        add: [],
        update: [],
        delete: [],
      },
    },
  };

  const form = useForm<CreateGRNDto>({
    resolver: zodResolver(grnPostSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchedValues = form.watch();
  const isDirty = form.formState.isDirty;
  const errors = form.formState.errors;

  useEffect(() => {
    console.log("Form Values Changed in Dialog:", watchedValues);
    console.log("Form Errors in Dialog:", errors);
    console.log("Is Form Dirty in Dialog:", isDirty);
  }, [watchedValues, errors, isDirty]);

  useEffect(() => {
    if (initialValues) {
      const transformedValues: CreateGRNDto = {
        ...initialValues,
        good_received_note_detail: {
          initData: initialValues.good_received_note_detail,
          add: [],
          update: [],
          delete: [],
        },
      };
      form.reset(transformedValues);
    }
  }, [initialValues, form]);

  const onSubmit = async (data: CreateGRNDto) => {
    try {
      if (currentMode === formType.ADD) {
        createGrn(data);
      } else if (currentMode === formType.EDIT && initialValues?.id) {
        updateGrn({ id: initialValues.id, data });
      }
      setCurrentMode(formType.VIEW);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-4 relative">
        <ScrollArea
          className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
        >
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="p-4 mb-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Link href="/procurement/goods-received-note">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-start gap-2">
                      {mode === formType.ADD ? (
                        <p className="text-base  font-bold">
                          Goods Received Note
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-bold">
                            {initialValues?.grn_no}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created on{" "}
                            {format(
                              new Date(initialValues?.created_at ?? ""),
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
                          {initialValues?.doc_status}
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
                          asChild
                        >
                          <Link href="/procurement/goods-received-note">
                            <ChevronLeft /> Back
                          </Link>
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
                              ? router.push("/procurement/goods-received-note")
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
                <GrnFormHeader control={form.control} mode={currentMode} />
                <Tabs defaultValue="items">
                  <TabsList className="w-full mt-4">
                    <TabsTrigger className="w-full text-xs" value="items">
                      Items
                    </TabsTrigger>
                    <TabsTrigger className="w-full text-xs" value="extra_cost">
                      Extra Cost
                    </TabsTrigger>
                    <TabsTrigger className="w-full text-xs" value="budget">
                      Budget
                    </TabsTrigger>
                    <TabsTrigger className="w-full text-xs" value="workflow">
                      Workflow
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="items" className="mt-2">
                    <ItemGrn
                      control={form.control}
                      mode={currentMode}
                      setValue={form.setValue}
                    />
                  </TabsContent>
                  <TabsContent value="extra_cost" className="mt-2">
                    <ExtraCost control={form.control} mode={currentMode} />
                  </TabsContent>
                  <TabsContent value="budget" className="mt-2">
                    <BudgetGrn mode={currentMode} />
                  </TabsContent>
                  <TabsContent value="workflow" className="mt-2">
                    <WorkflowGrn
                      workflowData={initialValues?.workflow_history}
                    />
                  </TabsContent>
                </Tabs>
              </Card>
            </form>
          </Form>

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

"use client";

import { formType } from "@/dtos/form.dto";
import { CreateGRNDto, GetGrnByIdDto, grnPostSchema } from "@/dtos/grn.dto";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
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
import { useAuth } from "@/context/AuthContext";
import { useGrnMutation, useUpdateCreditNote } from "@/hooks/useGrn";
import DetailsAndComments from "@/components/DetailsAndComments";

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
  const { token, buCode } = useAuth();
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  // ตรวจสอบว่า token และ buCode มีค่าก่อนส่งไปยัง hooks
  const { mutate: createGrn, isPending: isCreatePending } = useGrnMutation(
    token || "",
    buCode || ""
  );

  const { mutate: updateGrn, isPending: isUpdatePending } = useUpdateCreditNote(
    token || "",
    buCode || "",
    initialValues?.id ?? ""
  );

  const defaultValues: CreateGRNDto = {
    invoice_no: initialValues?.invoice_no ?? "",
    invoice_date: initialValues?.invoice_date ?? new Date().toISOString(),
    description: initialValues?.description ?? "",
    doc_status: initialValues?.doc_status ?? "draft",
    doc_type: initialValues?.doc_type ?? DOC_TYPE.MANUAL,
    vendor_id: initialValues?.vendor_id ?? "",
    currency_id: initialValues?.currency_id ?? "",
    currency_rate: initialValues?.currency_rate ?? 0,
    workflow_id:
      initialValues?.workflow_id ?? "ac710822-d422-4e29-8439-87327e960a0e",
    current_workflow_status:
      initialValues?.current_workflow_status ?? "pending",
    signature_image_url: initialValues?.signature_image_url ?? "",
    received_by_id:
      initialValues?.received_by_id ?? "1bfdb891-58ee-499c-8115-34a964de8122",
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

  const onSubmit = async (data: CreateGRNDto, e?: React.BaseSyntheticEvent) => {


    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // ตรวจสอบว่าต้องมี token และ buCode ก่อนส่งข้อมูล
    if (!token || !buCode) {
      console.error("Missing authentication credentials");
      return;
    }

    try {
      if (currentMode === formType.ADD) {
        console.log("Calling createGrn with data:", data);
        createGrn(data);
      } else if (currentMode === formType.EDIT && initialValues?.id) {
        console.log("Calling updateGrn with data:", data);
        updateGrn(data);
      } else {
        console.log(
          "No action taken - currentMode:",
          currentMode,
          "initialValues?.id:",
          initialValues?.id
        );
      }
      setCurrentMode(formType.VIEW);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <DetailsAndComments
      activityComponent={<ActivityLog />}
      commentComponent={<CommentGrn />}
    >
      <Card className="p-4 mb-2">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              console.log("Form submit event triggered", e);
              return form.handleSubmit(onSubmit)(e);
            }}
          >
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (currentMode === formType.ADD) {
                          router.push("/procurement/goods-received-note");
                        } else {
                          setCurrentMode(formType.VIEW);
                        }
                      }}
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
          </form>
        </Form>
      </Card>
    </DetailsAndComments>
  );
}

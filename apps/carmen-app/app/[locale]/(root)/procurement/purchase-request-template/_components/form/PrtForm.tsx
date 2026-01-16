"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ActivityLog from "../ActivityLog";
import CommentPrt from "../CommentPrt";
import { Card } from "@/components/ui/card";
import ActionFields from "./ActionFields";
import HeadPrtForm from "./HeadPrtForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseRequestTemplateDto } from "@/dtos/pr-template.dto";
import { Form } from "@/components/form-custom/form";
import PrtItems from "./PrtItems";
import { CreatePrtDto, UpdatePrtDto, PrtFormValues } from "../../_schema/prt.schema";
import JsonViewer from "@/components/JsonViewer";
import { useAuth } from "@/context/AuthContext";

interface PrtFormProps {
  readonly prtData?: PurchaseRequestTemplateDto;
  readonly mode: formType;
}

export default function PrtForm({ prtData, mode }: PrtFormProps) {
  const { buCode, departments } = useAuth();
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const defaultValues: PrtFormValues = {
    name: "",
    description: "",
    workflow_id: "",
    department_id: departments?.id,
    is_active: true,
    note: "",
  };

  const form = useForm<PrtFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (prtData) {
      // Only reset header fields, not the details
      // Details are managed separately and only added to form when user performs actions
      form.reset({
        id: prtData.id,
        name: prtData.name,
        description: prtData.description,
        workflow_id: prtData.workflow_id,
        workflow_name: prtData.workflow_name,
        department_id: prtData.department_id,
        department_name: prtData.department_name,
        is_active: prtData.is_active,
        note: prtData.note,
      });
    }
  }, [prtData, form]);

  const onSubmit = (data: PrtFormValues) => {
    const details = data.purchase_request_template_detail;

    if (currentMode === formType.ADD) {
      const payload: CreatePrtDto = {
        name: data.name,
        description: data.description || undefined,
        workflow_id: data.workflow_id || undefined,
        department_id: data.department_id || undefined,
        is_active: data.is_active,
        note: data.note || undefined,
        purchase_request_template_detail: {
          add: details?.add,
        },
      };
      console.log("Create PRT payload:", payload);
    } else if (currentMode === formType.EDIT) {
      const payload: UpdatePrtDto = {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        workflow_id: data.workflow_id || undefined,
        department_id: data.department_id || undefined,
        is_active: data.is_active,
        note: data.note || undefined,
        purchase_request_template_detail: {
          add: details?.add?.length ? details.add : undefined,
          update: details?.update?.length ? details.update : undefined,
          delete: details?.delete?.length ? details.delete : undefined,
        },
      };
      console.log("Update PRT payload:", payload);
    }
  };

  return (
    <DetailsAndComments activityComponent={<ActivityLog />} commentComponent={<CommentPrt />}>
      <Card className="p-4">
        <ActionFields
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
          title={prtData?.name ?? ""}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <HeadPrtForm
              form={form}
              currentMode={currentMode}
              buCode={buCode}
              departName={departments?.name ?? ""}
            />
            <Tabs defaultValue="items" className="pt-4">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="items">
                  {tPurchaseRequest("items")}
                </TabsTrigger>
                <TabsTrigger className="w-full" value="budget">
                  {tPurchaseRequest("budget")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="items">
                <PrtItems
                  form={form}
                  currentMode={currentMode}
                  originalItems={prtData?.purchase_request_template_detail || []}
                />
              </TabsContent>
              <TabsContent value="budget">
                <h1>Budget</h1>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
        <JsonViewer data={form.watch()} />
      </Card>
    </DetailsAndComments>
  );
}

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
import { useCreatePrTemplate, useUpdatePrTemplate } from "@/hooks/use-pr-tmpl";

interface PrtFormProps {
  readonly prtData?: PurchaseRequestTemplateDto;
  readonly mode: formType;
}

export default function PrtForm({ prtData, mode }: PrtFormProps) {
  const { buCode, departments, token } = useAuth();
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const createPrTemplate = useCreatePrTemplate(token, buCode);
  const updatePrTemplate = useUpdatePrTemplate(token, buCode, prtData?.id ?? "");

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
    if (currentMode === formType.ADD) {
      createPrTemplate.mutate(data);
    } else if (currentMode === formType.EDIT && prtData?.id) {
      updatePrTemplate.mutate(data);
    }
  };

  return (
    <DetailsAndComments activityComponent={<ActivityLog />} commentComponent={<CommentPrt />}>
      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ActionFields
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
              title={prtData?.name ?? ""}
            />
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

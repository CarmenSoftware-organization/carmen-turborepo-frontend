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
import {
  PurchaseRequestTemplateDto,
  PurchaseRequestTemplateDetailDto,
} from "@/dtos/pr-template.dto";
import { Form } from "@/components/form-custom/form";
import PrtItems from "./PrtItems";

export interface PrtFormValues {
  id: string;
  name: string;
  description: string;
  workflow_id: string;
  workflow_name: string;
  department_id: string;
  department_name: string;
  is_active: boolean;
  note: string;
  purchase_request_template_detail: PurchaseRequestTemplateDetailDto[];
}

const defaultValues: PrtFormValues = {
  id: "",
  name: "",
  description: "",
  workflow_id: "",
  workflow_name: "",
  department_id: "",
  department_name: "",
  is_active: true,
  note: "",
  purchase_request_template_detail: [],
};

interface PrtFormProps {
  readonly prtData?: PurchaseRequestTemplateDto;
  readonly mode: formType;
}

export default function PrtForm({ prtData, mode }: PrtFormProps) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const form = useForm<PrtFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (prtData) {
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
        purchase_request_template_detail: prtData.purchase_request_template_detail,
      });
    }
  }, [prtData, form]);

  const onSubmit = (data: PrtFormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <DetailsAndComments activityComponent={<ActivityLog />} commentComponent={<CommentPrt />}>
      <Card className="p-4 space-y-4">
        <ActionFields
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
          title={prtData?.name ?? ""}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <HeadPrtForm form={form} />
            <Tabs defaultValue="items">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="items">
                  {tPurchaseRequest("items")}
                </TabsTrigger>
                <TabsTrigger className="w-full" value="budget">
                  {tPurchaseRequest("budget")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="items">
                <PrtItems form={form} currentMode={currentMode} />
              </TabsContent>
              <TabsContent value="budget">
                <h1>Budget</h1>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </Card>
    </DetailsAndComments>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { CampaignDetailDto } from "@/dtos/campaign.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/campaign";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/hooks/use-vendor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import TabVendor from "./TabVendor";
import TabSetting from "./TabSetting";
import TabOverview from "./TabOverview";
import { campaignFormSchema, CampaignFormValues } from "../../_schema/campaign.schema";
import {
  transformToCreateDto,
  transformToUpdateDto,
  calculateVendorOperations,
} from "../../_helper/transform-campaign-form";
import { createCampaign } from "../../_handlers/campaign-create.handlers";
import { updateCampaign } from "../../_handlers/campaign-update.handlers";

interface Props {
  readonly campaignData?: CampaignDetailDto;
  readonly mode: formType;
}

export default function MainForm({ campaignData, mode }: Props) {
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const { token, buCode } = useAuth();
  const { vendors } = useVendor(token, buCode);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: campaignData?.name || "",
      status: campaignData?.status || "draft",
      description: campaignData?.description || "",
      valid_period: campaignData?.valid_period || 90,
      template_id: campaignData?.template?.id || "",
      portal_duration: campaignData?.settings?.portal_duration || 14,
      campaign_type: campaignData?.settings?.campaign_type || "buy",
      submission_method: campaignData?.settings?.submission_method || "auto",
      require_approval: campaignData?.settings?.require_approval || false,
      auto_reminder: campaignData?.settings?.auto_reminder || false,
      priority: campaignData?.settings?.priority || "medium",
      instructions: campaignData?.settings?.instructions || "",
      reminders: campaignData?.settings?.reminders || [],
      escalations: campaignData?.settings?.escalations || [],
      vendors: campaignData?.vendor?.map((v) => v.id) || [],
    },
  });

  const {
    fields: reminderFields,
    append: appendReminder,
    remove: removeReminder,
  } = useFieldArray({
    control: form.control,
    name: "reminders",
  });

  const {
    fields: escalationFields,
    append: appendEscalation,
    remove: removeEscalation,
  } = useFieldArray({
    control: form.control,
    name: "escalations",
  });

  const createMutation = useCreateCampaign(token, buCode);
  const updateMutation = useUpdateCampaign(token, buCode, campaignData?.id || "");

  const onSubmit = async (data: CampaignFormValues): Promise<void> => {
    const isCreating = currentMode === formType.ADD;

    if (isCreating) {
      const createDto = transformToCreateDto(data);
      await createCampaign(createDto, createMutation, form, data, () => {
        setCurrentMode(formType.VIEW);
      });
    } else {
      const originalVendors = campaignData?.vendor?.map((v) => v.id) || [];
      const newVendors = data.vendors || [];
      const { add, update, remove } = calculateVendorOperations(originalVendors, newVendors);

      const updateDto = transformToUpdateDto(data, add, update, remove);
      await updateCampaign(updateDto, updateMutation, form, () => {
        setCurrentMode(formType.VIEW);
      });
    }
  };

  const isViewMode = currentMode === formType.VIEW;

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {currentMode === formType.ADD
            ? "Create Campaign"
            : currentMode === formType.EDIT
              ? "Edit Campaign"
              : "View Campaign"}
        </h1>
        <div className="space-x-2">
          {currentMode === formType.VIEW && (
            <Button onClick={() => setCurrentMode(formType.EDIT)}>Edit</Button>
          )}
          {currentMode === formType.EDIT && (
            <Button variant="outline" onClick={() => setCurrentMode(formType.VIEW)}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Tabs defaultValue="overview">
            <TabsList className={"mt-4"}>
              <TabsTrigger className={"w-full h-6"} value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="w-full h-6" value="vendor">
                Vendor
              </TabsTrigger>
              <TabsTrigger className="w-full h-6" value="setting">
                Setting
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-2">
              <TabOverview form={form} isViewMode={isViewMode} campaignData={campaignData} />
            </TabsContent>
            <TabsContent value="vendor" className="mt-2">
              <TabVendor form={form} isViewMode={isViewMode} vendors={vendors} />
            </TabsContent>
            <TabsContent value="setting" className="mt-2">
              <TabSetting
                form={form}
                isViewMode={isViewMode}
                reminderFields={reminderFields}
                appendReminder={appendReminder}
                removeReminder={removeReminder}
                escalationFields={escalationFields}
                appendEscalation={appendEscalation}
                removeEscalation={removeEscalation}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {!isViewMode && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit">{currentMode === formType.ADD ? "Create" : "Update"}</Button>
            </div>
          )}
        </form>
      </Form>
    </main>
  );
}

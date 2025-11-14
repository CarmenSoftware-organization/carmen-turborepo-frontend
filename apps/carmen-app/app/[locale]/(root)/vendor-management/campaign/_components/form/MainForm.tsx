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
import SettingTab from "./SettingTab";
import OverviewTab from "./OverviewTab";
import { campaignFormSchema, CampaignFormValues } from "../../_schema/campaign.schema";
import {
  transformToCreateDto,
  transformToUpdateDto,
  calculateVendorOperations,
} from "../../_helper/transform-campaign-form";
import { createCampaign } from "../../_handlers/campaign-create.handlers";
import { updateCampaign } from "../../_handlers/campaign-update.handlers";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import VendorTab from "./VendorTab";

interface Props {
  readonly campaignData?: CampaignDetailDto;
  readonly mode: formType;
}

export default function MainForm({ campaignData, mode }: Props) {
  const router = useRouter();
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
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/vendor-management/campaign")}
            variant={"outlinePrimary"}
            size={"sm"}
            className="h-8 w-8"
          >
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentMode === formType.ADD && "Create New Campaign"}
              {currentMode === formType.EDIT && "Edit Campaign"}
              {currentMode === formType.VIEW && campaignData?.name}
            </h1>
            {campaignData && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(campaignData.update_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentMode === formType.VIEW && (
            <Button onClick={() => setCurrentMode(formType.EDIT)}>Edit Campaign</Button>
          )}
          {currentMode === formType.EDIT && (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.reset();
                  setCurrentMode(formType.VIEW);
                }}
              >
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset Changes
              </Button>
              <Button type="submit" form="campaign-form">
                Save Changes
              </Button>
            </>
          )}
          {currentMode === formType.ADD && (
            <>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Clear Form
              </Button>
              <Button type="submit" form="campaign-form">
                Create Campaign
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-hidden mt-4">
        <Form {...form}>
          <form id="campaign-form" onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            <Tabs defaultValue="overview" className="flex h-full flex-col">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vendor">Vendors</TabsTrigger>
                <TabsTrigger value="setting">Settings & Automation</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="mt-0 h-full">
                  <OverviewTab form={form} isViewMode={isViewMode} campaignData={campaignData} />
                </TabsContent>
                <TabsContent value="vendor" className="mt-0 h-full">
                  <VendorTab form={form} isViewMode={isViewMode} vendors={vendors} />
                </TabsContent>
                <TabsContent value="setting" className="mt-0 h-full">
                  <SettingTab
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
              </div>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}

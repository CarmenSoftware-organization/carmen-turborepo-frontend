"use client";

import { Button } from "@/components/ui/button";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useCreateRfp, useUpdateRfp } from "@/hooks/use-rfp";
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
import { rfpFormSchema, RfpFormValues } from "../../_schema/rfp.schema";
import {
  transformToCreateDto,
  transformToUpdateDto,
  calculateVendorOperations,
} from "../../_helper/transform-rfp-form";
import { createRfp } from "../../_handlers/rfp-create.handlers";
import { updateRfp } from "../../_handlers/rfp-update.handlers";
import { ChevronLeft, PenBoxIcon, Save, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import VendorTab from "./VendorTab";

interface Props {
  readonly rfpData?: RfpDetailDto;
  readonly mode: formType;
}

export default function MainForm({ rfpData, mode }: Props) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const { token, buCode } = useAuth();
  const { vendors } = useVendor(token, buCode);

  const form = useForm<RfpFormValues>({
    resolver: zodResolver(rfpFormSchema),
    defaultValues: {
      name: rfpData?.name || "",
      status: rfpData?.status || "draft",
      description: rfpData?.description || "",
      valid_period: rfpData?.valid_period || 90,
      template_id: rfpData?.template?.id || "",
      portal_duration: rfpData?.settings?.portal_duration || 14,
      rfp_type: rfpData?.settings?.rfp_type || "buy",
      submission_method: rfpData?.settings?.submission_method || "auto",
      require_approval: rfpData?.settings?.require_approval || false,
      auto_reminder: rfpData?.settings?.auto_reminder || false,
      priority: rfpData?.settings?.priority || "medium",
      instructions: rfpData?.settings?.instructions || "",
      reminders: rfpData?.settings?.reminders || [],
      escalations: rfpData?.settings?.escalations || [],
      vendors: rfpData?.vendor?.map((v) => v.id) || [],
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

  const createMutation = useCreateRfp(token, buCode);
  const updateMutation = useUpdateRfp(token, buCode, rfpData?.id || "");

  const onSubmit = async (data: RfpFormValues): Promise<void> => {
    const isCreating = currentMode === formType.ADD;

    if (isCreating) {
      const createDto = transformToCreateDto(data);
      await createRfp(createDto, createMutation, form, data, () => {
        setCurrentMode(formType.VIEW);
      });
    } else {
      const originalVendors = rfpData?.vendor?.map((v) => v.id) || [];
      const newVendors = data.vendors || [];
      const { add, update, remove } = calculateVendorOperations(originalVendors, newVendors);

      const updateDto = transformToUpdateDto(data, add, update, remove);
      await updateRfp(updateDto, updateMutation, form, () => {
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
            onClick={() => router.push("/vendor-management/rfp")}
            variant={"outlinePrimary"}
            size={"sm"}
            className="h-8 w-8"
          >
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentMode === formType.ADD && "Create New Request for Pricing"}
              {currentMode === formType.EDIT && "Edit Request for Pricing"}
              {currentMode === formType.VIEW && rfpData?.name}
            </h1>
            {rfpData && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(rfpData.update_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentMode === formType.VIEW && (
            <Button size="sm" onClick={() => setCurrentMode(formType.EDIT)}>
              <PenBoxIcon />
            </Button>
          )}
          {currentMode === formType.EDIT && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset();
                  setCurrentMode(formType.VIEW);
                }}
              >
                <X />
              </Button>
              <Button type="submit" form="rfp-form" size="sm">
                <Save />
              </Button>
            </>
          )}
          {currentMode === formType.ADD && (
            <>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Clear Form
              </Button>
              <Button type="submit" form="rfp-form">
                Create RFP
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden mt-4">
        <Form {...form}>
          <form id="rfp-form" onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            <Tabs defaultValue="overview" className="flex h-full flex-col">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vendor">Vendors</TabsTrigger>
                <TabsTrigger value="setting">Settings & Automation</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="mt-0 h-full">
                  <OverviewTab form={form} isViewMode={isViewMode} rfpData={rfpData} />
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

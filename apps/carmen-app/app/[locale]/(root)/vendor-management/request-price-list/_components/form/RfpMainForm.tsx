"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formType } from "@/dtos/form.dto";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import { RfpFormValues, rfpFormSchema } from "../../_schema/rfp.schema";
import { Form } from "@/components/form-custom/form";
import { Button } from "@/components/ui/button";
import { Save, X, PenBoxIcon, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/hooks/use-vendor";
import { useCreateRfp, useUpdateRfp } from "@/hooks/use-rfp";
import { createRfp } from "../../_handlers/rfp-create.handlers";
import { updateRfp } from "../../_handlers/rfp-update.handlers";
import { transformToCreateDto, transformToUpdateDto } from "../../_helper/transform-rfp-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { usePriceListTemplates } from "@/hooks/use-price-list-template";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import OverviewTab from "./OverviewTab";
import VendorsTab from "./VendorsTab";
import { useTranslations } from "next-intl";

interface Props {
  readonly rfpData?: RfpDetailDto;
  readonly mode: formType;
}

export default function RfpMainForm({ rfpData, mode }: Props) {
  const router = useRouter();
  const tRfp = useTranslations("RFP");
  const { token, buCode } = useAuth();
  const { data: templates } = usePriceListTemplates(token, buCode);

  const { vendors } = useVendor(token, buCode, { perpage: -1 });

  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const isViewMode = currentMode === formType.VIEW;

  const form = useForm<RfpFormValues>({
    resolver: zodResolver(rfpFormSchema),
    mode: "onChange",
    defaultValues: {
      name: rfpData?.name || "",
      status: rfpData?.status || "draft",
      start_date: rfpData?.start_date,
      end_date: rfpData?.end_date,
      custom_message: rfpData?.custom_message || "",
      pricelist_template_id: rfpData?.pricelist_template?.id || "",
      dimension: rfpData?.dimension || "",
      info: typeof rfpData?.info === "string" ? rfpData.info : JSON.stringify(rfpData?.info || {}),
      vendors: {
        add: [],
        remove: [],
      },
    },
  });

  useEffect(() => {
    if (rfpData) {
      form.reset({
        name: rfpData.name || "",
        status: rfpData.status || "draft",
        start_date: rfpData.start_date,
        end_date: rfpData.end_date,
        custom_message: rfpData.custom_message || "",
        pricelist_template_id: rfpData.pricelist_template?.id || "",
        dimension: rfpData.dimension || "",
        info: typeof rfpData.info === "string" ? rfpData.info : JSON.stringify(rfpData?.info || {}),
        vendors: {
          add: [],
          remove: [],
        },
      });
    }
  }, [rfpData, form]);

  const createMutation = useCreateRfp(token, buCode);
  const updateMutation = useUpdateRfp(token, buCode, rfpData?.id || "");

  const onSubmit = async (data: RfpFormValues) => {
    if (currentMode === formType.ADD) {
      const dto = transformToCreateDto(data, vendors?.data || []);
      await createRfp(dto, createMutation, form, data, (result) => {
        const newId = result?.data?.id || result?.id;
        if (result.success) {
          toastSuccess({
            message: tRfp("create_success"),
          });
          router.replace(`/vendor-management/request-price-list/${newId}`);
          setCurrentMode(formType.VIEW);
        } else {
          toastError({
            message: result.message,
          });
        }
      });
    } else {
      const originalVendorIds = rfpData?.vendors?.map((v) => v.vendor_id) || [];
      const dto = transformToUpdateDto(data, vendors?.data || [], originalVendorIds);
      await updateRfp(dto, updateMutation, form, (result) => {
        if (result.success) {
          toastSuccess({
            message: tRfp("update_success"),
          });
          setCurrentMode(formType.VIEW);
        } else {
          toastError({
            message: result.message,
          });
        }
      });
    }
  };

  return (
    <div className="flex h-full flex-col p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outlinePrimary"
            size="sm"
            className="h-8 w-8"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">
            {currentMode === formType.ADD ? tRfp("create_new") : rfpData?.name}
          </h1>
        </div>

        <div className="flex gap-2">
          {isViewMode ? (
            <Button size="sm" onClick={() => setCurrentMode(formType.EDIT)}>
              <PenBoxIcon className="h-4 w-4" />
              {tRfp("edit")}
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setCurrentMode(formType.VIEW)}>
                <X className="h-4 w-4" />
                {tRfp("cancel")}
              </Button>
              <Button size="sm" onClick={form.handleSubmit(onSubmit)}>
                <Save className="h-4 w-4" />
                {tRfp("save")}
              </Button>
            </>
          )}
        </div>
      </div>

      <Form {...form}>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList>
              <TabsTrigger value="overview">{tRfp("tab_overview")}</TabsTrigger>
              <TabsTrigger value="vendors">{tRfp("tab_vendors")}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="overview">
                <OverviewTab form={form} isViewMode={isViewMode} templates={templates} />
              </TabsContent>
              <TabsContent value="vendors">
                <VendorsTab
                  form={form}
                  isViewMode={isViewMode}
                  rfpData={rfpData}
                  vendors={vendors?.data || []}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Form>
    </div>
  );
}

"use client";

import DetailsAndComments from "@/components/DetailsAndComments";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import ActionFields from "./ActionFields";
import HeadPrtForm from "./HeadPrtForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseRequestTemplateDto } from "@/dtos/pr-template.dto";
import { Form } from "@/components/form-custom/form";
import PrtItems from "./PrtItems";
import { PrtFormValues } from "../../_schema/prt.schema";
import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { useCreatePrTemplate, useDeletePrTemplate, useUpdatePrTemplate } from "@/hooks/use-pr-tmpl";
import { useRouter } from "@/lib/navigation";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface PrtFormProps {
  readonly prtData?: PurchaseRequestTemplateDto;
  readonly mode: formType;
}
export default function PrtForm({ prtData, mode }: PrtFormProps) {
  const { buCode, departments, token } = useAuth();
  const { defaultCurrencyId } = useBuConfig();
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: createMutate, isPending: isCreating } = useCreatePrTemplate(token, buCode);
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePrTemplate(
    token,
    buCode,
    prtData?.id ?? ""
  );
  const { mutate: deleteMutate, isPending: isDeleting } = useDeletePrTemplate(token, buCode);

  const isPending = isCreating || isUpdating || isDeleting;

  const defaultValues: PrtFormValues = prtData
    ? {
        id: prtData.id,
        name: prtData.name,
        description: prtData.description,
        workflow_id: prtData.workflow_id,
        workflow_name: prtData.workflow_name,
        department_id: prtData.department_id,
        department_name: prtData.department_name,
        is_active: prtData.is_active,
        note: prtData.note,
      }
    : {
        name: "",
        description: "",
        workflow_id: "",
        department_id: departments?.id,
        is_active: true,
        note: "",
      };

  const form = useForm<PrtFormValues>({
    defaultValues,
    values: prtData
      ? {
          id: prtData.id,
          name: prtData.name,
          description: prtData.description,
          workflow_id: prtData.workflow_id,
          workflow_name: prtData.workflow_name,
          department_id: prtData.department_id,
          department_name: prtData.department_name,
          is_active: prtData.is_active,
          note: prtData.note,
        }
      : undefined,
  });

  const watchName = form.watch("name");
  const watchWorkflowId = form.watch("workflow_id");
  const canSubmit = Boolean(watchName && watchWorkflowId);

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!prtData?.id) return;
    deleteMutate(prtData.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toastSuccess({ message: tPurchaseRequest("delete_prt_success") });
        router.push("/procurement/purchase-request-template");
      },
      onError: () => {
        toastError({ message: tPurchaseRequest("delete_prt_failed") });
      },
    });
  };

  const onSubmit = (data: PrtFormValues) => {
    if (currentMode === formType.ADD) {
      createMutate(data, {
        onSuccess: (response) => {
          toastSuccess({ message: tPurchaseRequest("add_prt_success") });
          setCurrentMode(formType.VIEW);
          router.replace(`/procurement/purchase-request-template/${response.data.id}`);
        },
        onError: () => {
          toastError({ message: tPurchaseRequest("add_prt_failed") });
        },
      });
    } else if (currentMode === formType.EDIT && prtData?.id) {
      updateMutate(data, {
        onSuccess: () => {
          toastSuccess({ message: tPurchaseRequest("update_prt_success") });
          setCurrentMode(formType.VIEW);
        },
        onError: () => {
          toastError({ message: tPurchaseRequest("update_prt_failed") });
        },
      });
    }
  };

  return (
    <DetailsAndComments>
      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ActionFields
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
              title={prtData?.name ?? ""}
              isPending={isPending}
              canSubmit={canSubmit}
              onDelete={prtData?.id ? handleOpenDeleteDialog : undefined}
              isDeleting={isDeleting}
            />
            <HeadPrtForm
              form={form}
              currentMode={currentMode}
              buCode={buCode}
              departName={departments?.name ?? ""}
              workflowName={prtData?.workflow_name}
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
                  buCode={buCode}
                  token={token}
                  defaultCurrencyId={defaultCurrencyId ?? ""}
                />
              </TabsContent>
              <TabsContent value="budget">
                <h1>Budget</h1>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </Card>
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tPurchaseRequest("delete_prt_title")}
        description={tPurchaseRequest("delete_prt_desc")}
        isLoading={isDeleting}
      />
    </DetailsAndComments>
  );
}

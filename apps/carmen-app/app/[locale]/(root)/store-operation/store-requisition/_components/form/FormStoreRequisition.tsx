"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { SrByIdDto, SrCreate, SrCreateSchema } from "@/dtos/sr.dto";
import {
  ArrowLeftRightIcon,
  CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Printer,
  Save,
  Trash2,
  X,
  XCircle,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import CommentStoreRequisition from "../CommentStoreRequisition";
import ActivityLogStoreRequisition from "../ActivityLogStoreRequisition";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import StoreRequisitionFormHeader from "./StoreRequisitionFormHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemStoreRequisition from "./ItemStoreRequisition";
import { mockJournalEntries, mockStockMovement } from "@/mock-data/store-operation";
import StockMovement from "./StockMovement";
import SrJournalEntries from "./SrJournalEntries";
import TransactionSummary from "../TransactionSummary";
import JsonViewer from "@/components/JsonViewer";
import { useAuth } from "@/context/AuthContext";
import { useCreateSr, useUpdateSr, useDeleteSr, srKey, srDetailKey } from "@/hooks/use-sr";
import { useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface Props {
  readonly initData?: SrByIdDto;
  readonly mode: formType;
}

export default function FormStoreRequisition({ initData, mode }: Props) {
  const { user, departments, token, buCode } = useAuth();
  const t = useTranslations("StoreRequisition");

  const [openLog, setOpenLog] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const router = useRouter();

  const getNextDay = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  };

  const form = useForm<SrCreate>({
    resolver: zodResolver(SrCreateSchema),
    defaultValues: {
      state_role: "create",
      details: {
        doc_version: initData?.doc_version ?? 1,
        sr_date: initData?.sr_date ?? (mode === formType.ADD ? getNextDay() : ""),
        expected_date: initData?.expected_date ?? (mode === formType.ADD ? getNextDay() : ""),
        description: initData?.description ?? "",
        requestor_id: user?.data.id ?? "",
        workflow_id: initData?.workflow_id ?? "",
        department_id: departments?.id ?? "",
        from_location_id: initData?.from_location_id ?? "",
        to_location_id: initData?.to_location_id ?? "",
        store_requisition_detail: {},
      },
    },
  });

  const requestorName = user?.data.user_info.firstname + " " + user?.data.user_info.lastname;
  const queryClient = useQueryClient();

  const createSrMutation = useCreateSr(token, buCode);
  const updateSrMutation = useUpdateSr(token, buCode, initData?.id ?? "");
  const deleteSrMutation = useDeleteSr(token, buCode);

  const handleOpenLog = () => {
    setOpenLog(!openLog);
  };

  const onSubmit = (data: SrCreate) => {
    if (currentMode === formType.ADD) {
      createSrMutation.mutate(data, {
        onSuccess: (response) => {
          toastSuccess({ message: t("toast.createSuccess") });
          queryClient.invalidateQueries({ queryKey: [srKey, buCode] });
          const res = response as { data?: { id?: string } };
          const newId = res?.data?.id;
          if (newId) {
            router.replace(`/store-operation/store-requisition/${newId}`);
            setCurrentMode(formType.VIEW);
          }
        },
        onError: (error) => {
          toastError({
            message: error instanceof Error ? error.message : t("toast.createError"),
          });
        },
      });
    } else if (currentMode === formType.EDIT) {
      updateSrMutation.mutate(data, {
        onSuccess: () => {
          toastSuccess({ message: t("toast.updateSuccess") });
          queryClient.invalidateQueries({ queryKey: [srKey, buCode] });
          queryClient.invalidateQueries({ queryKey: [srDetailKey, buCode, initData?.id] });
          // Clear new items after successful save to prevent duplicate display
          form.setValue("details.store_requisition_detail.add", []);
          setCurrentMode(formType.VIEW);
        },
        onError: (error) => {
          toastError({
            message: error instanceof Error ? error.message : t("toast.updateError"),
          });
        },
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMode(formType.EDIT);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentMode === formType.ADD || currentMode === formType.VIEW) {
      router.push("/store-operation/store-requisition");
    } else {
      setCurrentMode(formType.VIEW);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!initData?.id) return;

    deleteSrMutation.mutate(initData.id, {
      onSuccess: () => {
        toastSuccess({ message: t("toast.deleteSuccess") });
        queryClient.invalidateQueries({ queryKey: [srKey, buCode] });
        setOpenDeleteDialog(false);
        router.push("/store-operation/store-requisition");
      },
      onError: (error) => {
        toastError({
          message: error instanceof Error ? error.message : t("toast.deleteError"),
        });
      },
    });
  };

  return (
    <div className="relative">
      <div className="flex gap-4 relative">
        <ScrollArea
          className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href="/store-operation/store-requisition">
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <p className="text-lg font-bold">
                      {mode === formType.ADD ? t("title") : `${initData?.sr_no}`}
                    </p>
                    <Badge className="rounded-full">{initData?.doc_status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentMode === formType.VIEW ? (
                      <>
                        <Button variant="outline" size={"sm"} onClick={handleCancelClick}>
                          <ChevronLeft className="h-4 w-4" /> {t("buttons.back")}
                        </Button>
                        <Button variant="default" size={"sm"} onClick={handleEditClick}>
                          <Pencil className="h-4 w-4" /> {t("buttons.edit")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size={"sm"}
                          onClick={handleCancelClick}
                          disabled={createSrMutation.isPending || updateSrMutation.isPending}
                        >
                          <X className="h-4 w-4" /> {t("buttons.cancel")}
                        </Button>
                        <Button
                          variant="default"
                          size={"sm"}
                          type="submit"
                          disabled={createSrMutation.isPending || updateSrMutation.isPending}
                        >
                          <Save className="h-4 w-4" />
                          {createSrMutation.isPending || updateSrMutation.isPending
                            ? t("buttons.saving")
                            : t("buttons.save")}
                        </Button>
                      </>
                    )}
                    <Button type="button" variant="outline" size="sm">
                      <Printer className="h-4 w-4" />
                      {t("buttons.print")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive/80"
                    >
                      <XCircle className="h-4 w-4" />
                      {t("buttons.void")}
                    </Button>
                    {currentMode === formType.EDIT && (
                      <Button
                        type="button"
                        variant={"destructive"}
                        size={"sm"}
                        onClick={handleDeleteClick}
                        disabled={deleteSrMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleteSrMutation.isPending ? t("buttons.deleting") : t("buttons.delete")}
                      </Button>
                    )}
                  </div>
                </div>
                <StoreRequisitionFormHeader
                  control={form.control}
                  mode={currentMode}
                  buCode={buCode}
                  departmentName={departments?.name}
                  requestorName={requestorName}
                />
              </Card>
              <ItemStoreRequisition
                mode={currentMode}
                form={form}
                itemsSr={initData?.store_requisition_detail}
              />
              {/* <Tabs defaultValue="items" className="mt-2">
                <TabsList>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="stockMovement">Stock Movement</TabsTrigger>
                  <TabsTrigger value="journalEntries">Journal Entries</TabsTrigger>
                </TabsList>
                <TabsContent value="items">
                  <ItemStoreRequisition
                    mode={currentMode}
                    form={form}
                    itemsSr={initData?.store_requisition_detail}
                  />
                </TabsContent>
                <TabsContent value="stockMovement">
                  <StockMovement items={mockStockMovement} mode={currentMode} />
                </TabsContent>
                <TabsContent value="journalEntries">
                  <SrJournalEntries mode={currentMode} jeItems={mockJournalEntries} />
                </TabsContent>
              </Tabs> */}
              {/* <TransactionSummary /> */}
            </form>
          </Form>
          {/* <JsonViewer data={form.watch()} title="Sr payload" /> */}
          <div className="fixed bottom-6 right-6 flex gap-2 z-50">
            <Button size={"sm"}>
              <CheckCircleIcon className="w-5 h-5" />
              {t("buttons.approve")}
            </Button>
            <Button variant={"destructive"} size={"sm"}>
              <XCircleIcon className="w-5 h-5" />
              {t("buttons.reject")}
            </Button>
            <Button variant={"outline"} size={"sm"}>
              <ArrowLeftRightIcon className="w-5 h-5" />
              {t("buttons.sendBack")}
            </Button>
          </div>
        </ScrollArea>
        {openLog && (
          <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
            <div className="flex flex-col gap-4">
              <CommentStoreRequisition />
              <ActivityLogStoreRequisition />
            </div>
          </div>
        )}
      </div>
      <Button
        aria-label={openLog ? "Close log panel" : "Open log panel"}
        onClick={handleOpenLog}
        variant="default"
        size="sm"
        className="fixed right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-l-full rounded-r-none z-50 shadow-lg transition-all duration-300 hover:bg-primary/90 hover:translate-x-0 focus:outline-none focus:ring-2 focus:ring-primary"
        tabIndex={0}
      >
        {openLog ? (
          <ChevronRight className="h-6 w-6 animate-pulse" />
        ) : (
          <ChevronLeft className="h-6 w-6 animate-pulse" />
        )}
      </Button>

      <DeleteConfirmDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={t("dialog.deleteTitle")}
        description={t("dialog.deleteDescription", { srNo: initData?.sr_no ?? t("title") })}
        isLoading={deleteSrMutation.isPending}
      />
    </div>
  );
}

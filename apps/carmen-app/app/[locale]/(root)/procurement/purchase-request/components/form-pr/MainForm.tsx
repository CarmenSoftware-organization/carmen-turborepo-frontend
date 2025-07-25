"use client";

import JsonViewer from "@/components/JsonViewer";
import { formType } from "@/dtos/form.dto";
import { CreatePurchaseRequestSchema, PurchaseRequestByIdDto, PurchaseRequestCreateFormDto, PurchaseRequestDetail, PurchaseRequestUpdateFormDto, UpdatePurchaseRequestDetailDto, UpdatePurchaseRequestSchema } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { mockPr } from "./payload-pr";
import ActionFields from "./ActionFields";
import HeadForm from "./HeadForm";
import StatusPrInfo from "./StatusPrInfo";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeftRightIcon, CheckCircleIcon, ChevronRight, ChevronLeft, XCircleIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormDisplay from "./FormDisplay";
import ItemsPr from "./ItemsPr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface UpdatableItem extends PurchaseRequestDetail {
    isDirty: boolean;
}

export type DeletionTarget =
    | { type: "pristine"; item: UpdatableItem }
    | { type: "update"; index: number }
    | { type: "add"; index: number };

interface Props {
    mode: formType;
    initValues?: PurchaseRequestByIdDto;
}

export default function MainForm({ mode, initValues }: Props) {
    const [currentFormType, setCurrentFormType] = useState<formType>(mode);
    const { user, departments } = useAuth();
    const [updatableItems, setUpdatableItems] = useState<UpdatableItem[]>([]);
    const [deletionTarget, setDeletionTarget] = useState<DeletionTarget | null>(null);
    const [openLog, setOpenLog] = useState(false);

    const form = useForm<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>({
        resolver: (data, context, options) => {
            const schema =
                currentFormType === formType.ADD
                    ? CreatePurchaseRequestSchema
                    : UpdatePurchaseRequestSchema;
            return zodResolver(schema)(data, context, options);
        },
        defaultValues: {
            pr_date: format(new Date(), "yyyy-MM-dd"),
            description: "",
            requestor_id: user?.id,
            department_id: departments?.id,
            workflow_id: "",
            note: "",
            purchase_request_detail: {
                add: [],
                update: [],
                remove: [],
            },
        },
        mode: "onBlur",
    });

    const {
        fields: addFields,
        append: addAppend,
        remove: addRemove,
    } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.add",
    });

    const {
        fields: updateFields,
        append: updateAppend,
        remove: updateRemove,
    } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.update",
    });

    useEffect(() => {
        if (currentFormType === formType.EDIT && initValues) {
            form.reset({
                pr_date: initValues.pr_date || format(new Date(), "yyyy-MM-dd"),
                description: initValues.description || "",
                requestor_id: user?.id,
                department_id: departments?.id,
                workflow_id: initValues.workflow_id || "",
                note: initValues.note || "",
                purchase_request_detail: {
                    add: [],
                    update: [],
                    remove: [],
                },
            });

            // Set pristine items for editing
            setUpdatableItems(
                initValues.purchase_request_detail?.map((item) => ({
                    ...item,
                    isDirty: false
                })) || []
            );
        } else if (currentFormType === formType.VIEW && initValues) {
            form.reset({
                pr_date: initValues.pr_date || format(new Date(), "yyyy-MM-dd"),
                description: initValues.description || "",
                requestor_id: user?.id,
                department_id: departments?.id,
                workflow_id: initValues.workflow_id || "",
                note: initValues.note || "",
                purchase_request_detail: {
                    add: [],
                    update: [],
                    remove: [],
                },
            });
            // In VIEW mode, show all items as read-only updatable items
            setUpdatableItems(
                initValues.purchase_request_detail?.map((item) => ({
                    ...item,
                    isDirty: false
                })) || []
            );
        } else if (currentFormType === formType.ADD) {
            form.reset({
                pr_date: format(new Date(), "yyyy-MM-dd"),
                description: "",
                requestor_id: user?.id,
                department_id: departments?.id,
                workflow_id: "",
                note: "",
                purchase_request_detail: {
                    add: [],
                    update: [],
                    remove: [],
                },
            });
            setUpdatableItems([]);
        }
    }, [currentFormType, initValues, form, user?.id, departments?.id]);

    const handleSubmit = (data: PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto) => {
        console.log(data);
    }

    const watchForm = form.watch();

    const selectedProductIds = useMemo(() => {
        const ids = new Set<string>();
        watchForm.purchase_request_detail?.add?.forEach((item) => item.product_id && ids.add(item.product_id));
        if (watchForm.purchase_request_detail && "update" in watchForm.purchase_request_detail) {
            watchForm.purchase_request_detail.update?.forEach((item) => item.product_id && ids.add(item.product_id));
        }
        updatableItems.forEach((item) => !item.isDirty && item.product_id && ids.add(item.product_id));
        return ids;
    }, [watchForm.purchase_request_detail, updatableItems]);

    const handleRemovePristineItem = (item: UpdatableItem) => {
        const detail = form.getValues("purchase_request_detail");
        if (detail && "remove" in detail) {
            const currentRemoved = detail.remove || [];
            form.setValue("purchase_request_detail.remove", [...currentRemoved, { id: item.id }]);
        }
        setUpdatableItems((currentItems) => currentItems.filter((i) => i.id !== item.id));
    };

    const handleRemoveUpdateItem = (index: number) => {
        const detail = watchForm.purchase_request_detail;
        if (detail && "update" in detail && detail.update) {
            const itemToRemove = detail.update[index];
            if (itemToRemove?.id) {
                const currentRemoved = ("remove" in detail && detail.remove) || [];
                form.setValue("purchase_request_detail.remove", [...currentRemoved, { id: itemToRemove.id }]);
            }
        }
        updateRemove(index);
    };

    const handleConfirmDelete = () => {
        if (!deletionTarget) return;
        switch (deletionTarget.type) {
            case "pristine":
                handleRemovePristineItem(deletionTarget.item);
                break;
            case "update":
                handleRemoveUpdateItem(deletionTarget.index);
                break;
            case "add":
                addRemove(deletionTarget.index);
                break;
        }
        setDeletionTarget(null);
    };

    const handleAddNewItem = () => {
        addAppend({
            location_id: "",
            product_id: "",
            inventory_unit_id: "",
            description: "",
            requested_qty: 0,
            requested_unit_id: "",
            delivery_date: new Date(),
        });
    };

    const handleProductSelect = (
        productId: string,
        context: { type: "add" | "update"; index: number } | { type: "pristine"; item: UpdatableItem }
    ) => {
        if (context.type === "pristine") {
            const { isDirty, ...itemForRHF } = { ...context.item };

            const itemToAppend: UpdatePurchaseRequestDetailDto = {
                id: itemForRHF.id,
                description: itemForRHF.description,
                comment: itemForRHF.comment,
                sequence_no: itemForRHF.sequence_no,
                product_id: itemForRHF.product_id,
                inventory_unit_id: itemForRHF.inventory_unit_id,
                location_id: itemForRHF.location_id,
                delivery_point_id: itemForRHF.delivery_point_id,
                delivery_date: itemForRHF.delivery_date ? new Date(itemForRHF.delivery_date) : new Date(),
                vendor_id: itemForRHF.vendor_id,
                requested_qty: itemForRHF.requested_qty,
                requested_unit_id: itemForRHF.requested_unit_id,
                tax_profile_id: itemForRHF.tax_profile_id ?? undefined,
                discount_rate: itemForRHF.discount_rate,
                is_discount_adjustment: itemForRHF.is_discount_adjustment,
                currency_id: itemForRHF.currency_id,
                exchange_rate: itemForRHF.exchange_rate,
                exchange_rate_date: itemForRHF.exchange_rate_date ? new Date(itemForRHF.exchange_rate_date) : undefined,
                info: itemForRHF.info,
                dimension: itemForRHF.dimension,
                approved_qty: itemForRHF.approved_qty,
                approved_unit_id: itemForRHF.approved_unit_id,
                foc_qty: itemForRHF.foc_qty,
                foc_unit_id: itemForRHF.foc_unit_id,
            };

            // @ts-ignore
            updateAppend(itemToAppend);
            setUpdatableItems((current) => current.filter((i) => i.id !== context.item.id));
        } else {
            // Update product selection for add/update arrays
            form.setValue(`purchase_request_detail.${context.type}.${context.index}.product_id`, productId);
            // You can add logic here to fetch product details and update other fields
            // form.setValue(`purchase_request_detail.${context.type}.${context.index}.inventory_unit_id`, productInfo.unit_id);
        }
    };

    return (
        <div className="relative">

            <div className="flex gap-4 relative">
                <ScrollArea
                    className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <ActionFields
                                mode={mode}
                                currentMode={currentFormType}
                                initValues={initValues}
                                onModeChange={setCurrentFormType}
                            />
                            <div className="flex flex-col md:flex-row gap-2">
                                <HeadForm
                                    form={form}
                                    mode={currentFormType}
                                    pr_no={initValues?.pr_no}
                                    requestor_name={initValues?.requestor_name}
                                    department_name={initValues?.department_name}
                                    workflow_id={initValues?.workflow_id}
                                />
                                <StatusPrInfo
                                    create_date={initValues?.created_at}
                                    status={initValues?.pr_status}
                                />
                            </div>

                            <Tabs defaultValue="items">
                                <TabsList className="w-full h-8">
                                    <TabsTrigger className="w-full text-xs" value="items">
                                        Items
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full text-xs" value="budget">
                                        Budget
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full text-xs" value="workflow">
                                        Workflow
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="items" className="mt-2">
                                    <ItemsPr
                                        form={form}
                                        currentFormType={currentFormType}
                                        updatableItems={updatableItems}
                                        selectedProductIds={selectedProductIds}
                                        addFields={addFields}
                                        updateFields={updateFields}
                                        handleAddNewItem={handleAddNewItem}
                                        handleProductSelect={handleProductSelect}
                                        setDeletionTarget={setDeletionTarget}
                                    />
                                </TabsContent>
                                <TabsContent value="budget" className="mt-2">
                                    Budget Pr
                                </TabsContent>
                                <TabsContent value="workflow" className="mt-2">
                                    Workflow Pr
                                </TabsContent>
                            </Tabs>
                        </form>
                    </Form>
                    <div className="grid grid-cols-2 gap-4">
                        <JsonViewer data={watchForm} title="Form Values" />
                        <JsonViewer data={mockPr} title="Mock Data" />
                    </div>
                    <JsonViewer data={initValues ?? {}} title="Init Data" />
                    <div
                        className={`fixed bottom-6 ${openLog ? "right-1/4" : "right-6"} flex gap-2 z-50 bg-background border shadow-lg p-2 rounded-lg`}
                    >
                        <Button size={"sm"} className="h-7 px-2 text-xs">
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                        </Button>
                        <Button
                            variant={"destructive"}
                            size={"sm"}
                            className="h-7 px-2 text-xs"
                        >
                            <XCircleIcon className="w-4 h-4" />
                            Reject
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className="h-7 px-2 text-xs"
                        >
                            <ArrowLeftRightIcon className="w-4 h-4" />
                            Send Back
                        </Button>
                    </div>
                </ScrollArea>
                {openLog && (
                    <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
                        <p className="flex flex-col gap-4">hello</p>
                    </div>
                )}

            </div>

            <Button
                aria-label={openLog ? "Close log panel" : "Open log panel"}
                onClick={() => setOpenLog(!openLog)}
                variant="default"
                size="sm"
                className="fixed right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-l-full rounded-r-none z-50 shadow-lg"
            >
                {openLog ? (
                    <ChevronRight className="h-6 w-6" />
                ) : (
                    <ChevronLeft className="h-6 w-6" />
                )}
            </Button>

            <AlertDialog open={!!deletionTarget} onOpenChange={(isOpen) => !isOpen && setDeletionTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            item from the list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
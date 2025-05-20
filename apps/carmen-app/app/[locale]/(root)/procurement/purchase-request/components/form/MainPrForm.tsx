"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto, PurchaseRequestPostDto, purchaseRequestSchema } from "@/dtos/pr.dto";
import { Link, useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, MessageCircle, Pencil, Printer, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HeadPrForm from "./HeadPrForm";
import { Card } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import ItemPr from "./ItemPr";

interface MainPrFormProps {
    readonly mode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
    readonly docType?: string;
}
export default function MainPrForm({ mode, initValues, docType }: MainPrFormProps) {
    const router = useRouter();
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [currentMode, setCurrentMode] = useState<formType>(mode);

    const defaultValues: Partial<PurchaseRequestPostDto> = {
        pr_date: initValues?.pr_date ?? new Date().toISOString(),
        workflow_id: "",
        current_workflow_status: "",
        pr_status: initValues?.pr_status ?? "",
        requestor_id: initValues?.requestor_id ?? "",
        department_id: initValues?.department_id ?? "",
        is_active: initValues?.is_active ?? true,
        doc_version: typeof initValues?.doc_version === 'string' ? parseInt(initValues.doc_version, 10) : (initValues?.doc_version ?? 1),
        note: initValues?.note ?? "",
        description: initValues?.description ?? "",
        info: {
            priority: initValues?.info?.priority ?? "",
            budget_code: initValues?.info?.budget_code ?? "",
        },
        dimension: {
            cost_center: initValues?.dimension?.cost_center ?? "",
            project: initValues?.dimension?.project ?? "",
        },
        purchase_request_detail: {
            add: initValues?.purchase_request_detail
                ? initValues.purchase_request_detail.map(item => ({
                    location_id: item.location_id,
                    product_id: item.product_id,
                    vendor_id: item.vendor_id,
                    price_list_id: item.price_list_id,
                    description: item.description,
                    requested_qty: item.requested_qty,
                    requested_unit_id: item.requested_unit_id,
                    approved_qty: item.approved_qty,
                    approved_unit_id: item.approved_unit_id,
                    currency_id: item.currency_id,
                    exchange_rate: item.exchange_rate,
                    price: item.price,
                    total_price: item.total_price,
                    foc: item.foc,
                    foc_unit_id: item.foc_unit_id,
                    tax_type_inventory_id: item.tax_type_inventory_id,
                    tax_type: item.tax_type,
                    dimension: {
                        cost_center: item.dimension?.cost_center || "",
                        project: item.dimension?.project || "",
                    },
                    is_active: true,
                    note: "",
                    exchange_rate_date: new Date().toISOString(),
                    tax_rate: 0,
                    tax_amount: 0,
                    is_tax_adjustment: false,
                    is_discount: false,
                    discount_rate: 0,
                    discount_amount: 0,
                    is_discount_adjustment: false,
                    info: {
                        specifications: "",
                    },
                    location_name: item.location_name,
                    product_name: item.product_name,
                    vendor_name: item.vendor_name,
                    requested_unit_name: item.requested_unit_name,
                    approved_unit_name: item.approved_unit_name,
                    foc_unit_name: item.foc_unit_name,
                }))
                : [
                    {
                        location_id: "",
                        product_id: "",
                        vendor_id: "",
                        price_list_id: "",
                        description: "",
                        requested_qty: 0,
                        requested_unit_id: "",
                        approved_qty: 0,
                        approved_unit_id: "",
                        currency_id: "",
                        exchange_rate: 1,
                        exchange_rate_date: new Date().toISOString(),
                        price: 0,
                        total_price: 0,
                        foc: 0,
                        foc_unit_id: "",
                        tax_type_inventory_id: "",
                        tax_type: "",
                        tax_rate: 0,
                        tax_amount: 0,
                        is_tax_adjustment: false,
                        is_discount: false,
                        discount_rate: 0,
                        discount_amount: 0,
                        is_discount_adjustment: false,
                        is_active: true,
                        note: "",
                        info: {
                            specifications: "",
                        },
                        dimension: {
                            cost_center: "",
                            project: "",
                        },
                    },
                ],
        },
    };

    const form = useForm<PurchaseRequestPostDto>({
        resolver: zodResolver(purchaseRequestSchema),
        defaultValues,
    })

    const onSubmit = (data: PurchaseRequestPostDto) => {
        console.log("Form submitted:", data)
        // Here you would typically send the data to your API
        alert("Form submitted successfully! Check console for details.")
        setCurrentMode(formType.VIEW);
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Edit button clicked, current mode:', currentMode);
        setCurrentMode(formType.EDIT);
    };

    const handleCancelClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentMode === formType.ADD || currentMode === formType.VIEW) {
            router.push("/procurement/purchase-request");
        } else {
            setCurrentMode(formType.VIEW);
        }
    };

    // We've moved item management to the ItemPr component

    const isFormValid = () => {
        const watchedValues = form.watch()
        const hasRequestor = !!watchedValues.requestor_id
        const hasDepartment = !!watchedValues.department_id
        const hasItems = watchedValues.purchase_request_detail?.add?.length > 0

        if (!hasRequestor || !hasDepartment || !hasItems) {
            return false
        }

        const itemsValid = watchedValues.purchase_request_detail.add.every((item) => {
            return !!item.product_id && item.requested_qty !== undefined && item.requested_qty > 0 && !!item.requested_unit_id
        })

        return itemsValid
    }

    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };


    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4 mb-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link href="/procurement/purchase-request">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                        <p className="text-lg font-bold">Purchase Request</p>

                                        {mode !== formType.ADD && (
                                            <Badge className="rounded-full">{initValues?.pr_status}</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentMode === formType.VIEW ? (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                                    <ChevronLeft className="h-4 w-4" /> Back
                                                </Button>
                                                <Button variant="default" size={'sm'} onClick={handleEditClick}>
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                                    <X className="h-4 w-4" /> Cancel
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size={'sm'}
                                                    type="submit"
                                                    disabled={!isFormValid()}
                                                >
                                                    <Save className="h-4 w-4" /> Save
                                                </Button>
                                            </>
                                        )}
                                        <Button type="button" variant="outline" size="sm">
                                            <Printer className="h-4 w-4" />
                                            Print
                                        </Button>
                                        <Button type="button" variant="outline" size="sm">
                                            <MessageCircle className="h-4 w-4" />
                                            Comment
                                        </Button>
                                    </div>
                                </div>
                                <HeadPrForm
                                    control={form.control}
                                    mode={currentMode}
                                    prNo={initValues?.pr_no}
                                />
                                <Tabs defaultValue="items">
                                    <TabsList className="w-full">
                                        <TabsTrigger className="w-full" value="items">Items</TabsTrigger>
                                        <TabsTrigger className="w-full" value="budgets">Budgets</TabsTrigger>
                                        <TabsTrigger className="w-full" value="workflow">Workflow</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="items">
                                        <ItemPr
                                            control={form.control}
                                            mode={currentMode}
                                        />
                                    </TabsContent>
                                    <TabsContent value="budgets">
                                        Budgets
                                    </TabsContent>
                                    <TabsContent value="workflow">
                                        Workflow
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                    </Card>
                    <h1>Mode {mode}</h1>
                    <h1>Doc Type {docType}</h1>
                    {initValues && <pre>{JSON.stringify(initValues, null, 2)}</pre>}
                </ScrollArea>

                {openLog && (
                    <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
                        <div className="flex flex-col gap-4">
                            <h1>Log</h1>
                            <h1>Activity Log</h1>
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

        </div>
    )
}

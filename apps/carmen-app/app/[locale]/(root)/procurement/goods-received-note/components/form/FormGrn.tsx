"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { Link, useRouter } from "@/lib/navigation";
import { ChevronLeft, ChevronRight, MessageCircle, Pencil, Printer, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import ActivityLog from "../ActivityLog";
import CommentGrn from "../CommentGrn";
import { Card } from "@/components/ui/card";
import { CreateGRNDto, GetGrnByIdDto, grnPostSchema } from "@/dtos/grn.dto";
import GrnFormHeader from "./GrnFormHeader";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ItemGrn from "./ItemGrn";
import ExtraCost from "./ExtraCost";
import StockMovement from "./StockMovement";
import TaxEntries from "./TaxEntries";
import JournalEntries from "./JournalEntries";
import { Badge } from "@/components/ui/badge";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import TransactionSummary from "./TransactionSummary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGrnMutation } from "@/hooks/useGrn";
import { useAuth } from "@/context/AuthContext";
import { ALLOCATE_EXTRA_COST_TYPE, DOC_TYPE } from "@/constants/enum";

interface FormGrnProps {
    readonly mode: formType;
    readonly initialValues?: GetGrnByIdDto;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
    const { token, tenantId } = useAuth();
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("items");
    const { mutate: createGrn } = useGrnMutation(token, tenantId);

    // Full form state that includes all sections
    const form = useForm<CreateGRNDto>({
        resolver: zodResolver(grnPostSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            grn_no: initialValues?.grn_no ?? "",
            description: initialValues?.description ?? "",
            doc_status: initialValues?.doc_status ?? "draft",
            doc_type: initialValues?.doc_type ?? DOC_TYPE.MANUAL,
            vendor_id: initialValues?.vendor_id ?? "",
            currency_id: initialValues?.currency_id ?? "",
            workflow_id: initialValues?.workflow_id ?? "f224d743-7cfa-46f6-8f72-85b14c6a355e",
            workflow_obj: initialValues?.workflow_obj ?? { test1: "", test2: "" },
            workflow_history: initialValues?.workflow_history ?? { test1: "", test2: "" },
            current_workflow_status: initialValues?.current_workflow_status ?? "",
            is_consignment: initialValues?.is_consignment ?? false,
            is_cash: initialValues?.is_cash ?? false,
            signature_image_url: initialValues?.signature_image_url ?? "",
            credit_term_id: initialValues?.credit_term_id ?? "2dcac4f8-4dd2-4a51-b93e-2bc815eb786d",
            is_active: initialValues?.is_active ?? true,
            note: initialValues?.note ?? "",
            info: initialValues?.info ?? { test1: "", test2: "" },
            dimension: initialValues?.dimension ?? { test1: "", test2: "" },
            extra_cost: initialValues?.extra_cost ?? {
                name: "",
                allocate_extracost_type: ALLOCATE_EXTRA_COST_TYPE.MANUAL,
                note: "",
                info: { test1: "", test2: "" },
                extra_cost_detail: { add: [] }
            },
            good_received_note_detail: {
                initData: (initialValues?.good_received_note_detail ?? []).map((detail) => ({
                    id: detail.id,
                    sequence_no: detail.sequence_no,
                    location_id: detail.location_id,
                    product_id: detail.product_id,
                    order_qty: detail.order_qty,
                    order_unit_id: detail.order_unit_id,
                    received_qty: detail.received_qty,
                    received_unit_id: detail.received_unit_id,
                    is_foc: detail.is_foc,
                    foc_qty: detail.foc_qty,
                    foc_unit_id: detail.foc_unit_id,
                    price: detail.price,
                    tax_type_inventory_id: detail.tax_type_inventory_id,
                    tax_type: detail.tax_type,
                    tax_rate: detail.tax_rate,
                    tax_amount: detail.tax_amount,
                    is_tax_adjustment: detail.is_tax_adjustment,
                    total_amount: detail.total_amount,
                    delivery_point_id: detail.delivery_point_id,
                    base_price: detail.base_price,
                    base_qty: detail.base_qty,
                    extra_cost: detail.extra_cost,
                    total_cost: detail.total_cost,
                    is_discount: detail.is_discount,
                    discount_rate: detail.discount_rate,
                    discount_amount: detail.discount_amount,
                    is_discount_adjustment: detail.is_discount_adjustment,
                    note: detail.note,
                    info: detail.info,
                    dimension: detail.dimension,
                })),
                add: [],
                update: [],
                delete: []
            }

        },
    });

    // Watch all form values for logging changes
    const watchedValues = useWatch({
        control: form.control,
    });

    // Log form changes
    useEffect(() => {
        console.log("=== Form Values Changed ===");
        console.log("Current form values:", watchedValues);

        // Log specific field changes
        if (watchedValues.good_received_note_detail) {
            console.log("Items:", watchedValues.good_received_note_detail);
        }
        if (watchedValues.extra_cost) {
            console.log("Extra costs:", watchedValues.extra_cost);
        }
    }, [watchedValues]);

    // Log initial values
    useEffect(() => {
        if (initialValues) {
            console.log("=== Form Initialized ===");
            console.log("Initial values:", initialValues);
            console.log("Form default values:", form.getValues());
        }
    }, [initialValues, form]);

    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };

    const onSubmit = (data: CreateGRNDto) => {
        console.log("Submitted form data:", data);
        createGrn(data);
        setCurrentMode(formType.VIEW);
    };

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
            router.push("/procurement/goods-received-note");
        } else {
            setCurrentMode(formType.VIEW);
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
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
                                        <Link href="/procurement/goods-received-note">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                        <p className="text-lg font-bold">Goods Received Note</p>
                                        <Badge className="rounded-full">{initialValues?.doc_status}</Badge>
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
                                <GrnFormHeader control={form.control} mode={currentMode} />
                                <Tabs defaultValue="items" onValueChange={handleTabChange} value={activeTab}>
                                    <TabsList className="w-full">
                                        <TabsTrigger className="w-full" value="items">Items</TabsTrigger>
                                        <TabsTrigger className="w-full" value="extraCost">Extra Cost</TabsTrigger>
                                        <TabsTrigger className="w-full" value="stockMovement">Stock Movement</TabsTrigger>
                                        <TabsTrigger className="w-full" value="journalEntries">Financial</TabsTrigger>
                                        <TabsTrigger className="w-full" value="taxEntries">Tax Entries</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="items">
                                        <ItemGrn
                                            control={form.control}
                                            mode={currentMode}
                                        />
                                    </TabsContent>
                                    <TabsContent value="extraCost">
                                        <ExtraCost
                                            control={form.control}
                                            mode={currentMode}
                                        />
                                    </TabsContent>
                                    <TabsContent value="stockMovement">
                                        <StockMovement
                                            control={form.control}
                                            mode={currentMode}
                                        />
                                    </TabsContent>
                                    <TabsContent value="journalEntries">
                                        <JournalEntries
                                            control={form.control}
                                            mode={currentMode}
                                        />
                                    </TabsContent>
                                    <TabsContent value="taxEntries">
                                        <TaxEntries
                                            control={form.control}
                                            mode={currentMode}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </Form>
                    </Card>
                    <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
                    <TransactionSummary />
                </ScrollArea>



                {openLog && (
                    <div className="w-1/4 transition-all duration-300 ease-in-out transform translate-x-0">
                        <div className="flex flex-col gap-4">
                            <CommentGrn />
                            <ActivityLog />
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
    );
}


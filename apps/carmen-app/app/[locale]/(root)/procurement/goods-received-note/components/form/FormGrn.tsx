"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { Link, useRouter } from "@/lib/navigation";
import { ChevronLeft, ChevronRight, MessageCircle, Pencil, Printer, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import ActivityLog from "../ActivityLog";
import CommentGrn from "../CommentGrn";
import { Card } from "@/components/ui/card";
import {
    GrnFormSchema,
    GrnFormValues,
} from "../../type.dto";
import { GrnByIdDto } from "@/dtos/grn.dto";
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
import { postGrnData } from "./post-data";
import { useGrnMutation } from "@/hooks/useGrn";
import { useAuth } from "@/context/AuthContext";

interface FormGrnProps {
    readonly mode: formType;
    readonly initialValues?: GrnByIdDto;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
    const { token, tenantId } = useAuth();
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("items");
    const { mutate: createGrn, isPending } = useGrnMutation(token, tenantId);
    // Full form state that includes all sections
    const form = useForm<GrnFormValues>({
        resolver: zodResolver(GrnFormSchema),
        defaultValues: {
            id: initialValues?.id,
            status: initialValues?.doc_status ?? "draft",
            info: {
                grn_no: initialValues?.grn_no ?? "",
                date: initialValues?.created_at?.split('T')[0] ?? "",
                vendor: initialValues?.vendor_name ?? "",
                invoice_no: initialValues?.invoice_no ?? "",
                invoice_date: initialValues?.invoice_date ?? "",
                description: initialValues?.description ?? "",
                currency: initialValues?.currency_name ?? "",
                exchange_rate: parseFloat(initialValues?.currency_rate ?? "0"),
                consignment: initialValues?.is_consignment ?? false,
                cash: initialValues?.is_cash ?? false,
                credit_term: initialValues?.credit_term_days ?? 0,
                due_date: initialValues?.payment_due_date ?? "",
            },
            items: initialValues?.good_received_note_detail?.map((detail) => ({
                id: detail.id,
                locations: {
                    id: detail.location_id,
                    name: detail.location_name,
                },
                products: {
                    id: detail.product_id,
                    name: detail.product_name,
                    description: detail.product_local_name,
                },
                lot_no: detail.lot_number || "",
                qty_order: parseFloat(detail.order_qty),
                qty_received: parseFloat(detail.received_qty),
                unit: {
                    id: detail.received_unit_id,
                    name: detail.received_unit_name,
                },
                price: parseFloat(detail.price),
                net_amount: parseFloat(detail.total_amount) - parseFloat(detail.tax_amount),
                tax_amount: parseFloat(detail.tax_amount),
                total_amount: parseFloat(detail.total_amount),
            })) ?? [],
            extra_cost: initialValues?.extra_cost_detail?.map((cost) => ({
                id: cost.id,
                type: cost.extra_cost_type_name,
                amount: parseFloat(cost.amount),
            })) ?? [],
            stock_movement: [],
            journal_entries: {
                id: "",
                type: "",
                code: "",
                transaction_date: "",
                status: "",
                ref_no: "",
                soruce: "",
                description: "",
                lists: [],
            },
            tax_entries: {
                id: "",
                tax_invoice_no: "",
                date: "",
                status: "",
                period: "",
                base_amount: 0,
                base: "",
                tax_rates: 0,
                tax_amount: 0,
                tax_cal: [],
                filling_period: "",
                filling_date: "",
                vat_return: "",
                filing_status: "",
            },
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
        if (watchedValues.info) {
            console.log("Header info:", watchedValues.info);
        }
        if (watchedValues.items && watchedValues.items.length > 0) {
            console.log("Items:", watchedValues.items);
        }
        if (watchedValues.extra_cost && watchedValues.extra_cost.length > 0) {
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

    const onSubmit = (data: GrnFormValues) => {
        console.log("=== Form Submission ===");
        console.log("Submitted form data:", data);

        // Compare with initial values to show what changed
        if (initialValues) {
            console.log("=== Changes Detection ===");
            console.log("Original data:", initialValues);
            console.log("Modified data:", data);

            // Deep comparison for specific sections
            const infoChanged = JSON.stringify({
                grn_no: initialValues.grn_no,
                vendor_name: initialValues.vendor_name,
                invoice_no: initialValues.invoice_no,
                currency_name: initialValues.currency_name,
                // ... other info fields
            }) !== JSON.stringify(data.info);

            const itemsChanged = JSON.stringify(initialValues.good_received_note_detail) !== JSON.stringify(data.items);
            const extraCostChanged = JSON.stringify(initialValues.extra_cost_detail) !== JSON.stringify(data.extra_cost);

            console.log("Section changes:", {
                info: infoChanged,
                items: itemsChanged,
                extraCost: extraCostChanged
            });
        }

        // Here you would typically send the data to the server
        alert('Form saved successfully');
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

    const handleTestPost = () => {
        try {
            createGrn(postGrnData);
            alert('Successfully created GRN');
        } catch (error) {
            console.log(error);
            alert('Failed to create GRN');
        }
    }

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <Button variant="outline" size="sm" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTestPost();
                }}>
                    Test Post
                </Button>
                {/* <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
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
                    <TransactionSummary />
                </ScrollArea> */}



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


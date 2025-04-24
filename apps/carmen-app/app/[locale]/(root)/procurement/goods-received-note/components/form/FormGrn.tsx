"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { useRouter } from "@/lib/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Pencil, Printer, Save, X } from "lucide-react";
import { useState } from "react";
import ActivityLog from "../ActivityLog";
import CommentGrn from "../CommentGrn";
import { Card } from "@/components/ui/card";
import {
    GrnDto,
    GrnFormSchema,
    GrnFormValues,
} from "../../type.dto";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import TransactionSummary from "./TransactionSummary";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormGrnProps {
    readonly mode: formType;
    readonly initialValues?: GrnDto;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openLog, setOpenLog] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("items");

    // Full form state that includes all sections
    const form = useForm<GrnFormValues>({
        resolver: zodResolver(GrnFormSchema),
        defaultValues: {
            id: initialValues?.id,
            status: initialValues?.status ?? "draft",
            info: {
                grn_no: initialValues?.info?.grn_no ?? "",
                date: initialValues?.info?.date ?? "",
                vendor: initialValues?.info?.vendor ?? "",
                invoice_no: initialValues?.info?.invoice_no ?? "",
                invoice_date: initialValues?.info?.invoice_date ?? "",
                description: initialValues?.info?.description ?? "",
                currency: initialValues?.info?.currency ?? "",
                exchange_rate: initialValues?.info?.exchange_rate ?? 0,
                consignment: initialValues?.info?.consignment ?? false,
                cash: initialValues?.info?.cash ?? false,
                credit_term: initialValues?.info?.credit_term ?? 0,
                due_date: initialValues?.info?.due_date ?? "",
            },
            items: initialValues?.items ?? [],
            extra_cost: initialValues?.extra_cost ?? [],
            stock_movement: initialValues?.stock_movement ?? [],
            journal_entries: initialValues?.journal_entries ?? {
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
            tax_entries: initialValues?.tax_entries ?? {
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

    const handleOpenLog = () => {
        setOpenLog(!openLog);
    };

    const onSubmit = (data: GrnFormValues) => {
        console.log("Form data submitted:", data);
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

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea className={`${openLog ? 'w-3/4' : 'w-full'} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}>
                    <Card className="p-4 mb-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h1>Goods Received Note</h1>
                                        <Badge>{initialValues?.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {currentMode === formType.VIEW ? (
                                            <>
                                                <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                                    <ArrowLeft className="h-4 w-4" /> Back
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
                                        <TabsTrigger className="w-full" value="journalEntries">Journal Entries</TabsTrigger>
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


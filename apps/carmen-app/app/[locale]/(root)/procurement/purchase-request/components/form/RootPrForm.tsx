"use client";

import JsonViewer from "@/components/JsonViewer";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { CreatePurchaseRequestSchema, PurchaseRequestByIdDto, PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto, UpdatePurchaseRequestSchema } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mockPr } from "./payload-pr";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DateInput from "@/components/form-custom/DateInput";
import { Label } from "@/components/ui/label";
import HeadForm from "./HeadForm";
import StatusPrInfo from "./StatusPrInfo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ArrowLeftRightIcon, ChevronRight, XCircleIcon, ChevronLeft } from "lucide-react";
import ActionFields from "./ActionFields";
import ItemDetail from "./ItemDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RootPrFormProps {
    readonly mode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
}

export default function RootPrForm({
    mode,
    initValues }: RootPrFormProps) {
    const { token, tenantId, user, departments } = useAuth();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [openLog, setOpenLog] = useState(false);

    const defaultValues: PurchaseRequestCreateFormDto = {
        pr_date: initValues?.pr_date ? initValues.pr_date : new Date().toISOString(),
        requestor_id: user?.id,
        department_id: departments?.id,
        workflow_id: initValues?.workflow_id,
        description: initValues?.description || null,
        note: initValues?.note || null,
        info: initValues?.info,
        dimension: initValues?.dimension,
    }

    const form = useForm<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>({
        resolver: zodResolver(currentMode === formType.ADD ? CreatePurchaseRequestSchema : UpdatePurchaseRequestSchema),
        defaultValues,
        mode: "onChange",
    });

    const handleSubmit = (data: PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto) => {
        if (mode === formType.ADD) {
            console.log("add", data);
        } else {
            console.log("update", data);
        }
    }

    return (
        <div className="relative">
            <div className="flex gap-4 relative">
                <ScrollArea
                    className={`${openLog ? "w-3/4" : "w-full"} transition-all duration-300 ease-in-out h-[calc(121vh-300px)]`}
                >
                    <Card className="p-4 mb-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <ActionFields
                                    mode={mode}
                                    currentMode={currentMode}
                                    initValues={initValues}
                                    onModeChange={setCurrentMode}
                                />
                                <div className="grid grid-cols-5 gap-2">
                                    <HeadForm
                                        form={form}
                                        mode={mode}
                                        pr_no={initValues?.pr_no}
                                        workflow_name={initValues?.workflow_name}
                                        requestor_name={initValues?.requestor_name}
                                        department_name={initValues?.department_name}
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
                                        <ItemDetail
                                            form={form}
                                            initItems={initValues?.purchase_request_detail}
                                            mode={currentMode}
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
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                        <JsonViewer data={defaultValues ?? {}} />
                        <JsonViewer data={mockPr ?? {}} />
                    </div>
                    <JsonViewer data={initValues ?? {}} />
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
        </div>
    );
}
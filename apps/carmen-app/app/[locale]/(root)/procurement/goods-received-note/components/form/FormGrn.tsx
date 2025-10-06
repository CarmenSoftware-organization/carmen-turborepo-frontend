"use client";

import ActivityLog from "@/components/comment-activity/ActivityLog";
import CommentGrn from "@/components/comment-activity/CommentGrn";
import DetailsAndComments from "@/components/DetailsAndComments";
import { Card } from "@/components/ui/card";
import { DOC_TYPE } from "@/constants/enum";
import { formType } from "@/dtos/form.dto";
import { CreateGRNDto, grnPostSchema } from "@/dtos/grn.dto";
import { GrnApiResponse } from "@/types/grn-api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useGrnMutation, useGrnUpdate } from "@/hooks/use-grn";
import ActionFields from "./ActionFields";
import GrnFormHeader from "./GrnFormHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemGrn from "./ItemGrn";
import JsonViewer from "@/components/JsonViewer";
import ExtraCost from "./ExtraCost";

interface FormGrnProps {
    readonly mode: formType;
    readonly initialValues?: GrnApiResponse;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
    const { token, buCode } = useAuth();
    const [currentMode, setCurrentMode] = useState<formType>(mode);

    // ตรวจสอบว่า token และ buCode มีค่าก่อนส่งไปยัง hooks
    const { isPending: isCreatePending } = useGrnMutation(
        token || "",
        buCode || ""
    );

    const { isPending: isUpdatePending } = useGrnUpdate(
        token || "",
        buCode || "",
        initialValues?.id ?? ""
    );

    const defaultValues: CreateGRNDto = {
        invoice_no: initialValues?.invoice_no ?? "",
        invoice_date: initialValues?.invoice_date ?? new Date().toISOString(),
        description: initialValues?.description ?? "",
        doc_status: initialValues?.doc_status ?? "draft",
        doc_type: (initialValues?.doc_type as DOC_TYPE) ?? DOC_TYPE.MANUAL,
        vendor_id: initialValues?.vendor_id ?? "",
        currency_id: initialValues?.currency_id ?? "",
        currency_rate: initialValues?.currency_rate ? parseFloat(initialValues.currency_rate) : 0,
        workflow_id:
            initialValues?.workflow_id ?? "",
        current_workflow_status:
            initialValues?.workflow_current_stage ?? "pending",
        signature_image_url: initialValues?.signature_image_url ?? "",
        received_by_id:
            initialValues?.received_by_id ?? "",
        received_at: initialValues?.received_at ?? new Date().toISOString(),
        credit_term_id: initialValues?.credit_term_id ?? "",
        payment_due_date:
            initialValues?.payment_due_date ?? new Date().toISOString(),
        good_received_note_detail: {
            add: [],
            update: [],
            delete: [],
        },
        extra_cost: {
            name: "",
            allocate_extra_cost_type: undefined,
            note: "",
            extra_cost_detail: {
                add: [],
                update: [],
                delete: [],
            },
        },
    };

    const form = useForm<CreateGRNDto>({
        resolver: zodResolver(grnPostSchema),
        defaultValues,
        mode: "onChange",
    });

    const onSubmit = async (data: CreateGRNDto, e?: React.BaseSyntheticEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (currentMode === formType.ADD) {
            console.log("Calling createGrn with data:", data);
        } else if (currentMode === formType.EDIT && initialValues?.id) {
            console.log("Calling updateGrn with data:", data);
        }
    };

    const watchGrnForm = form.watch();

    return (
        <DetailsAndComments
            activityComponent={<ActivityLog />}
            commentComponent={<CommentGrn />}
        >
            <div className="space-y-4">
                <Card className="p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <ActionFields
                                currentMode={currentMode}
                                setCurrentMode={setCurrentMode}
                                isCreatePending={isCreatePending}
                                isUpdatePending={isUpdatePending}
                                grnNo={initialValues?.grn_no ?? ""}
                                createdAt={initialValues?.created_at ?? ""}
                                docStatus={initialValues?.doc_status ?? ""}
                            />
                            <GrnFormHeader control={form.control} mode={currentMode} />
                            <Tabs defaultValue="items">
                                <TabsList className="w-full mt-4">
                                    <TabsTrigger className="w-full" value="items">
                                        Items GRN
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="extra_cost">
                                        Extra Cost
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="budget">
                                        Budget
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="workflow">
                                        Workflow
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="items" className="mt-2">
                                    <ItemGrn
                                        control={form.control}
                                        mode={currentMode}
                                        grnItems={initialValues?.good_received_note_detail ?? []}
                                    />
                                </TabsContent>
                                <TabsContent value="extra_cost" className="mt-2">
                                    <ExtraCost
                                        control={form.control}
                                        mode={currentMode}
                                        extraCostData={initialValues?.extra_cost}
                                        extraCostDetailData={initialValues?.extra_cost_detail}
                                    />
                                </TabsContent>
                                <TabsContent value="budget" className="mt-2">
                                    Budget
                                </TabsContent>
                                <TabsContent value="workflow" className="mt-2">
                                    Workflow
                                </TabsContent>
                            </Tabs>

                        </form>
                    </Form>
                </Card>
            </div>
            <JsonViewer data={watchGrnForm ?? {}} title="Watch GRN Data" />

        </DetailsAndComments>
    )
}
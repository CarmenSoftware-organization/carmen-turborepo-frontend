"use client";

import ActivityLog from "@/components/comment-activity/ActivityLog";
import CommentGrn from "@/components/comment-activity/CommentGrn";
import DetailsAndComments from "@/components/DetailsAndComments";
import { Card } from "@/components/ui/card";
import { DOC_TYPE } from "@/constants/enum";
import { formType } from "@/dtos/form.dto";
import { CreateGRNDto, GetGrnByIdDto, grnPostSchema } from "@/dtos/grn.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Link, useRouter } from "@/lib/navigation";
import { ChevronLeft, FileDown, Pencil, Printer, Save, Share, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGrnMutation, useGrnUpdate } from "@/hooks/use-grn";
import ActionFields from "./ActionFields";
import GrnFormHeader from "./GrnFormHeader";

interface FormGrnProps {
    readonly mode: formType;
    readonly initialValues?: GetGrnByIdDto;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
    const { token, buCode } = useAuth();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const router = useRouter();

    // ตรวจสอบว่า token และ buCode มีค่าก่อนส่งไปยัง hooks
    const { mutate: createGrn, isPending: isCreatePending } = useGrnMutation(
        token || "",
        buCode || ""
    );

    const { mutate: updateGrn, isPending: isUpdatePending } = useGrnUpdate(
        token || "",
        buCode || "",
        initialValues?.id ?? ""
    );

    const defaultValues: CreateGRNDto = {
        invoice_no: initialValues?.invoice_no ?? "",
        invoice_date: initialValues?.invoice_date ?? new Date().toISOString(),
        description: initialValues?.description ?? "",
        doc_status: initialValues?.doc_status ?? "draft",
        doc_type: initialValues?.doc_type ?? DOC_TYPE.MANUAL,
        vendor_id: initialValues?.vendor_id ?? "",
        currency_id: initialValues?.currency_id ?? "",
        currency_rate: initialValues?.currency_rate ?? 0,
        workflow_id:
            initialValues?.workflow_id ?? "ac710822-d422-4e29-8439-87327e960a0e",
        current_workflow_status:
            initialValues?.current_workflow_status ?? "pending",
        signature_image_url: initialValues?.signature_image_url ?? "",
        received_by_id:
            initialValues?.received_by_id ?? "1bfdb891-58ee-499c-8115-34a964de8122",
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
            name: initialValues?.extra_cost?.name ?? "",
            allocate_extra_cost_type:
                initialValues?.extra_cost?.allocate_extra_cost_type,
            note: initialValues?.extra_cost?.note ?? "",
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
                        </form>
                    </Form>
                </Card>
            </div>
            <pre>{JSON.stringify(initialValues, null, 2)}</pre>

        </DetailsAndComments>
    )
}
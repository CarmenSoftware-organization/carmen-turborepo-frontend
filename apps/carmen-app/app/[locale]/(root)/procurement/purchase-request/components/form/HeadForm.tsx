import DateInput from "@/components/form-custom/DateInput";
import { FormControl, FormItem, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { UseFormReturn } from "react-hook-form";

interface HeadFormProps {
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
    readonly mode: formType;
    readonly pr_no?: string;
    readonly workflow_name?: string;
    readonly requestor_name?: string;
    readonly department_name?: string;
}

export default function HeadForm({
    form,
    mode,
    pr_no,
    workflow_name,
    requestor_name,
    department_name
}: HeadFormProps) {
    return (
        <div className="col-span-3 grid grid-cols-4 gap-4">
            <div className="space-y-2">
                <Label>PR Number</Label>
                <Input
                    placeholder="PR-XXXX"
                    disabled
                    className="bg-muted"
                    value={pr_no}
                />
            </div>
            <FormField
                control={form.control}
                name="pr_date"
                disabled={mode === formType.VIEW}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>วันที่</FormLabel>
                        <FormControl>
                            <DateInput field={field} />
                        </FormControl>
                    </FormItem>
                )}
            />
            <div className="space-y-2">
                <Label>PR Type</Label>
                <Input
                    disabled
                    className="bg-muted"
                    value={workflow_name}
                />
            </div>
            <div className="space-y-2">
                <Label>Requestor</Label>
                <Input
                    disabled
                    className="bg-muted"
                    value={requestor_name}
                />
            </div>
            <div className="space-y-2">
                <Label>Department</Label>
                <Input
                    disabled
                    className="bg-muted"
                    value={department_name}
                />
            </div>
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="col-span-2 mt-0">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Description"
                                disabled={mode === formType.VIEW}
                                className={mode === formType.VIEW ? "bg-muted" : ""}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    )
}
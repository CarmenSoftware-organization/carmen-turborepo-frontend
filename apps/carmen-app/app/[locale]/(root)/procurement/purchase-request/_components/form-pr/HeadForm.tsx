import DateInput from "@/components/form-custom/DateInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import LookupWorkflow from "@/components/lookup/LookupWorkflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formType } from "@/dtos/form.dto";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { cn } from "@/lib/utils";
import { Building2, Calendar, FileText, GitBranch, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { usePurchaseRequestContext } from "./PurchaseRequestContext";

interface HeadFormProps {
  bu_code: string;
  requestorName?: string;
}

export default function HeadForm({ bu_code, requestorName }: HeadFormProps) {
  const { control } = useFormContext();
  const {
    currentMode: mode,
    workflowId: workflow_id,
    requestorName: requestor_name,
    departmentName: department_name,
  } = usePurchaseRequestContext();

  const displayRequestorName = requestorName ?? requestor_name;

  const tPr = useTranslations("PurchaseRequest");

  return (
    <div className="grid grid-cols-4 gap-2">
      <FormField
        control={control}
        name="details.workflow_id"
        required
        icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tPr("pr_type")}</FormLabel>
            <FormControl>
              <LookupWorkflow
                value={field.value || workflow_id || ""}
                onValueChange={field.onChange}
                type={enum_workflow_type.purchase_request}
                disabled={mode === formType.VIEW}
                bu_code={bu_code}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="details.pr_date"
        required
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tPr("pr_date")}</FormLabel>
            <FormControl>
              <DateInput field={field} disabled={true} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="space-y-2">
        <Label>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-4 w-4" />
            {tPr("requestor")}
          </div>
        </Label>
        <Input placeholder="Requestor" disabled className="bg-muted" value={displayRequestorName} />
      </div>
      <div className="space-y-2">
        <Label>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {tPr("department")}
          </div>
        </Label>
        <Input
          placeholder={tPr("department")}
          disabled
          className="bg-muted"
          value={department_name}
        />
      </div>

      <FormField
        control={control}
        name="details.description"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        render={({ field }) => (
          <FormItem className="col-span-2 mt-2">
            <FormLabel>{tPr("description")}</FormLabel>
            <FormControl>
              <Textarea
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={tPr("description")}
                className={cn(mode === formType.VIEW ? "bg-muted" : "")}
                disabled={mode === formType.VIEW}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="details.note"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        render={({ field }) => (
          <FormItem className="col-span-2 mt-2">
            <FormLabel>{tPr("note")}</FormLabel>
            <FormControl>
              <Textarea
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={tPr("note")}
                className={cn(mode === formType.VIEW ? "bg-muted" : "")}
                disabled={mode === formType.VIEW}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

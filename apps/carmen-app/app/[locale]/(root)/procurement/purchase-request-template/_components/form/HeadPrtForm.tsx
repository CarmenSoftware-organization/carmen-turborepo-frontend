import { Input } from "@/components/ui/input";
import { Building2, FileText, Hash } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/form-custom/form";
import { Textarea } from "@/components/ui/textarea";
import { PrtFormValues } from "../../_schema/prt.schema";
import { cn } from "@/utils";
import { formType } from "@/dtos/form.dto";
import LookupWorkflow from "@/components/lookup/LookupWorkflow";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { Label } from "@/components/ui/label";

interface Props {
  readonly form: UseFormReturn<PrtFormValues>;
  currentMode: formType;
  buCode: string;
  departName: string;
  workflowName?: string;
}

export default function HeadPrtForm({ form, currentMode, buCode, departName, workflowName }: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const isViewMode = currentMode === formType.VIEW;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <FormField
          control={form.control}
          name="name"
          required
          icon={<Hash className="h-4 w-4 text-muted-foreground" />}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">{tPurchaseRequest("pr_name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={cn("mt-2 text-xs", isViewMode && "bg-muted")}
                  disabled={isViewMode}
                  placeholder={tPurchaseRequest("pr_name")}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workflow_id"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          required
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">{tPurchaseRequest("pr_type")}</FormLabel>
              <FormControl>
                <LookupWorkflow
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  type={enum_workflow_type.purchase_request}
                  disabled={isViewMode}
                  bu_code={buCode}
                  initialDisplayName={workflowName || form.watch("workflow_name")}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Building2 className="h-4 w-4" />
              {tPurchaseRequest("department")}
            </div>
          </Label>
          <Input placeholder="PR-XXXX" disabled className="bg-muted" value={departName} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <FormField
          control={form.control}
          name="description"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          render={({ field }) => (
            <FormItem className="col-span-2 mt-2">
              <FormLabel>{tPurchaseRequest("description")}</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={tPurchaseRequest("description")}
                  className={cn(currentMode === formType.VIEW ? "bg-muted" : "")}
                  disabled={currentMode === formType.VIEW}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          render={({ field }) => (
            <FormItem className="col-span-2 mt-2">
              <FormLabel>{tPurchaseRequest("note")}</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={tPurchaseRequest("note")}
                  className={cn(currentMode === formType.VIEW ? "bg-muted" : "")}
                  disabled={currentMode === formType.VIEW}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

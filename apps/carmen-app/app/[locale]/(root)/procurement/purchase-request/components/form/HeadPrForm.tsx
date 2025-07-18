import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formType } from "@/dtos/form.dto";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";
import { Control } from "react-hook-form";
import {
  CalendarIcon,
  Hash,
  Settings,
  User,
  FileText,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DateInput from "@/components/form-custom/DateInput";
import CalendarButton from "@/components/form-custom/CalendarButton";

interface HeadPrFormProps {
  readonly control: Control<PrSchemaV2Dto>;
  readonly mode: formType;
  readonly prNo?: string;
  readonly statusInfo?: {
    create_date?: string;
    status?: string;
    workflow_status?: string;
  };
  readonly totalAmount: number;
}

export default function HeadPrForm({
  control,
  mode,
  prNo,
  statusInfo,
  totalAmount,
}: HeadPrFormProps) {
  const { user, departments } = useAuth();
  const requestorName =
    user?.user_info.firstname + " " + user?.user_info.lastname;
  const departmentName = departments?.name;
  const { getWorkflowName } = useWorkflow();

  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-2/3 space-y-2">
          {mode !== formType.ADD && (
            <>
              <FormField
                control={control}
                name="pr_no"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        PR Number
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={prNo ?? field.value}
                        disabled
                        className="mt-2 text-xs bg-muted"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="pr_date"
                render={({ field }) => (
                  <FormItem className="col-span-1 mt-2">
                    <FormLabel className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        PR Date
                      </div>
                    </FormLabel>
                    {mode === formType.VIEW ? (
                      <CalendarButton field={field} />
                    ) : (
                      <DateInput field={field} />
                    )}
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={control}
            name="workflow_id"
            render={({ field }) => (
              <FormItem className="col-span-1 mt-2">
                <FormLabel className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    PR Type
                  </div>
                </FormLabel>
                {mode === formType.VIEW ? (
                  <Input
                    value={getWorkflowName(field.value)}
                    disabled
                    className="mt-1 text-xs bg-muted"
                  />
                ) : (
                  <FormControl>
                    <WorkflowLookup
                      value={field.value}
                      onValueChange={field.onChange}
                      type={enum_workflow_type.purchase_request}
                    />
                  </FormControl>
                )}
              </FormItem>
            )}
          />

          {mode !== formType.ADD && (
            <>
              <Label className="space-y-2">
                <div className="flex items-center gap-1 mt-1">
                  <User className="h-3 w-3" />
                  Requestor
                </div>
                <Input
                  value={requestorName}
                  disabled
                  className="mt-1 text-xs bg-muted"
                />
              </Label>

              <Label className="space-y-2">
                <div className="flex items-center gap-1 mt-1">
                  <Building className="h-3 w-3" />
                  Department
                </div>
                <Input
                  value={departmentName}
                  disabled
                  className="mt-1 text-xs bg-muted"
                />
              </Label>
            </>
          )}

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Description
                  </div>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter description..."
                    disabled={mode === formType.VIEW}
                    className={mode === formType.VIEW ? "bg-muted" : ""}
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {mode !== formType.ADD && (
          <div className="w-1/3">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Status Information</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Current Stage</span>
                    <Badge variant="outline" className="text-xs">
                      Requestor
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Document Status
                    </span>
                    <Badge variant={statusInfo?.status} className="text-xs">
                      {statusInfo?.status ?? "-"}
                    </Badge>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {statusInfo?.create_date
                        ? format(new Date(statusInfo.create_date), "PPP")
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Estimated Cost
                    </span>
                    <span className="font-medium">{totalAmount}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

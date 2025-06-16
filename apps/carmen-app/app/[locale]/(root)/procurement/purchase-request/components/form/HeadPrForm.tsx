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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Hash,
  Settings,
  User,
  Building,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import DepartmentLookup from "@/components/lookup/DepartmentLookup";
import UserListLookup from "@/components/lookup/UserListLookup";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useDepartment } from "@/hooks/useDepartment";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  const { user } = useAuth();
  const userId = user?.id;

  const { getWorkflowName } = useWorkflow();
  const { getDepartmentName } = useDepartment();

  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 w-2/3 space-y-2">
          {mode !== formType.ADD && (
            // <div className="col-span-1">
            //   <Label className="text-xs font-medium">
            //     <div className="flex items-center gap-1">
            //       <Hash className="h-3 w-3" />
            //       PR Number
            //     </div>
            //   </Label>
            //   <Input value={prNo} disabled className="mt-2 text-xs bg-muted" />
            // </div>
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
          )}
          <FormField
            control={control}
            name="pr_date"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    PR Date
                  </div>
                </FormLabel>
                {mode === formType.VIEW ? (
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-2 text-left font-normal text-xs bg-muted mt-1",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span className="text-muted-foreground">Select date</span>
                    )}
                    <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                  </Button>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Select date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? date.toISOString() : new Date().toISOString()
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="workflow_id"
            render={({ field }) => (
              <FormItem className="col-span-1">
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
                    <div className="mt-1">
                      <WorkflowLookup
                        value={field.value}
                        onValueChange={field.onChange}
                        type={enum_workflow_type.purchase_request}
                      />
                    </div>
                  </FormControl>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="requestor_id"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Requestor
                  </div>
                </FormLabel>
                <FormControl>
                  <div className="mt-1">
                    <UserListLookup
                      value={mode === formType.ADD ? userId : field.value}
                      onValueChange={field.onChange}
                      disabled={true}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="department_id"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Department
                  </div>
                </FormLabel>
                {mode === formType.VIEW ? (
                  <Input
                    value={getDepartmentName(field.value)}
                    disabled
                    className="mt-1 text-xs bg-muted"
                  />
                ) : (
                  <FormControl>
                    <div className="mt-1">
                      <DepartmentLookup
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
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
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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
                  <span className="text-muted-foreground">Document Status</span>
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
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-medium">
                    {totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

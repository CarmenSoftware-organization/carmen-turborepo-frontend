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

interface HeadPrFormProps {
  readonly control: Control<PrSchemaV2Dto>;
  readonly mode: formType;
  readonly prNo?: string;
}

export default function HeadPrForm({ control, mode, prNo }: HeadPrFormProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const { getWorkflowName } = useWorkflow();
  const { getDepartmentName } = useDepartment();

  return (
    <div className="space-y-2 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-1">
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
              <FormItem className="col-span-1">
                <FormLabel className="text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    PR Number
                  </div>
                </FormLabel>
                <FormControl>
                  <Input value={prNo ? prNo : field.value} disabled className="mt-2 text-xs bg-muted" />
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
                      selected={field.value ? new Date(field.value) : undefined}
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
                <p className="text-xs text-muted-foreground mt-1 px-2 py-1 rounded">
                  {getDepartmentName(field.value)}
                </p>
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
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Description
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground mt-1 px-2 py-1 rounded min-h-[28px] flex items-center">
                  {field.value ? field.value : "-"}
                </p>
              ) : (
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter description..."
                  />
                </FormControl>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

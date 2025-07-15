"use client";

import { Building, CalendarIcon, FileText, Hash, Settings, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { enum_workflow_type } from "@/dtos/workflows.dto";

interface HeadFormProps {
  form: UseFormReturn<PrSchemaV2Dto>;
  isReadOnly: boolean;
  readonly statusInfo?: {
    create_date?: string;
    status?: string;
    workflow_status?: string;
  };
}

export default function HeadForm({ form, isReadOnly, statusInfo }: HeadFormProps) {

  const { user, departments } = useAuth();
  const requestorName =
    user?.user_info.firstname + " " + user?.user_info.lastname;
  const departmentName = departments?.name;
  const { getWorkflowName } = useWorkflow();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

      <div className="col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* PR Number */}
        <FormField
          control={form.control}
          name="pr_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                PR
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="PR-XXXX"
                  disabled
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PR Date */}
        <FormField
          control={form.control}
          name="pr_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Date
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isReadOnly}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
                      ) : (
                        <span className="text-muted-foreground">Select Date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value) : undefined
                    }
                    onSelect={(date) => {
                      field.onChange(date?.toISOString());
                    }}
                    disabled={(date) =>
                      date > new Date() ||
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workflow_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                PR Type
              </FormLabel>
              {!isReadOnly ? (
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Label className="space-y-2">
          <div className="flex items-center gap-1">
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
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            Department
          </div>
          <Input
            value={departmentName}
            disabled
            className="mt-1 text-xs bg-muted"
          />
        </Label>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-3 mt-0">
              <FormLabel className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description"
                  disabled={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Card className="col-span-2 p-4">
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
          </div>
        </div>
      </Card>

    </div>
  );
}
"use client";

import { Building, CalendarIcon, FileText, Hash, Settings, User } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import WorkflowLookup from "@/components/lookup/WorkflowLookup";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import DateInput from "@/components/form-custom/DateInput";
import StatusPrInfo from "./StatusPrInfo";

interface HeadFormProps {
  readonly form: UseFormReturn<PrSchemaV2Dto>;
  readonly isReadOnly: boolean;
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
              <DateInput field={field} />
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
      <StatusPrInfo statusInfo={statusInfo} />
    </div>
  );
}
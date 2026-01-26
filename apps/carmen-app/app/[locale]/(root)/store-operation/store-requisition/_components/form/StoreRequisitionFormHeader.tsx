import { formType } from "@/dtos/form.dto";
import { SrByIdDto, SrCreate } from "@/dtos/sr.dto";
import { Control } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, GitBranch } from "lucide-react";

// UI components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import LookupWorkflow from "@/components/lookup/LookupWorkflow";
import { enum_workflow_type } from "@/dtos/workflows.dto";

interface StoreRequisitionFormHeaderProps {
  readonly control: Control<SrCreate>;
  readonly mode: formType;
  readonly initData?: SrByIdDto;
  readonly buCode: string;
}

export default function StoreRequisitionFormHeader({
  control,
  mode,
  initData,
  buCode,
}: StoreRequisitionFormHeaderProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="details.workflow_id"
          required
          icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workflow</FormLabel>
              <FormControl>
                <LookupWorkflow
                  value={field.value}
                  onValueChange={field.onChange}
                  type={enum_workflow_type.purchase_request}
                  disabled={mode === formType.VIEW}
                  bu_code={buCode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SR Date */}
        <FormField
          control={control}
          name="details.sr_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">
                  {field.value ? format(new Date(field.value), "PPP") : "-"}
                </p>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expected Date */}
        <FormField
          control={control}
          name="details.expected_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Date</FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">
                  {field.value ? format(new Date(field.value), "PPP") : "-"}
                </p>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department (read-only from initData) */}
        <div>
          <p className="text-sm font-medium">Department</p>
          <p className="text-xs text-muted-foreground">{initData?.department_name || "-"}</p>
        </div>

        {/* From Location (read-only from initData) */}
        <div>
          <p className="text-sm font-medium">From Location</p>
          <p className="text-xs text-muted-foreground">{initData?.from_location_name || "-"}</p>
        </div>

        {/* To Location (read-only from initData) */}
        <div>
          <p className="text-sm font-medium">To Location</p>
          <p className="text-xs text-muted-foreground">{initData?.to_location_name || "-"}</p>
        </div>

        {/* Requestor (read-only from initData) */}
        <div>
          <p className="text-sm font-medium">Requestor</p>
          <p className="text-xs text-muted-foreground">{initData?.requestor_name || "-"}</p>
        </div>

        {/* Workflow (read-only from initData) */}
        <div>
          <p className="text-sm font-medium">Workflow</p>
          <p className="text-xs text-muted-foreground">{initData?.workflow_name || "-"}</p>
        </div>
      </div>

      {/* Description */}
      <FormField
        control={control}
        name="details.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            {mode === formType.VIEW ? (
              <p className="text-xs text-muted-foreground">{field.value}</p>
            ) : (
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

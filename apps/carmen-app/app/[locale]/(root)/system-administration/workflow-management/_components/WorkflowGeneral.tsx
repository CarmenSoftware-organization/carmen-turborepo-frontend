"use client";
import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { WorkflowCreateModel, workflowTypeField } from "@/dtos/workflows.dto";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
interface WorkflowGeneralProps {
  control: Control<WorkflowCreateModel>;
  isEditing: boolean;
}

const WorkflowGeneral = ({ control, isEditing }: WorkflowGeneralProps) => {
  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="space-y-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workflow Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={String(field.value || "")}
                    placeholder="Enter workflow name"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="workflow_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger id="workflow_type">
                      <SelectValue placeholder="Select Workflow Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workflowTypeField.map(({ label, value }) => (
                      <SelectItem key={value} value={value} className="cursor-pointer">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <Label className="text-sm text-muted-foreground">
                    {field.value ? "Active" : "Inactive"}
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="flex items-center space-x-2"></div> */}
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={String(field.value || "")}
                    placeholder="Enter description"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowGeneral;

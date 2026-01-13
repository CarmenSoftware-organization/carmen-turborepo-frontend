"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  WorkflowCreateModel,
  wfFormSchema,
  enum_sla_unit,
  enum_workflow_type,
  workflowTypeField,
} from "@/dtos/workflows.dto";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkflowMutation } from "@/hooks/use-workflow";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Switch } from "@/components/ui/switch";

export default function NewWorkflowPage() {
  const tWf = useTranslations("Workflow");
  const router = useRouter();
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: createWorkflow, isPending: isCreating } = useWorkflowMutation(token, buCode);

  const newId = uuidv4();

  const form = useForm<WorkflowCreateModel>({
    resolver: zodResolver(wfFormSchema),
    defaultValues: {
      id: newId,
      name: "",
      workflow_type: enum_workflow_type.purchase_request,
      is_active: true,
      description: "",
      data: {
        document_reference_pattern: "PR-{YYYY}-{MM}-{####}",
        stages: [
          {
            name: "Create Request",
            description: "Initial stage for creating and submitting requests",
            sla: "24",
            sla_unit: enum_sla_unit.hours,
            role: "create",
            creator_access: "only_creator",
            available_actions: {
              submit: {
                is_active: true,
                recipients: {
                  requestor: true,
                  current_approve: false,
                  next_step: true,
                },
              },
              approve: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
              reject: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
              sendback: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
            },
            hide_fields: {
              price_per_unit: false,
              total_price: false,
            },
            assigned_users: [],
          },
          {
            name: "Completed",
            description: "Workflow completed successfully",
            sla: "0",
            sla_unit: enum_sla_unit.hours,
            role: "approve",
            creator_access: "only_creator",
            available_actions: {
              submit: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
              approve: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
              reject: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
              sendback: {
                is_active: false,
                recipients: {
                  requestor: false,
                  current_approve: false,
                  next_step: false,
                },
              },
            },
            hide_fields: {
              price_per_unit: false,
              total_price: false,
            },
            assigned_users: [],
          },
        ],
        routing_rules: [],
        notifications: [],
        notification_templates: [],
        products: [],
      },
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: WorkflowCreateModel) => {
    createWorkflow(values, {
      onSuccess: (response: any) => {
        toastSuccess({ message: tWf("add_success") });
        queryClient.invalidateQueries({ queryKey: ["workflows", buCode] });
        const wfId = response?.data?.id || response?.id;
        if (wfId) {
          router.replace(`/system-administration/workflow-management/${wfId}`);
        }
      },
      onError: (error: Error) => {
        console.error("Error creating vendor:", error);
        toastError({ message: tWf("add_error") });
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Create New Workflow</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Set up a new workflow with basic information
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/system-administration/workflow-management">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workflows
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <main className="max-w-4xl mx-auto px-6 py-8">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Workflow Name */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    required
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Workflow Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., General Purchase Request Workflow" />
                        </FormControl>
                        {fieldState.error ? (
                          <FormMessage className="text-xs" />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Choose a descriptive name for your workflow
                          </p>
                        )}
                        {/* <FormMessage className="text-xs" /> */}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="workflow_type"
                    required
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Workflow Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          //disabled={!isEditing}
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
                        {fieldState.error ? (
                          <FormMessage className="text-xs" />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Select the type of workflow you want to create
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <Label className="text-sm text-muted-foreground">
                            {field.value ? "Active" : "Inactive"}
                          </Label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    required
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Description</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Describe the purpose and use case for this workflow..."
                          />
                        </FormControl>
                        {fieldState.error ? (
                          <FormMessage className="text-xs" />
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Provide a brief description to help others understand this workflow
                          </p>
                        )}
                        {/* <FormMessage className="text-xs" /> */}
                      </FormItem>
                    )}
                  />
                </div>

                {/* Default Configuration Info */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Plus className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium">Default Configuration</h4>
                        <p className="text-sm text-muted-foreground">
                          Your new workflow will start with two default stages:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                          <li>
                            <strong>Create Request</strong> - For initiating and submitting requests
                          </li>
                          <li>
                            <strong>Completed</strong> - For marking workflow completion
                          </li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-2">
                          After creating the workflow, you can add additional stages, configure
                          routing rules, and customize all settings from the workflow editor.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link href="/system-administration/workflow-management">Cancel</Link>
              </Button>
              <Button type="submit" size={"sm"}>
                {isCreating ? "Creating..." : "Create Workflow"}
              </Button>
            </div>
          </main>
        </form>
      </Form>
    </div>
  );
}

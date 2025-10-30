"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowGeneral from "./WorkflowGeneral";
import WorkflowStages from "./WorkflowStages";
import WorkflowRouting from "./WorkflowRouting";
import WorkflowProducts from "./WorkflowProducts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formType } from "@/dtos/form.dto";
import {
  enum_sla_unit,
  enum_workflow_type,
  wfFormSchema,
  WorkflowCreateModel,
} from "@/dtos/workflows.dto";
import { deleteWorkflow, handleSubmit } from "@/services/workflow";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";

interface WorkflowDetailProps {
  mode: formType;
  initialValues: WorkflowCreateModel | null;
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ mode, initialValues }) => {
  const { token, buCode } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(mode === formType.EDIT ? false : true);

  const form = useForm<WorkflowCreateModel>({
    resolver: zodResolver(wfFormSchema),
    defaultValues:
      mode === formType.EDIT && initialValues
        ? { ...initialValues }
        : {
            name: "",
            workflow_type: enum_workflow_type.purchase_request,
            data: {
              document_reference_pattern: "",
              stages: [
                {
                  name: "Request Creation",
                  description: "",
                  sla: "24",
                  sla_unit: enum_sla_unit.hours,
                  available_actions: {
                    submit: {
                      is_active: true,
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
                {
                  name: "Completed",
                  description: "",
                  sla: "0",
                  sla_unit: enum_sla_unit.hours,
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
            description: "",
            is_active: true,
          },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(false);
    if (initialValues) {
      form.reset({ ...initialValues });
    } else {
      router.push("/system-administration/workflow-management");
    }
  };

  // const handleSave = (updatedWorkflow: WorkflowCreateModel | undefined) => {
  // 	console.log(updatedWorkflow);
  // 	//setWorkflow(updatedWorkflow);
  // 	setIsEditing(false);
  // };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    try {
      const response = await deleteWorkflow(token, buCode, id);
      if (response.ok) {
        console.log("Successfully deleted");
        router.back();
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
      console.log("Failed to delete");
    }
    setIsEditing(false);
  };

  const stageNames = form.getValues("data")?.stages?.map((stage) => stage?.name) || [];

  const onSubmit = async (values: WorkflowCreateModel) => {
    try {
      const result = await handleSubmit(values, token, buCode, mode);
      if (result) {
        form.reset();
        console.log(
          mode === formType.ADD ? "Workflow created successfully" : "Workflow updated successfully"
        );
        if (mode === formType.ADD && result.id) {
          router.replace(`/system-administration/workflow-management/${result.id}`);
          setIsEditing(true);
        } else {
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
      console.log("Failed to save vendor");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/system-administration/workflow-management">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflows
        </Link>
      </Button>

      <Form.Form {...form}>
        <form>
          <WorkflowHeader
            form={form}
            mode={mode}
            isEditing={isEditing}
            onEdit={handleEdit}
            onCancelEdit={handleCancelEdit}
            onDelete={handleDelete}
            onSubmit={onSubmit}
          />

          <Tabs defaultValue="general">
            <TabsList className="mt-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="routing">Routing</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <WorkflowGeneral control={form.control} isEditing={isEditing} />
            </TabsContent>
            <TabsContent value="stages">
              <WorkflowStages form={form} control={form.control} isEditing={isEditing} />
            </TabsContent>
            <TabsContent value="routing">
              <WorkflowRouting
                form={form}
                control={form.control}
                stagesName={stageNames}
                isEditing={isEditing}
              />
            </TabsContent>

            <TabsContent value="products">
              <WorkflowProducts
                products={form.getValues("data")?.products || []}
                isEditing={isEditing}
                onSave={(products) => {
                  console.log(products);
                  // handleSave({
                  // 	...wfData,
                  // 	data: { ...form.getValues("data"), products },
                  // })
                }}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form.Form>
    </div>
  );
};

export default WorkflowDetail;

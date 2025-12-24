"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/form-custom/form";
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
  User,
  wfFormSchema,
  WorkflowCreateModel,
} from "@/dtos/workflows.dto";
import { deleteWorkflow, handleSubmit } from "@/services/workflow";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCreateWorkflowMutation, useUpdateWorkflowMutation } from "@/hooks/use-workflow";
import { toastSuccess } from "@/components/ui-custom/Toast";
import { ProductListDto } from "@/dtos/product.dto";
import { useQueryClient } from "@tanstack/react-query";

interface WorkflowDetailProps {
  mode: formType;
  initialValues?: WorkflowCreateModel;
  listUser: User[];
  listProduct: ProductListDto[];
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({
  mode,
  initialValues,
  listUser,
  listProduct,
}) => {
  const { token, buCode } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(mode === formType.EDIT ? false : true);
  const queryClient = useQueryClient();
  const createWorkflowMutation = useCreateWorkflowMutation();
  const updateWorkflowMutation = useUpdateWorkflowMutation();

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

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
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

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteWorkflow(token, buCode, id);
      if (response.ok) {
        console.log("Successfully deleted");
        queryClient.invalidateQueries({ queryKey: ["workflows", buCode] });
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
    console.log(values);
    try {
      if (mode === formType.ADD) {
        const result = (await createWorkflowMutation.mutateAsync({
          token,
          buCode,
          workflow: values,
        })) as { id?: string; data?: { id?: string } };

        toastSuccess({ message: "Workflow created successfully" });
        setIsEditing(true);
        const resultId = result?.id || result?.data?.id;
        if (resultId) {
          const newUrl = globalThis.location.pathname.replace("/new", `/${resultId}`);
          router.replace(newUrl);
        } else {
          console.warn("No ID found in create workflow response, redirecting to list");
          router.push("/system-administration/workflow-management");
        }
      } else {
        if (!values.id) {
          throw new Error("Product ID is required for update");
        }

        const result = (await updateWorkflowMutation.mutateAsync({
          token,
          buCode,
          id: values.id,
          workflow: values,
        })) as { id?: string; data?: { id?: string } };

        if (result) {
          toastSuccess({ message: "Workflow updated successfully" });
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      console.log("Failed to save workflow");
    }
  };

  return (
    <>
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/system-administration/workflow-management">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflows
        </Link>
      </Button>
      <Form {...form}>
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
              <WorkflowStages control={form.control} isEditing={isEditing} listUser={listUser} />
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
                form={form}
                listProduct={listProduct}
                isEditing={isEditing}
                onSave={(products) => {
                  form.setValue("data.products", products);
                }}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </>
  );
};

export default WorkflowDetail;

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Copy, Trash2, Save, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";

interface WorkflowHeaderProps {
  form: UseFormReturn<WorkflowCreateModel>;
  mode: formType;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onSubmit: (wf: WorkflowCreateModel) => void;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  form,
  mode,
  isEditing,
  onEdit,
  onCancelEdit,
  onDelete,
  onSubmit,
}: WorkflowHeaderProps) => {
  const tWf = useTranslations("Workflow");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4">
        {mode === formType.EDIT ? (
          <div>
            {isEditing ? (
              <>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl font-bold">{tWf("edit_workflow")}</CardTitle>
                </div>
                <CardDescription>ID: {form.getValues("id")}</CardDescription>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl font-bold">{form.getValues("name")}</CardTitle>
                  {form.getValues("is_active") && (
                    <Badge variant={form.getValues("is_active") ? "default" : "secondary"}>
                      {form.getValues("is_active") ? tWf("active") : tWf("inactive")}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  ID: {form.getValues("id")} | Type: {form.getValues("workflow_type")}
                </CardDescription>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle className="text-2xl font-bold">{tWf("create_workflow")}</CardTitle>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button type="button" variant="default" onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                {tWf("edit")}
              </Button>
              <Button type="button" variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                {tWf("duplicate")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(form.getValues("id") ?? "")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {tWf("delete")}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={onCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                {tWf("cancel")}
              </Button>
              <Button type="submit" variant="default" onClick={form.handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" />
                {tWf("save_changes")}
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <p className="text-sm text-muted-foreground">{form.getValues("description")}</p>
      </CardContent>
    </Card>
  );
};

export default WorkflowHeader;

"use client";

import { useState, useCallback } from "react";
import { formType } from "@/dtos/form.dto";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import DepartmentView from "./DepartmentView";
import DepartmentForm, { FormActions } from "./DepartmentForm";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Save, SquarePen, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

interface MainFormProps {
  readonly defaultValues?: DepartmentGetByIdDto;
  mode: formType;
}

export default function MainForm({ defaultValues, mode: initialMode }: MainFormProps) {
  const { token, buCode } = useAuth();
  const [currentMode, setCurrentMode] = useState<formType>(initialMode);
  const [formActions, setFormActions] = useState<FormActions | null>(null);
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tDataControls = useTranslations("DataControls");

  const isViewMode = currentMode === formType.VIEW;
  const isAddMode = currentMode === formType.ADD;

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  const handleActionsReady = useCallback((actions: FormActions) => {
    setFormActions(actions);
  }, []);

  // Get breadcrumb title based on mode
  const getBreadcrumbTitle = () => {
    if (isAddMode) return tDepartment("add_department");
    return defaultValues?.name || <Skeleton className="h-4 w-24 inline-block" />;
  };

  return (
    <div className="pb-10 space-y-4 mx-auto max-w-3xl">
      {/* Shared Header: Breadcrumb + Action buttons */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/configuration/department"
                  className="hover:text-primary transition-colors"
                >
                  {tDepartment("title")}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">{getBreadcrumbTitle()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isViewMode ? (
          <Button
            onClick={handleEditMode}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <SquarePen className="w-4 h-4" />
            {tCommon("edit")}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={formActions?.onCancel}
              variant="outline"
              size="sm"
              disabled={formActions?.isSaving}
              className="h-8 gap-1.5"
            >
              <X className="h-4 w-4" />
              {tDataControls("cancel")}
            </Button>
            <Button
              onClick={formActions?.onSave}
              variant="default"
              size="sm"
              disabled={formActions?.isSaving}
              className="h-8 gap-1.5"
            >
              <Save className="h-4 w-4" />
              {formActions?.isSaving ? tDataControls("saving") : tDataControls("save")}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {isViewMode ? (
        <DepartmentView initialData={defaultValues} />
      ) : (
        <DepartmentForm
          initialData={defaultValues}
          mode={currentMode as formType.ADD | formType.EDIT}
          onViewMode={handleViewMode}
          onActionsReady={handleActionsReady}
          token={token}
          buCode={buCode}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { formType } from "@/dtos/form.dto";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import DepartmentView from "./DepartmentView";
import DepartmentForm from "./DepartmentForm";

interface MainFormProps {
  readonly defaultValues?: DepartmentGetByIdDto;
  mode: formType;
}

export default function MainForm({ defaultValues, mode: initialMode }: MainFormProps) {
  const [currentMode, setCurrentMode] = useState<formType>(initialMode);

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  if (currentMode === formType.VIEW) {
    return <DepartmentView initialData={defaultValues} onEditMode={handleEditMode} />;
  }

  return (
    <DepartmentForm
      initialData={defaultValues}
      mode={currentMode as formType.ADD | formType.EDIT}
      onViewMode={handleViewMode}
    />
  );
}

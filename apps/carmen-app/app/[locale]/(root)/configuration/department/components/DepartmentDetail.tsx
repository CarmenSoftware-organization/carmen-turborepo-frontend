"use client";

import { useRouter } from "@/lib/navigation";
import { useState, useMemo, useEffect } from "react";
import { formType } from "@/dtos/form.dto";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import FormEdit from "./FormEdit";
import ViewDetail from "./ViewDetail";
import { DetailSkeleton } from "@/components/loading/DetailSkeleton";

interface DepartmentDetailProps {
  readonly defaultValues?: DepartmentGetByIdDto;
  readonly isLoading?: boolean;
  readonly mode: formType;
}

export default function DepartmentDetail({
  defaultValues,
  isLoading,
  mode,
}: DepartmentDetailProps) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const initUsers = useMemo(() => {
    return (
      defaultValues?.tb_department_user?.map((user) => ({
        key: user.user_id.toString(),
        title: user.firstname + " " + user.lastname,
        isHod: user.is_hod,
      })) || []
    );
  }, [defaultValues?.tb_department_user]);

  const [viewData, setViewData] = useState<{
    name: string;
    description: string;
    is_active: boolean;
    users: Array<{ key: string; title: string; isHod: boolean }>;
  }>({
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
    is_active: defaultValues?.is_active || false,
    users: initUsers,
  });

  useEffect(() => {
    setViewData({
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active || false,
      users: initUsers,
    });
  }, [defaultValues, initUsers]);

  const handleChangeMode = (mode: formType) => {
    setCurrentMode(mode);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSuccess = (data: any) => {
    setViewData({
      name: data.name,
      description: data.description || "",
      is_active: data.is_active || false,
      users: data.users || [],
    });
    setCurrentMode(formType.VIEW);
  };

  const handleBack = () => {
    if (currentMode === formType.EDIT) {
      handleChangeMode(formType.VIEW);
    } else {
      router.push("/configuration/department");
    }
  };

  const handleEdit = () => {
    handleChangeMode(formType.EDIT);
  };

  if (isLoading) {
    return <DetailSkeleton />
  }

  // แสดง FormEdit สำหรับ mode ADD และ EDIT
  if (currentMode !== formType.VIEW) {
    return (
      <FormEdit
        defaultValues={defaultValues}
        mode={currentMode}
        onSuccess={handleFormSuccess}
        onBack={handleBack}
      />
    );
  }

  // แสดง ViewDetail สำหรับ mode VIEW
  return (
    <ViewDetail
      data={viewData}
      onEdit={handleEdit}
      onBack={handleBack}
    />
  );
}

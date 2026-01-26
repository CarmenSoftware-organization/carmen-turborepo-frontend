"use client";

import { useAuth } from "@/context/AuthContext";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import { formType } from "@/dtos/form.dto";
import { useUserList } from "@/hooks/useUserList";
import { useState } from "react";

interface Props {
  readonly defaultValues?: DepartmentGetByIdDto;
  mode: formType;
}

interface User {
  id: string;
}

interface Hod {
  id: string;
}

interface DpFormValues {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  users: {
    add: [{ id: string }];
    remove: [{ id: string }];
  };
  hods: {
    add: [{ id: string }];
    remove: [{ id: string }];
  };
}

export default function FormDepartment({ defaultValues, mode }: Props) {
  const { token, buCode } = useAuth();
  const { userList, isLoading: isLoadingUsers } = useUserList(token, buCode);

  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  return (
    <div>
      <p>Department Form Component Mode: {mode}</p>
      <pre>{JSON.stringify(defaultValues, null, 2)}</pre>
    </div>
  );
}

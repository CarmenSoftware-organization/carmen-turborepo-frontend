"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DepartmentDetail from "../components/DepartmentDetail";
import { formType } from "@/dtos/form.dto";
import { useDepartmentByIdQuery } from "@/hooks/useDepartments";

export default function DepartmentIdPage() {
  const { token, tenantId } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data: department, isLoading } = useDepartmentByIdQuery(token, tenantId, id);

  if (!department) {
    return <div>Department not found</div>;
  }

  return (
    <DepartmentDetail
      defaultValues={department}
      isLoading={isLoading}
      mode={formType.VIEW}
    />
  );
}

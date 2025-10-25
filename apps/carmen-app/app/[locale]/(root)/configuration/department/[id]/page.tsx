"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DepartmentDetail from "../_components/DepartmentDetail";
import { formType } from "@/dtos/form.dto";
import { useDepartmentByIdQuery } from "@/hooks/useDepartments";

export default function DepartmentIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data: department, isLoading } = useDepartmentByIdQuery(token, buCode, id);

  return (
    <DepartmentDetail
      defaultValues={department}
      isLoading={isLoading}
      mode={formType.VIEW}
    />
  );
}

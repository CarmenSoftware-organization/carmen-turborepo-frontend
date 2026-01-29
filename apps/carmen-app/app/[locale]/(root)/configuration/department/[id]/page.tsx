"use client";

import { notFound, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { useDepartmentByIdQuery } from "@/hooks/use-departments";
import { DetailSkeleton } from "@/components/loading/DetailSkeleton";
import FormDepartment from "../_components/dp-form/FormDepartment";

export default function DepartmentIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useDepartmentByIdQuery(token, buCode, id);

  if (error) {
    notFound();
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return <FormDepartment defaultValues={data?.data} mode={formType.VIEW} />;
}

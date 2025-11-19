"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MainForm from "../_components/form/MainForm";
import { formType } from "@/dtos/form.dto";
import { useDepartmentByIdQuery } from "@/hooks/use-departments";
import { DetailSkeleton } from "@/components/loading/DetailSkeleton";

export default function DepartmentIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data: department, isLoading } = useDepartmentByIdQuery(token, buCode, id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return <MainForm defaultValues={department} mode={formType.VIEW} />;
}

"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { useRoleByIdQuery } from "@/hooks/use-role";
import { DetailSkeleton } from "@/components/loading/DetailSkeleton";
import RoleForm from "../_components/form/RoleForm";

export default function RoleIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { roleData, isLoading } = useRoleByIdQuery(token, buCode, id);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return <RoleForm initialData={roleData} mode={formType.EDIT} />;
}

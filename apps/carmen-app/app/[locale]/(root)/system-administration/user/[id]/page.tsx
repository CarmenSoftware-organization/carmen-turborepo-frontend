"use client";

import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import UserRoleDetail from "../_components/UserRoleDetail";
import { useUserRoleIdQuery } from "@/hooks/use-role";

interface UserIdPageProps {
  params: Promise<{ id: string }>;
}

export default function UserIdPage({ params }: UserIdPageProps) {
  const { id } = use(params);
  const { token, buCode } = useAuth();
  const { userData, isLoading, error } = useUserRoleIdQuery(token, buCode, id);

  return <UserRoleDetail dataUser={userData} isLoading={isLoading} isError={!!error} />;
}

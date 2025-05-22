"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getDepartmentById } from "@/services/department.service";
import { useAuth } from "@/context/AuthContext";
import DepartmentDetail from "../components/DepartmentDetail";
import { formType } from "@/dtos/form.dto";

export default function DepartmentIdPage() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const id = params.id as string;

    const { data: department, isLoading } = useQuery({
        queryKey: ["department", id],
        queryFn: () => getDepartmentById(
            token,
            tenantId,
            id
        ),
        enabled: !!id
    });

    return (
        <DepartmentDetail department={department} isLoading={isLoading} mode={formType.VIEW} />
    )
}
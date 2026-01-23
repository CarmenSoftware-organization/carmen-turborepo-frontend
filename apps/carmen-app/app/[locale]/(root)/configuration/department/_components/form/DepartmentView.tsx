"use client";

import { useTranslations } from "next-intl";
import { Building2, Users } from "lucide-react";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import UsersDepartment from "./UsersDepartment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DepartmentViewProps {
  readonly initialData?: DepartmentGetByIdDto;
}

export default function DepartmentView({ initialData }: DepartmentViewProps) {
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");

  const initUsers =
    initialData?.tb_department_user?.map((user) => ({
      key: user.user_id,
      title: user.firstname + " " + user.lastname,
      id: user.user_id,
      is_hod: user.is_hod,
    })) || [];

  const usersCount = initUsers.length;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {initialData?.name}
                </h2>
                <Badge variant="outline" className="mt-1.5 font-mono text-xs">
                  {initialData?.code}
                </Badge>
              </div>
            </div>
            <Badge
              variant={initialData?.is_active ? "default" : "destructive"}
              className="h-6 gap-1.5"
            >
              <span
                className={`h-2 w-2 rounded-full ${initialData?.is_active ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
              />
              {initialData?.is_active ? tCommon("active") : tCommon("inactive")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {tHeader("description")}
              </dt>
              <dd className="text-sm text-muted-foreground">{initialData?.description || "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">{tDepartment("users")}</h3>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {usersCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <UsersDepartment initUsers={initUsers} />
        </CardContent>
      </Card>
    </>
  );
}

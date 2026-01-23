"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  Building2,
  Users,
  Hash,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import UsersDepartment from "./UsersDepartment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DepartmentViewProps {
  readonly initialData?: DepartmentGetByIdDto;
}

export default function DepartmentView({ initialData }: DepartmentViewProps) {
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");

  const initUsers = useMemo(
    () =>
      initialData?.tb_department_user?.map((user) => ({
        key: user.user_id,
        title: user.firstname + " " + user.lastname,
        id: user.user_id,
        is_hod: user.is_hod,
      })) || [],
    [initialData?.tb_department_user]
  );

  const usersCount = initUsers.length;
  const hodCount = useMemo(
    () => initUsers.filter((user) => user.is_hod).length,
    [initUsers]
  );

  const isActive = initialData?.is_active;

  return (
    <div className="space-y-4">
      {/* Department Info Card - ERP Compact Layout */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Department Identity */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
                aria-hidden="true"
              >
                <Building2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2
                  className="text-lg font-semibold leading-none tracking-tight"
                  id="department-name"
                >
                  {initialData?.name || "-"}
                </h2>
                <Badge
                  variant="outline"
                  className="font-mono text-xs gap-1 h-5"
                >
                  <Hash className="h-3 w-3" aria-hidden="true" />
                  {initialData?.code || "-"}
                </Badge>
              </div>
            </div>

            {/* Status Badge - Matches OverviewTab pattern */}
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all",
                isActive
                  ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/10"
                  : "border-red-500/30 bg-red-50/50 dark:bg-red-950/10"
              )}
              role="status"
              aria-label={`${tCommon("status")}: ${isActive ? tCommon("active") : tCommon("inactive")}`}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  isActive
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                )}
                aria-hidden="true"
              >
                {isActive ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                )}
              >
                {isActive ? tCommon("active") : tCommon("inactive")}
              </span>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Department Details */}
        <CardContent className="pt-5">
          <dl aria-labelledby="department-name">
            {/* Description */}
            <div className="space-y-1.5">
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <FileText className="h-3 w-3" aria-hidden="true" />
                {tHeader("description")}
              </dt>
              <dd
                className={cn(
                  "text-sm leading-relaxed",
                  !initialData?.description && "text-muted-foreground italic"
                )}
              >
                {initialData?.description || tCommon("no_data")}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Users Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold">{tDepartment("users")}</h3>
              <Badge
                variant={usersCount > 0 ? "default" : "secondary"}
                className={cn(
                  "ml-1 h-5 px-1.5 text-xs transition-colors",
                  usersCount > 0 && "bg-primary"
                )}
              >
                {usersCount}
              </Badge>
            </div>

            {/* HOD Count indicator */}
            {hodCount > 0 && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 cursor-help">
                      <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {hodCount} {tDepartment("head_of_department")}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{tDepartment("hod_tooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <UsersDepartment initUsers={initUsers} />
        </CardContent>
      </Card>
    </div>
  );
}

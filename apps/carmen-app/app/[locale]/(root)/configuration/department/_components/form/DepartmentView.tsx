"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Building2, SquarePen, Users } from "lucide-react";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import UsersDepartment from "./UsersDepartment";
import { Link } from "@/lib/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentViewProps {
  readonly initialData?: DepartmentGetByIdDto;
  readonly onEditMode: () => void;
}

export default function DepartmentView({ initialData, onEditMode }: DepartmentViewProps) {
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");

  const initUsers =
    initialData?.tb_department_user?.map((user) => ({
      key: user.user_id,
      title: user.firstname + " " + user.lastname,
      id: user.user_id,
      isHod: user.is_hod,
    })) || [];

  const usersCount = initUsers.length;

  // Loading skeleton component
  if (!initialData) {
    return (
      <div className="space-y-4 mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-[240px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-auto max-w-3xl">
      {/* Header: Breadcrumb + Edit button */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/configuration/department"
                  className="hover:text-primary transition-colors"
                >
                  {tDepartment("title")}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">{initialData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onEditMode}
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <SquarePen className="w-4 h-4" />
                {tCommon("edit")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("edit")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {initialData.name}
                </h2>
                <Badge variant="outline" className="mt-1.5 font-mono text-xs">
                  {initialData.code}
                </Badge>
              </div>
            </div>
            <Badge
              variant={initialData.is_active ? "default" : "destructive"}
              className="h-6 gap-1.5"
            >
              <span
                className={`h-2 w-2 rounded-full ${initialData.is_active ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
              />
              {initialData.is_active ? tCommon("active") : tCommon("inactive")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Description - Full width */}
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {tHeader("description")}
              </dt>
              <dd className="text-sm text-muted-foreground">{initialData.description || "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Users Section */}
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
    </div>
  );
}

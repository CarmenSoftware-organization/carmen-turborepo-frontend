"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { Building2, MoreHorizontal, Trash2, Users } from "lucide-react";
import { DepartmentListItemDto } from "@/dtos/department.dto";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CardLoading from "@/components/loading/CardLoading";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface DepartmentGridProps {
  readonly departments: DepartmentListItemDto[];
  readonly isLoading: boolean;
  readonly onDelete?: (department: DepartmentListItemDto) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function DepartmentGrid({
  departments,
  isLoading,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: DepartmentGridProps) {
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tDepartment = useTranslations("Department");

  const handleCardClick = (id: string) => {
    if (canUpdate) {
      router.push(`/configuration/department/${id}`);
    }
  };

  if (isLoading) {
    return <CardLoading items={6} />;
  }

  if (departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
        <Building2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-medium mb-1">{tCommon("no_data")}</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          {tDepartment("no_departments_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => (
        <Card
          key={department.id}
          className={`hover:shadow-md transition-shadow group ${
            canUpdate ? "cursor-pointer" : ""
          }`}
          onClick={() => handleCardClick(department.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                  {department.name}
                </CardTitle>
                <CardDescription className="text-sm mt-1 truncate">
                  {department.code}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusCustom is_active={department.is_active}>
                  {department.is_active ? tCommon("active") : tCommon("inactive")}
                </StatusCustom>
                {canDelete && onDelete && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(department);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        {tCommon("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {department.description && (
                <p className="text-muted-foreground line-clamp-2">{department.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, Save, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useRoleMutation, useUpdateRole } from "@/hooks/use-role";
import {
  RoleDto,
  RoleCreateDto,
  RoleUpdateDto,
  RolePermissionPayloadDto,
  createRoleCreateSchema,
  createRoleUpdateSchema,
} from "@/dtos/role.dto";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@/lib/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { usePermissionQuery } from "@/hooks/use-permission";
import PermissionSelector from "./PermissionSelector";

interface RoleFormProps {
  readonly initialData?: RoleDto;
  readonly mode: formType;
}

export default function RoleForm({ initialData, mode }: RoleFormProps) {
  const router = useRouter();
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();
  const tRole = useTranslations("Role");
  const tCommon = useTranslations("Common");
  const tDataControls = useTranslations("DataControls");

  const { permissions } = usePermissionQuery(token, buCode);

  const isAddMode = mode === formType.ADD;
  const isEditMode = mode === formType.EDIT;

  const roleSchema = useMemo(() => {
    if (isAddMode) {
      return createRoleCreateSchema({
        nameRequired: tRole("pls_fill_role_name"),
      });
    }
    return createRoleUpdateSchema({
      nameRequired: tRole("pls_fill_role_name"),
    });
  }, [isAddMode, tRole]);

  const roleName = initialData?.application_role_name || initialData?.name || "";

  const form = useForm<RoleCreateDto | RoleUpdateDto>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      ...(isEditMode && { id: initialData?.id }),
      application_role_name: roleName,
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const { mutate: createRole, isPending: isCreating } = useRoleMutation(token, buCode);
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole(token, buCode);

  useEffect(() => {
    form.clearErrors();
    const nameValue = initialData?.application_role_name || initialData?.name || "";
    const resetValues = isEditMode
      ? {
          id: initialData?.id,
          application_role_name: nameValue,
          description: initialData?.description || "",
          is_active: initialData?.is_active ?? true,
        }
      : {
          application_role_name: nameValue,
          description: initialData?.description || "",
          is_active: true,
        };

    form.reset(resetValues);
  }, [mode, initialData, form, isEditMode]);

  const handleCancel = () => {
    router.back();
  };

  const handlePermissionChange = (payload: RolePermissionPayloadDto) => {
    const hasChanges = (payload.add?.length ?? 0) > 0 || (payload.remove?.length ?? 0) > 0;
    form.setValue("permissions", hasChanges ? payload : undefined);
  };

  const onSubmit = (data: RoleCreateDto | RoleUpdateDto) => {
    if (isAddMode) {
      createRole(data as RoleCreateDto, {
        onSuccess: (response) => {
          const result = response as { data: { id: string } };
          toastSuccess({ message: tRole("create_success") });
          queryClient.invalidateQueries({ queryKey: ["roles", buCode] });
          router.replace(`/system-administration/role/${result.data.id}`);
        },
        onError: (error: unknown) => {
          console.error("Error creating role:", error);
          toastError({ message: tRole("create_error") });
        },
      });
    } else {
      updateRole(data as RoleUpdateDto, {
        onSuccess: () => {
          toastSuccess({ message: tRole("update_success") });
          queryClient.invalidateQueries({ queryKey: ["roles", buCode] });
          queryClient.invalidateQueries({ queryKey: ["role-id", initialData?.id] });
          router.back();
        },
        onError: (error: unknown) => {
          console.error("Error updating role:", error);
          toastError({ message: tRole("update_error") });
        },
      });
    }
  };

  return (
    <div className="space-y-4 mx-auto max-w-3xl pb-10">
      {/* Header: Breadcrumb + Action buttons */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/system-administration/role"
                  className="hover:text-primary transition-colors"
                >
                  {tRole("title")}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                {isAddMode ? tRole("add_role") : roleName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isCreating || isUpdating}
                  className="h-8 gap-1.5"
                >
                  <X className="h-4 w-4" />
                  {tDataControls("cancel")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tDataControls("cancel")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  variant="default"
                  size="sm"
                  disabled={isCreating || isUpdating}
                  className="h-8 gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  {isCreating || isUpdating ? tDataControls("saving") : tDataControls("save")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tDataControls("save")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Overview Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-none tracking-tight">
                    {isAddMode ? tRole("add_role") : tRole("edit_role")}
                  </h2>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="application_role_name"
                required
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCommon("name")}</FormLabel>
                    <FormControl>
                      <InputValidate {...field} maxLength={100} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <PermissionSelector
            allPermissions={permissions || []}
            initialPermissions={initialData?.permissions || []}
            onChange={handlePermissionChange}
          />
        </form>
      </Form>
    </div>
  );
}

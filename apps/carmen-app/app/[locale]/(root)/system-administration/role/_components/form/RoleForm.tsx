"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, Save, X, Pencil, Trash2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { roleKeyDetails, roleKeyList, useRoleMutation, useUpdateRole, useDeleteRole } from "@/hooks/use-role";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
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
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";

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
  const [currentMode, setCurrentMode] = useState(mode);

  const { permissions } = usePermissionQuery(token, buCode, { perpage: -1 });

  const isAddMode = currentMode === formType.ADD;
  const isEditMode = currentMode === formType.EDIT;
  const isViewMode = currentMode === formType.VIEW;

  // Track unsaved changes
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isSubmittingRef = useRef(false);

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
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole(token, buCode);

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

  const handleCancel = useCallback(() => {
    const isDirty = form.formState.isDirty;
    if (isDirty) {
      setShowUnsavedDialog(true);
      return;
    }
    if (isEditMode) {
      setCurrentMode(formType.VIEW);
    } else {
      router.back();
    }
  }, [form.formState.isDirty, isEditMode, router]);

  const handleConfirmCancel = () => {
    setShowUnsavedDialog(false);
    router.back();
  };

  const handleDelete = () => {
    if (!initialData?.id) return;
    deleteRole(initialData.id, {
      onSuccess: () => {
        toastSuccess({ message: tRole("del_success") });
        queryClient.invalidateQueries({ queryKey: [roleKeyList, buCode] });
        router.replace("/system-administration/role");
      },
      onError: (error: unknown) => {
        console.error("Error deleting role:", error);
        toastError({ message: tRole("del_error") });
      },
    });
  };

  const handlePermissionChange = (payload: RolePermissionPayloadDto, _totalSelected: number) => {
    const hasChanges = (payload.add?.length ?? 0) > 0 || (payload.remove?.length ?? 0) > 0;
    form.setValue("permissions", hasChanges ? payload : undefined, { shouldDirty: true });
  };

  // Browser beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty && !isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  const onSubmit = (data: RoleCreateDto | RoleUpdateDto) => {
    isSubmittingRef.current = true;
    if (isAddMode) {
      createRole(data as RoleCreateDto, {
        onSuccess: (response) => {
          const result = response as { data: { id: string } };
          toastSuccess({ message: tRole("create_success") });
          queryClient.invalidateQueries({ queryKey: [roleKeyList, buCode] });
          router.replace(`/system-administration/role/${result.data.id}`);
        },
        onError: (error: unknown) => {
          isSubmittingRef.current = false;
          console.error("Error creating role:", error);
          toastError({ message: tRole("create_error") });
        },
      });
    } else {
      updateRole(data as RoleUpdateDto, {
        onSuccess: () => {
          toastSuccess({ message: tRole("update_success") });
          queryClient.invalidateQueries({ queryKey: [roleKeyList, buCode] });
          queryClient.invalidateQueries({ queryKey: [roleKeyDetails, initialData?.id] });
          router.back();
        },
        onError: (error: unknown) => {
          isSubmittingRef.current = false;
          console.error("Error updating role:", error);
          toastError({ message: tRole("update_error") });
        },
      });
    }
  };

  return (
    <div className="space-y-4 mx-auto max-w-5xl pb-10">
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
          {isViewMode ? (
            <Button
              onClick={() => setCurrentMode(formType.EDIT)}
              variant="default"
              size="sm"
              className="h-8 gap-1.5"
            >
              <Pencil className="h-4 w-4" />
              {tDataControls("edit")}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isCreating || isUpdating || isDeleting}
                className="h-8 gap-1.5"
              >
                <X className="h-4 w-4" />
                {tDataControls("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                size="sm"
                disabled={isCreating || isUpdating || isDeleting}
                className="h-8 gap-1.5"
              >
                <Save className="h-4 w-4" />
                {isCreating || isUpdating ? tDataControls("saving") : tDataControls("save")}
              </Button>
              {isEditMode && (
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  size="sm"
                  disabled={isCreating || isUpdating || isDeleting}
                  className="h-8 gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  {tDataControls("delete")}
                </Button>
              )}
            </>
          )}
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
                    {isAddMode && tRole("add_role")}
                    {isViewMode && tRole("view_role")}
                    {isEditMode && tRole("edit_role")}
                  </h2>
                  <CardDescription className="mt-1.5">
                    {isAddMode && tRole("add_role_description")}
                    {isViewMode && tRole("view_role_description")}
                    {isEditMode && tRole("edit_role_description")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <FormField
                control={form.control}
                name="application_role_name"
                required
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tCommon("name")}</FormLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        maxLength={100}
                        placeholder={tRole("role_name_placeholder")}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {tCommon("description")}
                    </FormLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        placeholder={tRole("role_description_placeholder")}
                        className="resize-none"
                        maxLength={256}
                        disabled={isViewMode}
                      />
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
            disabled={isViewMode}
          />
        </form>
      </Form>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCommon("unsaved_changes")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tCommon("unsaved_changes_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("stay")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {tCommon("discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={tRole("del_role")}
        description={tRole("del_role_description")}
        isLoading={isDeleting}
      />
    </div>
  );
}

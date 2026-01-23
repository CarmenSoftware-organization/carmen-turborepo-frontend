"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Building2, Users, AlertCircle, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useDepartmentMutation, useDepartmentUpdateMutation } from "@/hooks/use-departments";
import { useUserList } from "@/hooks/useUserList";
import {
  createDepartmentSchema,
  createDepartmentUpdateSchema,
  DepartmentFormData,
} from "../../_schemas/department-form.schema";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";
import { UserListDto } from "@/dtos/user.dto";
import OverviewTab from "./OverviewTab";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UsersCard from "./UsersCard";

export interface FormActions {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

interface DepartmentFormProps {
  readonly initialData?: DepartmentGetByIdDto;
  readonly mode: formType.ADD | formType.EDIT;
  readonly onViewMode: () => void;
  readonly onActionsReady?: (actions: FormActions) => void;
}

export default function DepartmentForm({
  initialData,
  mode,
  onViewMode,
  onActionsReady,
}: DepartmentFormProps) {
  const router = useRouter();
  const { token, buCode } = useAuth();
  const { userList, isLoading: isLoadingUsers } = useUserList(token, buCode);
  const queryClient = useQueryClient();
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");

  const isAddMode = mode === formType.ADD;
  const isEditMode = mode === formType.EDIT;

  // Track form dirty state for unsaved changes warning
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const departmentSchema = useMemo(() => {
    if (isAddMode) {
      return createDepartmentSchema({
        nameRequired: tDepartment("name_required"),
        codeRequired: tDepartment("code_required"),
      });
    }
    return createDepartmentUpdateSchema({
      nameRequired: tDepartment("name_required"),
      codeRequired: tDepartment("code_required"),
    });
  }, [isAddMode, tDepartment]);

  const initUsers = useMemo(() => {
    return (
      initialData?.tb_department_user?.map((user) => ({
        key: user.user_id,
        title: user.firstname + " " + user.lastname,
        id: user.user_id,
        is_hod: user.is_hod,
      })) || []
    );
  }, [initialData?.tb_department_user]);

  const availableUsers = useMemo(() => {
    if (!userList) return [];

    const initUserIds = new Set(initUsers.map((user) => user.key.toString()));

    return userList
      .filter((user: UserListDto) => !initUserIds.has(user.user_id))
      .map((user: UserListDto) => ({
        key: user.user_id,
        title: user.firstname + " " + user.lastname,
      }));
  }, [userList, initUsers]);

  const [targetKeys, setTargetKeys] = useState<string[]>(
    initUsers.map((user) => user.key.toString())
  );

  const [hodStates, setHodStates] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    for (const user of initUsers) {
      initialState[user.key.toString()] = user.is_hod || false;
    }
    return initialState;
  });

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      ...(isEditMode && { id: initialData?.id }),
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
      is_active: initialData?.is_active || false,
      users: {
        add: [],
        update: [],
        remove: [],
      },
    },
  });

  const { mutate: createDepartment, isPending: isCreating } = useDepartmentMutation(token, buCode);
  const { mutate: updateDepartment, isPending: isUpdating } = useDepartmentUpdateMutation(
    token,
    buCode,
    initialData?.id ?? ""
  );

  useEffect(() => {
    form.clearErrors();
    const resetValues = isEditMode
      ? {
          id: initialData?.id,
          name: initialData?.name || "",
          code: initialData?.code || "",
          description: initialData?.description || "",
          is_active: initialData?.is_active || false,
          users: {
            add: [],
            update: [],
            remove: [],
          },
        }
      : {
          name: "",
          code: "",
          description: "",
          is_active: false,
          users: {
            add: [],
            update: [],
            remove: [],
          },
        };

    form.reset(resetValues);

    const newHodStates: Record<string, boolean> = {};
    for (const user of initUsers) {
      newHodStates[user.key.toString()] = user.is_hod || false;
    }
    setHodStates(newHodStates);

    setTargetKeys(initUsers.map((user) => user.key.toString()));
  }, [mode, initialData, form, initUsers, isEditMode]);

  const handleCancel = () => {
    if (isEditMode) {
      onViewMode();
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    form.handleSubmit(onSubmit)();
  };

  useEffect(() => {
    onActionsReady?.({
      onSave: handleSave,
      onCancel: handleCancel,
      isSaving: isCreating || isUpdating,
    });
  }, [isCreating, isUpdating, onActionsReady]);

  // Watch for form changes to track dirty state
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Check if form has validation errors
  const formErrors = form.formState.errors;
  const hasErrors = Object.keys(formErrors).length > 0;

  const onSubmit = (data: DepartmentFormData) => {
    const currentUsers = {
      add: data.users?.add || [],
      update: data.users?.update || [],
      remove: data.users?.remove || [],
    };
    const updatedData = {
      ...data,
      id: initialData?.id ?? "",
      users: {
        add: currentUsers.add.map((user) => ({
          ...user,
          is_hod: hodStates[user.id || ""] || false,
        })),
        update: currentUsers.update.map((user) => ({
          ...user,
          is_hod: hodStates[user.id || ""] || false,
        })),
        remove: currentUsers.remove,
      },
    };

    if (isAddMode) {
      createDepartment(updatedData, {
        onSuccess: (data) => {
          const response = data as { data: { id: string } };
          toastSuccess({ message: tDepartment("add_success") });
          queryClient.invalidateQueries({ queryKey: ["departments", buCode] });
          router.replace(`/configuration/department/${response.data.id}`);
        },
        onError: () => {
          toastError({ message: tDepartment("add_error") });
        },
      });
    } else {
      updateDepartment(updatedData, {
        onSuccess: () => {
          toastSuccess({ message: tDepartment("edit_success") });
          queryClient.invalidateQueries({ queryKey: ["departments", buCode] });
          queryClient.invalidateQueries({ queryKey: ["department-id", initialData?.id] });
          onViewMode();
        },
        onError: () => {
          toastError({ message: tDepartment("edit_error") });
        },
      });
    }
  };

  // Loading skeleton for users section
  const UsersLoadingSkeleton = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label={isAddMode ? tDepartment("add_department") : tDepartment("edit_department")}
      >
        {/* Form Error Summary */}
        {hasErrors && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{tCommon("form_has_errors")}</AlertTitle>
            <AlertDescription>{tCommon("please_fix_errors")}</AlertDescription>
          </Alert>
        )}

        {/* Saving Indicator */}
        {(isCreating || isUpdating) && (
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              {isAddMode ? tDepartment("creating_department") : tDepartment("updating_department")}
            </AlertDescription>
          </Alert>
        )}

        {/* Department Info Card */}
        <Card
          className={cn(
            "overflow-hidden transition-shadow",
            hasErrors && "ring-2 ring-destructive/20"
          )}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isAddMode
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-primary/10 text-primary"
                )}
              >
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {isAddMode ? tDepartment("add_department") : tDepartment("edit_department")}
                </h2>
                <CardDescription className="mt-1.5">
                  {isAddMode
                    ? tDepartment("add_department_description")
                    : tDepartment("edit_department_description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <OverviewTab form={form} isViewMode={false} />
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-sm font-semibold">{tDepartment("users")}</h3>
                <Badge
                  variant={targetKeys.length > 0 ? "default" : "secondary"}
                  className={cn(
                    "ml-1 h-5 px-1.5 text-xs transition-colors",
                    targetKeys.length > 0 && "bg-primary"
                  )}
                >
                  {targetKeys.length}
                </Badge>
              </div>
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20"
                >
                  {tCommon("unsaved_changes")}
                </Badge>
              )}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {isLoadingUsers ? (
              <UsersLoadingSkeleton />
            ) : (
              <UsersCard
                form={form}
                isViewMode={false}
                availableUsers={availableUsers}
                initUsers={initUsers}
                targetKeys={targetKeys}
                setTargetKeys={setTargetKeys}
                hodStates={hodStates}
                setHodStates={setHodStates}
              />
            )}
          </CardContent>
        </Card>

        <output className="sr-only" aria-live="polite">
          {isCreating && tDepartment("creating_department")}
          {isUpdating && tDepartment("updating_department")}
        </output>
      </form>
    </Form>
  );
}

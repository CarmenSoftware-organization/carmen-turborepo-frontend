"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Building2, Users } from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  const { userList } = useUserList(token, buCode);
  const queryClient = useQueryClient();
  const tDepartment = useTranslations("Department");

  const isAddMode = mode === formType.ADD;
  const isEditMode = mode === formType.EDIT;

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {isAddMode ? tDepartment("add_department") : tDepartment("edit_department")}
                </h2>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <OverviewTab form={form} isViewMode={false} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">{tDepartment("users")}</h3>
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {targetKeys.length}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

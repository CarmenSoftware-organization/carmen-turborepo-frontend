"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PenBoxIcon, Save, X } from "lucide-react";
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
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import OverviewTab from "./OverviewTab";
import UsersTab from "./UsersTab";

interface MainFormProps {
  readonly defaultValues?: DepartmentGetByIdDto;
  mode: formType;
}

export default function MainForm({ defaultValues, mode: initialMode }: MainFormProps) {
  const router = useRouter();
  const { token, buCode } = useAuth();
  const { userList } = useUserList(token, buCode);
  const tDepartment = useTranslations("Department");
  const tDataControls = useTranslations("DataControls");
  const tCommon = useTranslations("Common");

  const [mode, setMode] = useState<formType>(initialMode);
  const isViewMode = mode === formType.VIEW;
  const isEditMode = mode === formType.EDIT;
  const isAddMode = mode === formType.ADD;

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

  const availableUsers = useMemo(() => {
    return userList?.map((user: any) => ({
      key: user.user_id,
      title: user.firstname + " " + user.lastname,
    }));
  }, [userList]);

  const initUsers = useMemo(() => {
    return (
      defaultValues?.tb_department_user?.map((user) => ({
        key: user.user_id,
        title: user.firstname + " " + user.lastname,
        id: user.user_id,
        isHod: user.is_hod,
      })) || []
    );
  }, [defaultValues?.tb_department_user]);

  const [targetKeys, setTargetKeys] = useState<string[]>(
    initUsers.map((user) => user.key.toString())
  );

  const [hodStates, setHodStates] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    for (const user of initUsers) {
      initialState[user.key.toString()] = user.isHod || false;
    }
    return initialState;
  });

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      ...(isEditMode && { id: defaultValues?.id }),
      name: defaultValues?.name || "",
      code: defaultValues?.code || "",
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active || false,
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
    defaultValues?.id ?? ""
  );

  useEffect(() => {
    form.clearErrors();
    const resetValues =
      isEditMode || isViewMode
        ? {
            id: defaultValues?.id,
            name: defaultValues?.name || "",
            code: defaultValues?.code || "",
            description: defaultValues?.description || "",
            is_active: defaultValues?.is_active || false,
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
      newHodStates[user.key.toString()] = user.isHod || false;
    }
    setHodStates(newHodStates);

    setTargetKeys(initUsers.map((user) => user.key.toString()));
  }, [mode, defaultValues, form, initUsers, isEditMode, isViewMode]);

  const handleEdit = () => {
    setMode(formType.EDIT);
  };

  const handleCancel = () => {
    if (isEditMode) {
      setMode(formType.VIEW);
    } else {
      router.back();
    }
  };

  const onSubmit = (data: DepartmentFormData) => {
    const currentUsers = {
      add: data.users?.add || [],
      update: data.users?.update || [],
      remove: data.users?.remove || [],
    };

    const updatedData = {
      ...data,
      users: {
        add: currentUsers.add.map((user) => ({
          ...user,
          isHod: hodStates[user.id || ""] || false,
        })),
        update: currentUsers.update.map((user) => ({
          ...user,
          isHod: hodStates[user.id || ""] || false,
        })),
        remove: currentUsers.remove,
      },
    };

    if (isAddMode) {
      createDepartment(updatedData as any, {
        onSuccess: (data: unknown) => {
          const response = data as { id: string };
          toastSuccess({ message: tDepartment("add_success") });
          router.replace(`/configuration/department/${response.id}`);
        },
        onError: (error: unknown) => {
          console.error("Error creating department:", error);
          toastError({ message: tDepartment("add_error") });
        },
      });
    } else {
      updateDepartment(updatedData as any, {
        onSuccess: () => {
          toastSuccess({ message: tDepartment("edit_success") });
          setMode(formType.VIEW);
        },
        onError: (error: unknown) => {
          console.error("Error updating department:", error);
          toastError({ message: tDepartment("edit_error") });
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto pt-2">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/configuration/department")}
            variant="outlinePrimary"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isAddMode
                  ? tDepartment("add_department")
                  : defaultValues?.name || tDepartment("title")}
              </h1>
              {!isAddMode && defaultValues?.is_active !== undefined && (
                <StatusCustom is_active={defaultValues.is_active}>
                  {defaultValues.is_active ? tCommon("active") : tCommon("inactive")}
                </StatusCustom>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isViewMode && (
            <Button onClick={handleEdit} size="sm">
              <PenBoxIcon className="h-4 w-4" />
              {tCommon("edit")}
            </Button>
          )}

          {(isEditMode || isAddMode) && (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isCreating || isUpdating}
              >
                <X className="h-4 w-4 mr-2" />
                {tDataControls("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                size="sm"
                disabled={isCreating || isUpdating}
              >
                <Save className="h-4 w-4 mr-2" />
                {isCreating || isUpdating ? tDataControls("saving") : tDataControls("save")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 pb-8">
            <OverviewTab form={form} isViewMode={isViewMode} department={defaultValues} />
            <UsersTab
              form={form}
              isViewMode={isViewMode}
              availableUsers={availableUsers}
              initUsers={initUsers}
              targetKeys={targetKeys}
              setTargetKeys={setTargetKeys}
              hodStates={hodStates}
              setHodStates={setHodStates}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

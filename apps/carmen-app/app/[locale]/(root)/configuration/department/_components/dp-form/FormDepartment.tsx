"use client";

import { useAuth } from "@/context/AuthContext";
import {
  createDpFormSchema,
  DepartmentGetByIdDto,
  DepartmentUserDto,
  DpFormValuesDto,
} from "@/dtos/department.dto";
import { formType } from "@/dtos/form.dto";
import { useUserList } from "@/hooks/useUserList";
import { useMemo, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Save, X, Pencil, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";
import FormBoolean from "@/components/form-custom/form-boolean";
import { Transfer } from "@/components/ui-custom/Transfer";
import transferHandler from "@/components/form-custom/TransferHandler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useRouter } from "@/lib/navigation";
import {
  departmentIdKey,
  departmentKey,
  useDepartmentMutation,
  useDepartmentUpdateMutation,
  useDepartmentDeleteMutation,
} from "@/hooks/use-departments";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface Props {
  readonly defaultValues?: DepartmentGetByIdDto;
  mode: formType;
  onViewMode?: () => void;
}

interface UserItem {
  key: string;
  title: string;
}

export default function FormDepartment({ defaultValues, mode, onViewMode }: Props) {
  const { token, buCode } = useAuth();
  const { userList, isLoading: isLoadingUsers } = useUserList(token, buCode);
  const router = useRouter();
  const queryClient = useQueryClient();

  const tDepartment = useTranslations("Department");

  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const createMutation = useDepartmentMutation(token, buCode);
  const updateMutation = useDepartmentUpdateMutation(token, buCode, defaultValues?.id || "");
  const deleteMutation = useDepartmentDeleteMutation(token, buCode);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isViewMode = currentMode === formType.VIEW;
  const isAddMode = currentMode === formType.ADD;

  const departmentSchema = useMemo(
    () =>
      createDpFormSchema({
        nameRequired: tDepartment("name_required"),
        codeRequired: tDepartment("code_required"),
      }),
    [tDepartment]
  );

  const listUserForDepartment: UserItem[] = useMemo(
    () =>
      userList
        ?.filter((user: { department?: { id?: string } }) => !user.department?.id)
        .map((user: { user_id: string; firstname: string; lastname: string }) => ({
          key: user.user_id,
          title: `${user.firstname} ${user.lastname}`,
        })) || [],
    [userList]
  );

  const listUserForHod: UserItem[] = useMemo(
    () =>
      userList?.map((user: { user_id: string; firstname: string; lastname: string }) => ({
        key: user.user_id,
        title: `${user.firstname} ${user.lastname}`,
      })) || [],
    [userList]
  );

  const initDepartmentUsers: UserItem[] = useMemo(
    () =>
      defaultValues?.department_users?.map((user: DepartmentUserDto) => ({
        key: user.user_id,
        title: `${user.firstname} ${user.lastname}`,
      })) || [],
    [defaultValues?.department_users]
  );

  const initHodUsers: UserItem[] = useMemo(
    () =>
      defaultValues?.hod_users?.map((user: DepartmentUserDto) => ({
        key: user.user_id,
        title: `${user.firstname} ${user.lastname}`,
      })) || [],
    [defaultValues?.hod_users]
  );

  const initDepartmentUserKeys = useMemo(
    () => initDepartmentUsers.map((user) => user.key),
    [initDepartmentUsers]
  );

  const initHodUserKeys = useMemo(() => initHodUsers.map((user) => user.key), [initHodUsers]);

  const [selectedDepartmentUsers, setSelectedDepartmentUsers] = useState<(string | number)[]>([]);
  const [selectedHodUsers, setSelectedHodUsers] = useState<(string | number)[]>([]);

  const form = useForm<DpFormValuesDto>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      code: defaultValues?.code || "",
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active ?? true,
      department_users: {
        add: [],
        remove: [],
      },
      hod_users: {
        add: [],
        remove: [],
      },
    },
  });

  useEffect(() => {
    if (initDepartmentUserKeys.length > 0) {
      setSelectedDepartmentUsers(initDepartmentUserKeys);
    }
  }, [initDepartmentUserKeys]);

  useEffect(() => {
    if (initHodUserKeys.length > 0) {
      setSelectedHodUsers(initHodUserKeys);
    }
  }, [initHodUserKeys]);

  const handleViewMode = () => {
    setCurrentMode(formType.VIEW);
    onViewMode?.();
  };

  const handleEditMode = () => {
    setCurrentMode(formType.EDIT);
  };

  const handleDepartmentUsersChange = transferHandler({
    form,
    fieldName: "department_users",
    setSelected: setSelectedDepartmentUsers,
  });

  const handleHodUsersChange = transferHandler({
    form,
    fieldName: "hod_users",
    setSelected: setSelectedHodUsers,
  });

  const onCancel = () => {
    if (currentMode === formType.EDIT) {
      form.reset();
      setSelectedDepartmentUsers(initDepartmentUserKeys);
      setSelectedHodUsers(initHodUserKeys);
      handleViewMode();
    } else {
      router.back();
    }
  };

  const handleSubmit = (data: DpFormValuesDto) => {
    if (currentMode === formType.EDIT && defaultValues?.id) {
      updateMutation.mutate(
        { ...data, id: defaultValues.id },
        {
          onSuccess: () => {
            toastSuccess({ message: "Edit success" });
            queryClient.invalidateQueries({
              queryKey: [departmentIdKey, defaultValues.id],
            });
            queryClient.invalidateQueries({ queryKey: [departmentKey, buCode] });
            handleViewMode();
          },
          onError: () => {
            toastError({ message: "Edit error" });
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: (response: unknown) => {
          const res = response as { data?: { id?: string } };
          if (res?.data?.id) {
            toastSuccess({ message: "Add success" });
            router.push(`/configuration/department/${res.data.id}`);
            queryClient.invalidateQueries({ queryKey: [departmentKey, buCode] });
            handleViewMode();
          }
        },
        onError: () => {
          toastError({ message: "Add error" });
        },
      });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (defaultValues?.id) {
      deleteMutation.mutate(defaultValues.id, {
        onSuccess: () => {
          toastSuccess({ message: "Delete success" });
          queryClient.invalidateQueries({ queryKey: [departmentKey, buCode] });
          setDeleteDialogOpen(false);
          router.push("/configuration/department");
        },
        onError: () => {
          toastError({ message: "Delete error" });
          setDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <>
      <div className="m-4 pb-10">
        <div className="sticky top-0 z-20 bg-background border-b border-border">
          <div className="flex items-center justify-between mb-2 pb-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link className="text-xs" href="/configuration/department">
                      Department
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {isAddMode ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold">Add Department</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold">
                      {defaultValues?.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-end gap-2">
              {isViewMode ? (
                <>
                  <Button size="sm" onClick={handleEditMode}>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  {!isAddMode && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FormProvider {...form}>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  required
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <InputValidate
                          {...field}
                          disabled={isViewMode}
                          maxLength={20}
                          placeholder="Enter code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  required
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <InputValidate
                          {...field}
                          disabled={isViewMode}
                          maxLength={100}
                          placeholder="Enter name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextareaValidate
                        {...field}
                        disabled={isViewMode}
                        maxLength={500}
                        placeholder="Enter description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormBoolean
                        value={field.value}
                        onChange={field.onChange}
                        label="Active"
                        type="checkbox"
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="department_users">
                <TabsList>
                  <TabsTrigger value="department_users">Department Users</TabsTrigger>
                  <TabsTrigger value="hod_users">HOD Users</TabsTrigger>
                </TabsList>
                <TabsContent value="department_users">
                  <Transfer
                    dataSource={listUserForDepartment}
                    leftDataSource={initDepartmentUsers}
                    targetKeys={selectedDepartmentUsers}
                    onChange={handleDepartmentUsersChange}
                    titles={["Selected Users", "Available Users"]}
                    operations={["<", ">"]}
                    disabled={isViewMode || isLoadingUsers}
                  />
                </TabsContent>
                <TabsContent value="hod_users">
                  <Transfer
                    dataSource={listUserForHod}
                    leftDataSource={initHodUsers}
                    targetKeys={selectedHodUsers}
                    onChange={handleHodUsersChange}
                    titles={["Selected HOD", "Available Users"]}
                    operations={["<", ">"]}
                    disabled={isViewMode || isLoadingUsers}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </FormProvider>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        description={`Are you sure you want to delete "${defaultValues?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}

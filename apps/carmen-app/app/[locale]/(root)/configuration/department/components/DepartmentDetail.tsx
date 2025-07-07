"use client";

import JsonViewer from "@/components/JsonViewer";
import { Transfer } from "@/components/ui-custom/Transfer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, User, ArrowLeft, SquarePen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  addDepartmentSchema,
  DepartmentDetailDto,
  editDepartmentSchema,
} from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import {
  useDepartmentMutation,
  useDepartmentUpdateMutation,
} from "@/hooks/useDepartments";
import { useUserList } from "@/hooks/useUserList";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface DepartmentDetailProps {
  readonly defaultValues?: DepartmentDetailDto;
  readonly isLoading?: boolean;
  readonly mode: formType;
}

export default function DepartmentDetail({
  defaultValues,
  isLoading,
  mode,
}: DepartmentDetailProps) {
  const { token, tenantId } = useAuth();
  const router = useRouter();
  const { userList } = useUserList();
  console.log("defaultValues >>>", defaultValues);

  const availableUsers = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return userList?.map((user: any) => ({
      key: user.user_id,
      title: user.firstname + " " + user.lastname,
    }));
  }, [userList]);

  const { mutate: createDepartment } = useDepartmentMutation(token, tenantId);
  const { mutate: updateDepartment } = useDepartmentUpdateMutation(
    token,
    tenantId,
    defaultValues?.id ?? ""
  );
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const currentSchema =
    currentMode === formType.ADD ? addDepartmentSchema : editDepartmentSchema;

  const initUsers = useMemo(() => {
    return (
      defaultValues?.tb_department_user?.map((user) => ({
        key: user.id,
        title: user.firstname + " " + user.lastname,
        id: user.id,
        isHod: user.is_hod,
      })) || []
    );
  }, [defaultValues?.tb_department_user]);

  const [targetKeys, setTargetKeys] = useState<string[]>(
    initUsers.map((user) => user.key.toString())
  );

  const form = useForm<z.infer<typeof addDepartmentSchema> & { id?: string }>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      ...(currentMode === formType.EDIT && { id: defaultValues?.id }),
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active || false,
      users: {
        add: [],
        remove: [],
      },
    },
  });

  useEffect(() => {
    form.clearErrors();

    const resetValues =
      currentMode === formType.EDIT
        ? {
            id: defaultValues?.id,
            name: defaultValues?.name || "",
            description: defaultValues?.description || "",
            is_active: defaultValues?.is_active || false,
            users: {
              add: [],
              remove: [],
            },
          }
        : {
            name: "",
            description: "",
            is_active: false,
            users: {
              add: [],
              remove: [],
            },
          };

    form.reset(resetValues);
  }, [currentMode, defaultValues, form]);

  const handleChangeMode = (mode: formType) => {
    setCurrentMode(mode);
  };

  const handleTransferChange = (
    targetKeys: (string | number)[],
    direction: "left" | "right",
    moveKeys: (string | number)[]
  ) => {
    setTargetKeys(targetKeys as string[]);

    // อัพเดท form values ตาม direction
    const currentUsers = form.getValues("users") || { add: [], remove: [] };

    if (direction === "right") {
      // ย้ายจาก available user ไป init user -> add
      const newAddArray = [...currentUsers.add];
      const newRemoveArray = [...currentUsers.remove];

      moveKeys.forEach((key) => {
        const keyStr = key.toString();
        // ถ้าเคยอยู่ใน remove array แล้ว ให้ลบออกจาก remove array (ย้อนกลับ)
        const existingRemoveIndex = newRemoveArray.findIndex(
          (item) => item.id === keyStr
        );
        if (existingRemoveIndex >= 0) {
          newRemoveArray.splice(existingRemoveIndex, 1);
        } else {
          // ถ้าไม่เคยอยู่ใน remove array ให้เพิ่มใน add array
          newAddArray.push({ id: keyStr, isHod: false });
        }
      });

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
    } else if (direction === "left") {
      // ย้ายจาก init user ไป available user -> remove
      const newAddArray = [...currentUsers.add];
      const newRemoveArray = [...currentUsers.remove];

      moveKeys.forEach((key) => {
        const keyStr = key.toString();
        // ถ้าเคยอยู่ใน add array แล้ว ให้ลบออกจาก add array (ย้อนกลับ)
        const existingAddIndex = newAddArray.findIndex(
          (item) => item.id === keyStr
        );
        if (existingAddIndex >= 0) {
          newAddArray.splice(existingAddIndex, 1);
        } else {
          // ถ้าไม่เคยอยู่ใน add array ให้เพิ่มใน remove array
          newRemoveArray.push({ id: keyStr });
        }
      });

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
    }
  };

  const onSubmit = (
    data: z.infer<typeof addDepartmentSchema> & { id?: string }
  ) => {
    if (currentMode === formType.ADD) {
      console.log("data in add >>>", data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createDepartment(data as any);
    } else {
      console.log("data in update >>>", data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateDepartment(data as any);
    }
    setCurrentMode(formType.VIEW);
  };

  const handleBack = () => {
    if (currentMode === formType.EDIT) {
      handleChangeMode(formType.VIEW);
    } else {
      router.push("/configuration/department");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {currentMode !== formType.VIEW ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Transfer
                dataSource={availableUsers}
                leftDataSource={initUsers}
                targetKeys={targetKeys}
                onChange={handleTransferChange}
                titles={["Init Users", "Available Users"]}
                operations={["<", ">"]}
              />
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button onClick={handleBack} size="sm" variant="ghost">
                      <ArrowLeft />
                    </Button>
                    <p className="text-xl font-semibold">
                      {defaultValues?.name || "-"}
                    </p>
                    <Badge
                      variant={defaultValues?.is_active ? "active" : "inactive"}
                    >
                      {defaultValues?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleChangeMode(formType.EDIT)}>
                      <SquarePen className="h-5 w-5" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-700">
                    {defaultValues?.description || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Members (
                  {defaultValues?.tb_department_user?.length || 0} people)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {defaultValues?.tb_department_user &&
                defaultValues.tb_department_user.length > 0 ? (
                  <div className="space-y-3">
                    {defaultValues.tb_department_user.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {user.firstname?.charAt(0)?.toUpperCase() || ""}
                            {user.lastname?.charAt(0)?.toUpperCase() || ""}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {user.firstname} {user.lastname}
                          </p>
                          {user.is_hod && (
                            <Badge variant="outline" className="text-xs">
                              Head of Department
                            </Badge>
                          )}
                        </div>
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No members in this department</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <JsonViewer data={form.watch()} />
    </div>
  );
}

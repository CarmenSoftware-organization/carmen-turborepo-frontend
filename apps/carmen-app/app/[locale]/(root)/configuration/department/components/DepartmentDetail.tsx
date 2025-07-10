"use client";

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
import { toastSuccess } from "@/components/ui-custom/Toast";
import FormBoolean from "@/components/form-custom/form-boolean";

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

  const [viewData, setViewData] = useState<{
    name: string;
    description: string;
    is_active: boolean;
    users: Array<{ key: string; title: string; isHod: boolean }>;
  }>({
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
    is_active: defaultValues?.is_active || false,
    users: [],
  });

  const [targetKeys, setTargetKeys] = useState<string[]>(
    initUsers.map((user) => user.key.toString())
  );

  // เก็บ isHod state สำหรับแต่ละ user
  const [hodStates, setHodStates] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    initUsers.forEach((user) => {
      initialState[user.key.toString()] = user.isHod || false;
    });
    return initialState;
  });

  const form = useForm<z.infer<typeof addDepartmentSchema> & { id?: string }>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      ...(currentMode === formType.EDIT && { id: defaultValues?.id }),
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active || false,
      users: {
        add: [],
        update: [],
        remove: [],
      },
    },
  });

  useEffect(() => {
    setViewData({
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      is_active: defaultValues?.is_active || false,
      users: initUsers.map((user) => ({
        key: user.key.toString(),
        title: user.title,
        isHod: user.isHod,
      })),
    });
  }, [defaultValues, initUsers]);

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
              update: [],
              remove: [],
            },
          }
        : {
            name: "",
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
    initUsers.forEach((user) => {
      newHodStates[user.key.toString()] = user.isHod || false;
    });
    setHodStates(newHodStates);

    setTargetKeys(initUsers.map((user) => user.key.toString()));
  }, [currentMode, defaultValues, form, initUsers]);

  const handleChangeMode = (mode: formType) => {
    setCurrentMode(mode);
  };

  const handleTransferChange = (
    targetKeys: (string | number)[],
    direction: "left" | "right",
    moveKeys: (string | number)[]
  ) => {
    setTargetKeys(targetKeys as string[]);

    const currentUsers = form.getValues("users") || {
      add: [],
      update: [],
      remove: [],
    };

    if (direction === "right") {
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
          newAddArray.push({
            id: keyStr,
            isHod: hodStates[keyStr] || false,
          });
        }

        // ตั้งค่า isHod เริ่มต้นเป็น false สำหรับผู้ใช้ใหม่
        if (!hodStates.hasOwnProperty(keyStr)) {
          console.log("Setting initial hodState for:", keyStr);
          setHodStates((prev) => ({ ...prev, [keyStr]: false }));
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

        // ลบ isHod state เมื่อย้ายออกจาก init users
        setHodStates((prev) => {
          const newState = { ...prev };
          delete newState[keyStr];
          return newState;
        });
      });

      // ลบจาก update array ถ้ามีการเปลี่ยนแปลง isHod ไว้
      const currentUpdateArray =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (currentUsers as { add: any[]; update: any[]; remove: any[] }).update ||
        [];
      const updatedUpdateArray = currentUpdateArray.filter(
        (user: { id: string; isHod: boolean }) =>
          !moveKeys.some((key) => key.toString() === user.id)
      );

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
      form.setValue("users.update", updatedUpdateArray);
    }
  };

  const onSubmit = (
    data: z.infer<typeof addDepartmentSchema> & { id?: string }
  ) => {
    // อัพเดท isHod สำหรับผู้ใช้ใน add และ update array
    const currentUsers = data.users || { add: [], update: [], remove: [] };
    const updatedData = {
      ...data,
      users: {
        ...currentUsers,
        add: currentUsers.add.map((user) => ({
          ...user,
          isHod: hodStates[user.id || ""] || false,
        })),
        update: currentUsers.update.map((user) => ({
          ...user,
          isHod: hodStates[user.id || ""] || false,
        })),
      },
    };

    // เตรียมข้อมูลสำหรับ view mode
    const viewUsers = targetKeys
      .map((key) => {
        const user = availableUsers?.find(
          (u: { key: string | number; title: string }) =>
            u.key.toString() === key
        );
        return {
          key: key,
          title: user?.title || "",
          isHod: hodStates[key] || false,
        };
      })
      .filter((user) => user.title !== "");

    if (currentMode === formType.ADD) {
      console.log("data in add >>>", updatedData);

      // เตรียมข้อมูลสำหรับ reset form
      const formResetData = {
        ...updatedData,
        users: { add: [], update: [], remove: [] },
      };

      console.log("form reset data >>>", formResetData);

      // Reset form
      form.reset(formResetData);

      // อัปเดต view data
      setViewData({
        name: updatedData.name,
        description: updatedData.description || "",
        is_active: updatedData.is_active || false,
        users: viewUsers,
      });

      // เปลี่ยนเป็น view mode
      setCurrentMode(formType.VIEW);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createDepartment(updatedData as any, {
        onSuccess: (data: unknown) => {
          const response = data as { id: string };
          toastSuccess({ message: "Department created successfully" });
          setCurrentMode(formType.VIEW);
          form.reset(formResetData);
          // เปลี่ยน URL จาก configuration/department/new เป็น configuration/department/{id}
          router.replace(`/configuration/department/${response.id}`);
        },
      });
    } else {
      // เตรียมข้อมูลสำหรับ reset form
      const formResetData = {
        ...updatedData,
        users: { add: [], update: [], remove: [] },
      };

      // Reset form
      form.reset(formResetData);

      // อัปเดต view data
      setViewData({
        name: updatedData.name,
        description: updatedData.description || "",
        is_active: updatedData.is_active || false,
        users: viewUsers,
      });

      // เปลี่ยนเป็น view mode
      setCurrentMode(formType.VIEW);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateDepartment(updatedData as any, {
        onSuccess: () => {
          toastSuccess({ message: "Department updated successfully" });
          setCurrentMode(formType.VIEW);
          form.reset(formResetData);
        },
      });
    }
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
    <div className="space-y-4 max-w-4xl mx-auto">
      {currentMode !== formType.VIEW ? (
        <div>
          <h1>
            {currentMode === formType.ADD
              ? "Create Department"
              : "Edit Department"}
          </h1>
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
                  <FormItem className="my-2">
                    <FormControl>
                      <FormBoolean
                        value={field.value}
                        onChange={field.onChange}
                        label="Is Active"
                        type="checkbox"
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
                leftRender={(item) => (
                  <div className="flex items-center justify-between w-full gap-2">
                    <p>{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Head of Dept.
                      </span>
                      <Switch
                        checked={hodStates[item.key.toString()] || false}
                        onCheckedChange={(checked) => {
                          const keyStr = item.key.toString();
                          console.log("Switch changed:", keyStr, checked);
                          console.log("Current hodStates:", hodStates);

                          setHodStates((prev) => ({
                            ...prev,
                            [keyStr]: checked,
                          }));

                          // อัพเดท form values
                          const currentUsers = form.getValues("users") || {
                            add: [],
                            update: [],
                            remove: [],
                          };
                          console.log("Current users:", currentUsers);

                          // ตรวจสอบว่า user นี้เป็น existing user (ใน initUsers เดิม) หรือ new user (ใน add array)
                          const isExistingUser = initUsers.some(
                            (user) => user.key.toString() === keyStr
                          );
                          const isNewUser = currentUsers.add.some(
                            (user) => user.id === keyStr
                          );

                          console.log("Is existing user:", isExistingUser);
                          console.log("Is new user:", isNewUser);

                          if (isExistingUser && !isNewUser) {
                            // ถ้าเป็น existing user ให้ใส่ใน update array
                            const existingUpdateIndex =
                              currentUsers.update.findIndex(
                                (user) => user.id === keyStr
                              );
                            // หาค่าเดิมจาก initUsers
                            const originalUser = initUsers.find(
                              (user) => user.key.toString() === keyStr
                            );
                            const originalIsHod = originalUser?.isHod || false;

                            console.log("Original isHod:", originalIsHod);
                            console.log("New isHod:", checked);

                            const updatedUpdateArray =
                              checked === originalIsHod
                                ? // ถ้าค่าเดิมเหมือนกัน ให้ลบออกจาก update array
                                  currentUsers.update.filter(
                                    (user) => user.id !== keyStr
                                  )
                                : // ถ้าค่าเดิมไม่เหมือนกัน ให้เพิ่ม/อัพเดท ใน update array
                                  existingUpdateIndex >= 0
                                  ? // อัพเดท existing entry ใน update array
                                    currentUsers.update.map((user, index) =>
                                      index === existingUpdateIndex
                                        ? { ...user, isHod: checked }
                                        : user
                                    )
                                  : // เพิ่ม entry ใหม่ใน update array
                                    [
                                      ...currentUsers.update,
                                      { id: keyStr, isHod: checked },
                                    ];

                            console.log(
                              "Updated update array:",
                              updatedUpdateArray
                            );
                            form.setValue("users.update", updatedUpdateArray);
                          } else if (isNewUser) {
                            // ถ้าเป็น new user ให้อัพเดท add array
                            const updatedAddArray = currentUsers.add.map(
                              (user) =>
                                user.id === keyStr
                                  ? { ...user, isHod: checked }
                                  : user
                            );

                            console.log("Updated add array:", updatedAddArray);
                            form.setValue("users.add", updatedAddArray);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              />
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          </Form>
        </div>
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
                    {viewData.name || "-"}
                  </p>
                  <Badge variant={viewData.is_active ? "active" : "inactive"}>
                    {viewData.is_active ? "Active" : "Inactive"}
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
                <p className="text-gray-700">{viewData.description || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Members ({viewData.users.length} people)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewData.users.length > 0 ? (
                <div className="space-y-3">
                  {viewData.users.map((user) => (
                    <div
                      key={user.key}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {user.title
                            ?.split(" ")[0]
                            ?.charAt(0)
                            ?.toUpperCase() || ""}
                          {user.title
                            ?.split(" ")[1]
                            ?.charAt(0)
                            ?.toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.title}</p>
                        {user.isHod && (
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
  );
}

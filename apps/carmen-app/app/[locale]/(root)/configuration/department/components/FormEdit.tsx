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
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import {
    useDepartmentMutation,
    useDepartmentUpdateMutation,
} from "@/hooks/useDepartments";
import { useUserList } from "@/hooks/useUserList";
import { useRouter } from "@/lib/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import FormBoolean from "@/components/form-custom/form-boolean";
import {
    departmentCreateSchema,
    DepartmentGetByIdDto,
    departmentUpdateSchema
} from "@/dtos/department.dto";
import { ArrowLeft } from "lucide-react";

interface UserItemProps {
    item: {
        key: string | number;
        title: string;
    };
    hodStates: Record<string, boolean>;
    onHodChange: (key: string, checked: boolean) => void;
}

const UserItem = ({ item, hodStates, onHodChange }: UserItemProps) => (
    <div className="flex items-center justify-between w-full gap-2">
        <p>{item.title}</p>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Head of Dept.</span>
            <Switch
                checked={hodStates[item.key.toString()] || false}
                onCheckedChange={(checked) => onHodChange(item.key.toString(), checked)}
            />
        </div>
    </div>
);

interface FormEditProps {
    readonly defaultValues?: DepartmentGetByIdDto;
    readonly mode: formType;
    readonly onSuccess: (data: any) => void;
    readonly onBack: () => void;
}

export default function FormEdit({
    defaultValues,
    mode,
    onSuccess,
    onBack,
}: FormEditProps) {
    const { token, tenantId } = useAuth();
    const router = useRouter();
    const { userList } = useUserList();

    const availableUsers = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return userList?.map((user: any) => ({
            key: user.user_id,
            title: user.firstname + " " + user.lastname,
        }));
    }, [userList]);

    const { mutate: createDepartment, isPending: isCreating } = useDepartmentMutation(token, tenantId);
    const { mutate: updateDepartment, isPending: isUpdating } = useDepartmentUpdateMutation(
        token,
        tenantId,
        defaultValues?.id ?? ""
    );

    const currentSchema = mode === formType.ADD ? departmentCreateSchema : departmentUpdateSchema;

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

    // เก็บ isHod state สำหรับแต่ละ user
    const [hodStates, setHodStates] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        initUsers.forEach((user) => {
            initialState[user.key.toString()] = user.isHod || false;
        });
        return initialState;
    });

    const form = useForm<z.infer<typeof departmentCreateSchema> & { id?: string }>({
        resolver: zodResolver(currentSchema),
        defaultValues: {
            ...(mode === formType.EDIT && { id: defaultValues?.id }),
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
        form.clearErrors();
        const resetValues =
            mode === formType.EDIT
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
    }, [mode, defaultValues, form, initUsers]);

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
            const newAddArray = [...(currentUsers.add || [])];
            const newRemoveArray = [...(currentUsers.remove || [])];

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
                    setHodStates((prev) => ({ ...prev, [keyStr]: false }));
                }
            });

            form.setValue("users.add", newAddArray);
            form.setValue("users.remove", newRemoveArray);
        } else if (direction === "left") {
            // ย้ายจาก init user ไป available user -> remove
            const newAddArray = [...(currentUsers.add || [])];
            const newRemoveArray = [...(currentUsers.remove || [])];

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
            const currentUpdateArray = currentUsers.update || [];
            const updatedUpdateArray = currentUpdateArray.filter(
                (user: { id: string; isHod: boolean }) =>
                    !moveKeys.some((key) => key.toString() === user.id)
            );

            form.setValue("users.add", newAddArray);
            form.setValue("users.remove", newRemoveArray);
            form.setValue("users.update", updatedUpdateArray);
        }
    };

    const handleHodChange = (key: string, checked: boolean) => {
        setHodStates((prev) => ({
            ...prev,
            [key]: checked,
        }));

        const currentUsers = form.getValues("users") || {
            add: [],
            update: [],
            remove: [],
        };

        // ตรวจสอบว่า user นี้เป็น existing user (ใน initUsers เดิม) หรือ new user (ใน add array)
        const isExistingUser = initUsers.some(
            (user) => user.key.toString() === key
        );
        const isNewUser = (currentUsers.add || []).some(
            (user) => user.id === key
        );

        if (isExistingUser && !isNewUser) {
            // ถ้าเป็น existing user ให้ใส่ใน update array
            const currentUpdateArray = currentUsers.update || [];
            const existingUpdateIndex = currentUpdateArray.findIndex(
                (user) => user.id === key
            );
            // หาค่าเดิมจาก initUsers
            const originalUser = initUsers.find(
                (user) => user.key.toString() === key
            );
            const originalIsHod = originalUser?.isHod || false;
            let updatedUpdateArray;
            if (checked === originalIsHod) {
                // ถ้าค่าเดิมเหมือนกัน ให้ลบออกจาก update array
                updatedUpdateArray = currentUpdateArray.filter(
                    (user) => user.id !== key
                );
            } else if (existingUpdateIndex >= 0) {
                // อัพเดท existing entry ใน update array
                updatedUpdateArray = currentUpdateArray.map((user, index) =>
                    index === existingUpdateIndex
                        ? { ...user, isHod: checked }
                        : user
                );
            } else {
                // เพิ่ม entry ใหม่ใน update array
                updatedUpdateArray = [
                    ...currentUpdateArray,
                    { id: key, isHod: checked },
                ];
            }
            form.setValue("users.update", updatedUpdateArray);
        } else if (isNewUser) {
            // ถ้าเป็น new user ให้อัพเดท add array
            const currentAddArray = currentUsers.add || [];
            const updatedAddArray = currentAddArray.map((user) =>
                user.id === key ? { ...user, isHod: checked } : user
            );
            form.setValue("users.add", updatedAddArray);
        }
    };

    const renderUserItem = useCallback((item: { key: string | number; title: string }) => (
        <UserItem
            item={item}
            hodStates={hodStates}
            onHodChange={handleHodChange}
        />
    ), [hodStates, handleHodChange]);

    const onSubmit = (
        data: z.infer<typeof departmentCreateSchema> & { id?: string }
    ) => {
        // อัพเดท isHod สำหรับผู้ใช้ใน add และ update array
        const currentUsers = data.users || { add: [], update: [], remove: [] };
        const updatedData = {
            ...data,
            users: {
                ...currentUsers,
                add: (currentUsers.add || []).map((user) => ({
                    ...user,
                    isHod: hodStates[user.id || ""] || false,
                })),
                update: (currentUsers.update || []).map((user) => ({
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

        if (mode === formType.ADD) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            createDepartment(updatedData as any, {
                onSuccess: (data: unknown) => {
                    const response = data as { id: string };
                    toastSuccess({ message: "Department created successfully" });

                    // เตรียมข้อมูลสำหรับ callback
                    const successData = {
                        ...updatedData,
                        id: response.id,
                        users: viewUsers,
                    };

                    onSuccess(successData);
                    // เปลี่ยน URL จาก configuration/department/new เป็น configuration/department/{id}
                    router.replace(`/configuration/department/${response.id}`);
                },
                onError: (error: unknown) => {
                    console.error("Error creating department:", error);
                    toastError({ message: "Error creating department" });
                },
            });
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateDepartment(updatedData as any, {
                onSuccess: () => {
                    toastSuccess({ message: "Department updated successfully" });

                    // เตรียมข้อมูลสำหรับ callback
                    const successData = {
                        ...updatedData,
                        users: viewUsers,
                    };

                    onSuccess(successData);
                },
                onError: (error: unknown) => {
                    console.error("Error updating department:", error);
                    toastError({ message: "Error updating department" });
                },
            });
        }
    };

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
                <Button onClick={onBack} variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {mode === formType.ADD ? "Create Department" : "Edit Department"}
                </h1>
            </div>
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
                        leftRender={renderUserItem}
                    />

                    <div className="flex gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={onBack}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating || isUpdating}>
                            {isCreating || isUpdating ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
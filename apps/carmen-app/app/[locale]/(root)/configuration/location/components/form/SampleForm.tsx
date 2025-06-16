"use client";

import { LocationByIdDto, PHYSICAL_COUNT_TYPE } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";
import { INVENTORY_TYPE } from "@/constants/enum";
import { Eye, Edit2, Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { toastSuccess } from "@/components/ui-custom/Toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUserList } from "@/hooks/useUserList";

interface MainLocationProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
}

const formSchema = z.object({
  name: z.string().min(1, "ชื่อสถานที่ห้ามว่าง"),
  location_type: z.nativeEnum(INVENTORY_TYPE),
  description: z.string().optional(),
  physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
  is_active: z.boolean(),
  delivery_point_id: z.string().min(1, "กรุณาเลือก Delivery Point"),
  users: z.object({
    add: z.array(
      z.object({
        id: z.string(),
      })
    ),
    remove: z.array(
      z.object({
        id: z.string(),
      })
    ),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LocationForm({ initialData, mode }: MainLocationProps) {
  const { userList, getUserName } = useUserList();
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [newUserId, setNewUserId] = useState("");
  const [selectedAvailableUsers, setSelectedAvailableUsers] = useState<
    string[]
  >([]);
  const [selectedAssociatedUsers, setSelectedAssociatedUsers] = useState<
    string[]
  >([]);
  const [showRemoveConfirmDialog, setShowRemoveConfirmDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      location_type: initialData?.location_type || INVENTORY_TYPE.CONSIGNMENT,
      description: initialData?.description || "",
      physical_count_type:
        initialData?.physical_count_type || PHYSICAL_COUNT_TYPE.NO,
      is_active: initialData?.is_active ?? true,
      delivery_point_id: initialData?.delivery_point?.id || "",
      users: {
        add: [],
        remove: [],
      },
    },
  });

  const formValues = form.watch();

  // คำนวณ users ที่แสดงผลจาก initialData และ form values
  const displayUsers = useMemo(() => {
    const currentUsers = [...(initialData?.users || [])];
    // ลบ users ที่อยู่ใน remove list
    formValues.users.remove.forEach((user) => {
      const index = currentUsers.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        currentUsers.splice(index, 1);
      }
    });
    // เพิ่ม users ที่อยู่ใน add list
    formValues.users.add.forEach((user) => {
      if (!currentUsers.some((u) => u.id === user.id)) {
        currentUsers.push(user);
      }
    });
    return currentUsers;
  }, [initialData?.users, formValues.users.add, formValues.users.remove]);

  // Get available users (exclude already associated ones)
  const availableUsers = useMemo(() => {
    return userList.filter(
      (user) =>
        !displayUsers.some((associatedUser) => associatedUser.id === user.id)
    );
  }, [userList, displayUsers]);

  // Get associated users with names
  const associatedUsers = useMemo(() => {
    return displayUsers.map((user) => ({
      id: user.id,
      name: getUserName(user.id),
    }));
  }, [displayUsers, getUserName]);

  console.log("availableUsers", availableUsers);
  console.log("associatedUsers", associatedUsers);

  const handleAvailableUserCheck = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailableUsers((prev) => [...prev, userId]);
    } else {
      setSelectedAvailableUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleAssociatedUserCheck = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssociatedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedAssociatedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const addUser = () => {
    if (newUserId.trim()) {
      const userExists = displayUsers.some(
        (user) => user.id === newUserId.trim()
      );
      if (!userExists) {
        const newUser = { id: newUserId.trim() };
        form.setValue("users", {
          ...formValues.users,
          add: [...formValues.users.add, newUser],
        });
        setNewUserId("");
        toastSuccess({
          message: `User ID "${newUserId.trim()}" has been added successfully.`,
        });
      } else {
        toastSuccess({ message: "This user ID already exists in the list." });
      }
    }
  };

  const removeUser = (userId: string) => {
    form.setValue("users", {
      ...formValues.users,
      remove: [...formValues.users.remove, { id: userId }],
    });
    toastSuccess({ message: `User ID "${userId}" has been removed.` });
  };

  const moveUsersToAssociated = () => {
    const usersToMove = selectedAvailableUsers.map((id) => ({ id }));
    form.setValue("users", {
      ...formValues.users,
      add: [...formValues.users.add, ...usersToMove],
    });
    setSelectedAvailableUsers([]);
    toastSuccess({
      message: `${usersToMove.length} user(s) have been associated with this location.`,
    });
  };

  const moveUsersToAvailable = () => {
    const usersToRemove = selectedAssociatedUsers.map((id) => ({ id }));
    form.setValue("users", {
      ...formValues.users,
      remove: [...formValues.users.remove, ...usersToRemove],
    });
    setSelectedAssociatedUsers([]);
    setShowRemoveConfirmDialog(false);
    toastSuccess({
      message: `${selectedAssociatedUsers.length} user(s) have been removed from this location.`,
    });
  };

  const handleRemoveUsersClick = () => {
    if (selectedAssociatedUsers.length > 0) {
      setShowRemoveConfirmDialog(true);
    }
  };

  const handleModeChange = (mode: formType) => {
    setCurrentMode(mode);
  };

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toastSuccess({ message: "Location data has been saved successfully." });
    setCurrentMode(formType.VIEW);
  };

  const isViewMode = currentMode === formType.VIEW;

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {initialData ? "แก้ไขสถานที่" : "เพิ่มสถานที่ใหม่"}
        </h1>
        <div className="flex gap-2">
          {initialData && (
            <Button
              variant="outline"
              onClick={() =>
                handleModeChange(isViewMode ? formType.EDIT : formType.VIEW)
              }
              className="flex items-center gap-2"
            >
              {isViewMode ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  แก้ไข
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  ดูข้อมูล
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อสถานที่</FormLabel>
                <FormControl>
                  <Input
                    placeholder="กรอกชื่อสถานที่"
                    {...field}
                    disabled={isViewMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ประเภทสถานที่</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทสถานที่" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={INVENTORY_TYPE.INVENTORY}>
                      Inventory
                    </SelectItem>
                    <SelectItem value={INVENTORY_TYPE.DIRECT}>
                      Direct
                    </SelectItem>
                    <SelectItem value={INVENTORY_TYPE.CONSIGNMENT}>
                      Consignment
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_point_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จุดจัดส่ง</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจุดจัดส่ง" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">จุดจัดส่ง 1</SelectItem>
                    <SelectItem value="2">จุดจัดส่ง 2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รายละเอียด</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="กรอกรายละเอียด"
                    {...field}
                    disabled={isViewMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="physical_count_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ประเภทการนับสินค้า</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทการนับสินค้า" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PHYSICAL_COUNT_TYPE.NO}>
                      ไม่นับ
                    </SelectItem>
                    <SelectItem value={PHYSICAL_COUNT_TYPE.YES}>นับ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">สถานะ</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isViewMode}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                จัดการผู้ใช้งาน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Manual User Addition */}
              <div className="space-y-2">
                <FormLabel>เพิ่มผู้ใช้งานด้วยตนเอง</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    placeholder="กรอกรหัสผู้ใช้งาน"
                    className="flex-1"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addUser())
                    }
                    disabled={isViewMode}
                  />
                  <Button
                    type="button"
                    onClick={addUser}
                    className="flex items-center gap-2"
                    disabled={isViewMode}
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มผู้ใช้
                  </Button>
                </div>
              </div>

              {/* Dual Pane User Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Available Users */}
                <div className="space-y-3">
                  <FormLabel>
                    ผู้ใช้งานที่สามารถเพิ่มได้ ({availableUsers.length})
                  </FormLabel>
                  <div className="border rounded-lg p-3 h-64 overflow-y-auto bg-gray-50">
                    <div className="space-y-2">
                      {availableUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 p-2 bg-white rounded border"
                        >
                          <Checkbox
                            id={`available-${user.id}`}
                            checked={selectedAvailableUsers.includes(user.id)}
                            onCheckedChange={(checked) =>
                              handleAvailableUserCheck(
                                user.id,
                                checked as boolean
                              )
                            }
                            disabled={isViewMode}
                          />
                          <label
                            htmlFor={`available-${user.id}`}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            <div>{user.name}</div>
                            <div className="text-xs text-gray-500">
                              {user.id}
                            </div>
                          </label>
                        </div>
                      ))}
                      {availableUsers.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          ไม่มีผู้ใช้งานที่สามารถเพิ่มได้
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-col justify-center items-center space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={moveUsersToAssociated}
                    disabled={selectedAvailableUsers.length === 0 || isViewMode}
                    className="w-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveUsersClick}
                    disabled={
                      selectedAssociatedUsers.length === 0 || isViewMode
                    }
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>

                {/* Associated Users */}
                <div className="space-y-3">
                  <FormLabel>
                    ผู้ใช้งานที่เพิ่มแล้ว ({associatedUsers?.length})
                  </FormLabel>
                  <div className="border rounded-lg p-3 h-64 overflow-y-auto bg-blue-50">
                    <div className="space-y-2">
                      {associatedUsers?.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 p-2 bg-white rounded border border-blue-200"
                        >
                          <Checkbox
                            id={`associated-${user.id}`}
                            checked={selectedAssociatedUsers.includes(user.id)}
                            onCheckedChange={(checked) =>
                              handleAssociatedUserCheck(
                                user.id,
                                checked as boolean
                              )
                            }
                            disabled={isViewMode}
                          />
                          <label
                            htmlFor={`associated-${user.id}`}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            <div>{user.id ? getUserName(user.id) : "----"}</div>
                            <div className="text-xs text-gray-500">
                              {user.id}
                            </div>
                          </label>
                          {!isViewMode && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUser(user.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {associatedUsers?.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          ยังไม่มีผู้ใช้งานที่เพิ่ม
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isViewMode && (
            <div className="flex justify-end">
              <Button type="submit">
                {initialData ? "บันทึกการแก้ไข" : "เพิ่มสถานที่"}
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={showRemoveConfirmDialog}
        onOpenChange={setShowRemoveConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบผู้ใช้งาน</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งาน {selectedAssociatedUsers.length}{" "}
              คนออกจากสถานที่นี้?
              การกระทำนี้จะย้ายผู้ใช้งานกลับไปยังรายการผู้ใช้งานที่สามารถเพิ่มได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={moveUsersToAvailable}>
              ลบผู้ใช้งาน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { Transfer } from "@/components/ui-custom/Transfer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const availableMockUsers = [
  {
    key: "id-001",
    title: "John Doe",
  },
  {
    key: "id-002",
    title: "Jane Smith",
  },
  {
    key: "id-003",
    title: "Jim Beam",
  },
  {
    key: "id-004",
    title: "Jill Johnson",
  },
  {
    key: "id-005",
    title: "Jack Daniels",
  },
  {
    key: "id-006",
    title: "Joe Johnson",
  },
];

const initUsers = [
  {
    key: "id-007",
    title: "Alice Cooper",
  },
  {
    key: "id-008",
    title: "Bob Martin",
  },
  {
    key: "id-009",
    title: "Charlie Brown",
  },
  {
    key: "id-010",
    title: "Diana Prince",
  },
];

const baseDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_active: z.boolean(),
  users: z
    .object({
      add: z.array(
        z.object({
          id: z.string().optional(),
        })
      ),
      remove: z.array(
        z.object({
          id: z.string().optional(),
        })
      ),
    })
    .optional(),
});

// Add mode - ไม่มี id
const addDepartmentSchema = baseDepartmentSchema;

// Edit mode - มี id required
const editDepartmentSchema = baseDepartmentSchema.extend({
  id: z.string().min(1, "ID is required for edit mode"),
});

// Union schema สำหรับ form (ถ้าจำเป็น)
// const departmentFormSchema = z.union([addDepartmentSchema, editDepartmentSchema]);

export default function TransferPage() {
  const [targetKeys, setTargetKeys] = useState<string[]>(
    initUsers.map((user) => user.key)
  );
  const [mode, setMode] = useState<"add" | "edit">("add");

  // เลือก schema ตาม mode
  const currentSchema =
    mode === "edit" ? editDepartmentSchema : addDepartmentSchema;

  const form = useForm<z.infer<typeof baseDepartmentSchema> & { id?: string }>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      ...(mode === "edit" && { id: "dept-001" }), // ตัวอย่าง id สำหรับ edit mode
      name: "",
      description: "",
      is_active: false,
      users: {
        add: [],
        remove: [],
      },
    },
  });

  const watchForm = form.watch();

  // Reset form เมื่อเปลี่ยน mode
  useEffect(() => {
    form.clearErrors();
    form.reset({
      ...(mode === "edit" && { id: "dept-001" }),
      name: "",
      description: "",
      is_active: false,
      users: {
        add: [],
        remove: [],
      },
    });
  }, [mode, form]);

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
          newAddArray.push({ id: keyStr });
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
    data: z.infer<typeof baseDepartmentSchema> & { id?: string }
  ) => {
    console.log("Form Data:", data);
    console.log("Current Mode:", mode);
  };

  return (
    <div className="w-full space-y-4">
      <h1>Transfer Component</h1>

      {/* Mode Selector */}
      <div className="flex items-center gap-4 p-4 rounded-lg">
        <span className="font-semibold">Mode:</span>
        <Button
          type="button"
          onClick={() => setMode("add")}
          variant={mode === "add" ? "default" : "outline"}
          size="sm"
        >
          Add Mode
        </Button>
        <Button
          type="button"
          onClick={() => setMode("edit")}
          variant={mode === "edit" ? "default" : "outline"}
          size="sm"
        >
          Edit Mode
        </Button>
        <div className="ml-4 text-sm text-gray-600">
          {mode === "add"
            ? "📝 Add Mode: ID field is optional"
            : "✏️ Edit Mode: ID field is required"}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* ID Field - แสดงเฉพาะ Edit Mode */}
          {mode === "edit" && (
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

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
            dataSource={availableMockUsers}
            leftDataSource={initUsers}
            targetKeys={targetKeys}
            onChange={handleTransferChange}
            titles={["Init Users", "Available Users"]}
            operations={["<", ">"]}
          />

          <Button type="submit" className="w-full">
            {mode === "add" ? "Create Department" : "Update Department"}
          </Button>
        </form>
      </Form>
      <pre>{JSON.stringify(watchForm, null, 2)}</pre>
    </div>
  );
}

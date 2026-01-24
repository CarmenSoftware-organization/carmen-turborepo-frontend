"use client";

import { useState, useCallback } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userFormSchema } from "./zod.form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserFormData = z.infer<typeof userFormSchema>;

const EMPTY_TEXT = {
  name: "ยังไม่ได้กรอกชื่อ",
  age: "ยังไม่ได้กรอกอายุ",
} as const;

export function UserForm() {
  const [submittedData, setSubmittedData] = useState<UserFormData | null>(null);
  const [editingRows, setEditingRows] = useState<Set<number>>(new Set());

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      is_active: false,
      price: 0,
      details: {
        add: [],
        update: [],
        remove: [],
      },
    },
  });

  const {
    fields: addFields,
    append: appendAdd,
    remove: removeAdd,
  } = useFieldArray({
    control: form.control,
    name: "details.add",
  });

  const handleSubmit = (data: UserFormData) => {
    setSubmittedData(data);
  };

  const handleAddPerson = useCallback(() => {
    const newIndex = addFields.length;
    appendAdd({ name: "", age: 0 });
    setEditingRows((prev) => new Set(prev).add(newIndex));
  }, [addFields.length, appendAdd]);

  const handleToggleEdit = useCallback((index: number) => {
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleRemovePerson = useCallback(
    (index: number) => {
      removeAdd(index);
      setEditingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        const updatedSet = new Set<number>();
        newSet.forEach((idx) => {
          if (idx > index) {
            updatedSet.add(idx - 1);
          } else {
            updatedSet.add(idx);
          }
        });
        return updatedSet;
      });
    },
    [removeAdd]
  );

  const handleReset = useCallback(() => {
    form.reset();
    setSubmittedData(null);
    setEditingRows(new Set());
  }, [form]);

  const handleNewForm = useCallback(() => {
    setSubmittedData(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Form</h1>

      {submittedData ? (
        <UserSummaryCard data={submittedData} onNewForm={handleNewForm} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Basic Fields */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอก username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="กรอกราคา"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Status</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Add Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>จัดการบุคคล</CardTitle>
                  <Button
                    type="button"
                    onClick={handleAddPerson}
                    variant="outline"
                    size="sm"
                  >
                    เพิ่มบุคคลใหม่
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addFields.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    ยังไม่มีรายการบุคคล กดปุ่ม "เพิ่มบุคคลใหม่" เพื่อเริ่มต้น
                  </p>
                ) : (
                  <Table aria-label="รายการบุคคล">
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ</TableHead>
                        <TableHead>อายุ</TableHead>
                        <TableHead className="w-[100px]">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addFields.map((field, index) => (
                        <PersonRow
                          key={field.id}
                          index={index}
                          form={form}
                          isEditing={editingRows.has(index)}
                          onToggleEdit={handleToggleEdit}
                          onRemove={handleRemovePerson}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                บันทึกข้อมูล
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                รีเซ็ต
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

// PersonRow Component
interface PersonRowProps {
  index: number;
  form: UseFormReturn<UserFormData>;
  isEditing: boolean;
  onToggleEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function PersonRow({
  index,
  form,
  isEditing,
  onToggleEdit,
  onRemove,
}: PersonRowProps) {
  return (
    <TableRow>
      <TableCell>
        <FormField
          control={form.control}
          name={`details.add.${index}.name`}
          render={({ field: nameField }) => (
            <FormItem>
              {isEditing ? (
                <FormControl>
                  <Input
                    placeholder="กรอกชื่อ"
                    {...nameField}
                    className="border-0 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  />
                </FormControl>
              ) : (
                <div className="py-2 text-sm">
                  {nameField.value || EMPTY_TEXT.name}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`details.add.${index}.age`}
          render={({ field: ageField }) => (
            <FormItem>
              {isEditing ? (
                <FormControl>
                  <Input
                    type="number"
                    placeholder="กรอกอายุ"
                    {...ageField}
                    onChange={(e) => ageField.onChange(Number(e.target.value))}
                    className="border-0 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  />
                </FormControl>
              ) : (
                <div className="py-2 text-sm">
                  {ageField.value ? `${ageField.value} ปี` : EMPTY_TEXT.age}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggleEdit(index)}
          >
            {isEditing ? "บันทึก" : "แก้ไข"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(index)}
          >
            ลบ
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Summary Card Component
interface UserSummaryCardProps {
  data: UserFormData;
  onNewForm: () => void;
}

function UserSummaryCard({ data, onNewForm }: UserSummaryCardProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-green-800">
            สรุปข้อมูล User ที่บันทึก
          </CardTitle>
          <Button onClick={onNewForm} variant="outline" size="sm">
            สร้างใหม่
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">ข้อมูลพื้นฐาน</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Username:</span>
              <p className="font-medium">{data.username}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Price:</span>
              <p className="font-medium">{data.price.toLocaleString()} บาท</p>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">สถานะ:</span>
            <Badge
              variant={data.is_active ? "default" : "secondary"}
              className="ml-2"
            >
              {data.is_active ? "ใช้งาน" : "ไม่ใช้งาน"}
            </Badge>
          </div>
        </div>

        {/* Add Section */}
        {data.details.add.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-green-700">
              รายการบุคคล ({data.details.add.length} คน)
            </h3>
            <div className="grid gap-2">
              {data.details.add.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-green-100 rounded-lg"
                >
                  <span className="font-medium">{person.name}</span>
                  <Badge variant="outline">{person.age} ปี</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

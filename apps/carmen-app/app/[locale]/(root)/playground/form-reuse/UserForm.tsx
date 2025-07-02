"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

type UserFormData = z.infer<typeof userFormSchema>;

export function UserForm() {
  const [submittedData, setSubmittedData] = useState<UserFormData | null>(null);

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

  const {
    fields: updateFields,
    append: appendUpdate,
    remove: removeUpdate,
  } = useFieldArray({
    control: form.control,
    name: "details.update",
  });

  const {
    fields: removeFields,
    append: appendRemove,
    remove: removeRemoveField,
  } = useFieldArray({
    control: form.control,
    name: "details.remove",
  });

  const handleSubmit = (data: UserFormData) => {
    setSubmittedData(data);
  };

  const handleAddPerson = () => {
    appendAdd({ name: "", age: 0 });
  };

  const handleAddUpdatePerson = () => {
    appendUpdate({ name: "", age: 0 });
  };

  const handleAddRemovePerson = () => {
    appendRemove({ id: "" });
  };

  const handleReset = () => {
    form.reset();
    setSubmittedData(null);
  };

  const handleNewForm = () => {
    setSubmittedData(null);
  };

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
              <CardContent className="space-y-4">
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
                <CardTitle>เพิ่มบุคคล</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={handleAddPerson}
                  variant="outline"
                >
                  เพิ่มบุคคลใหม่
                </Button>

                {addFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4 items-end p-4 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`details.add.${index}.name`}
                      render={({ field: nameField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>ชื่อ</FormLabel>
                          <FormControl>
                            <Input placeholder="กรอกชื่อ" {...nameField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`details.add.${index}.age`}
                      render={({ field: ageField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>อายุ</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="กรอกอายุ"
                              {...ageField}
                              onChange={(e) =>
                                ageField.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeAdd(index)}
                    >
                      ลบ
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Update Section */}
            <Card>
              <CardHeader>
                <CardTitle>แก้ไขบุคคล</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={handleAddUpdatePerson}
                  variant="outline"
                >
                  เพิ่มรายการแก้ไข
                </Button>

                {updateFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4 items-end p-4 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`details.update.${index}.name`}
                      render={({ field: nameField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>ชื่อ</FormLabel>
                          <FormControl>
                            <Input placeholder="กรอกชื่อ" {...nameField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`details.update.${index}.age`}
                      render={({ field: ageField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>อายุ</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="กรอกอายุ"
                              {...ageField}
                              onChange={(e) =>
                                ageField.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeUpdate(index)}
                    >
                      ลบ
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Remove Section */}
            <Card>
              <CardHeader>
                <CardTitle>ลบบุคคล</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  onClick={handleAddRemovePerson}
                  variant="outline"
                >
                  เพิ่มรายการลบ
                </Button>

                {removeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4 items-end p-4 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`details.remove.${index}.id`}
                      render={({ field: idField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>ID</FormLabel>
                          <FormControl>
                            <Input placeholder="กรอก ID" {...idField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeRemoveField(index)}
                    >
                      ลบ
                    </Button>
                  </div>
                ))}
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
              รายการเพิ่มบุคคล ({data.details.add.length} คน)
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

        {/* Update Section */}
        {data.details.update.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-700">
              รายการแก้ไขบุคคล ({data.details.update.length} คน)
            </h3>
            <div className="grid gap-2">
              {data.details.update.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-blue-100 rounded-lg"
                >
                  <span className="font-medium">{person.name}</span>
                  <Badge variant="outline">{person.age} ปี</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remove Section */}
        {data.details.remove.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-red-700">
              รายการลบบุคคล ({data.details.remove.length} รายการ)
            </h3>
            <div className="grid gap-2">
              {data.details.remove.map((item, index) => (
                <div key={index} className="p-3 bg-red-100 rounded-lg">
                  <span className="font-medium">ID: {item.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

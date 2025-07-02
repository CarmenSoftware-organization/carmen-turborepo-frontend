"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { locationFormSchema } from "./zod.form";

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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type LocationFormData = z.infer<typeof locationFormSchema>;

export function LocationForm() {
  const [submittedData, setSubmittedData] = useState<LocationFormData | null>(
    null
  );

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      code: "",
      is_active: false,
      itemDetails: [],
    },
  });

  const {
    fields: itemDetailsFields,
    append: appendItemDetail,
    remove: removeItemDetail,
  } = useFieldArray({
    control: form.control,
    name: "itemDetails",
  });

  const handleSubmit = (data: LocationFormData) => {
    setSubmittedData(data);
  };

  const handleAddItemDetail = () => {
    appendItemDetail({
      add: [],
      update: [],
      remove: [],
    });
  };

  const handleReset = () => {
    form.reset();
    setSubmittedData(null);
  };

  const handleNewForm = () => {
    setSubmittedData(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Location Form</h1>

      {submittedData ? (
        <LocationSummaryCard data={submittedData} onNewForm={handleNewForm} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Basic Fields */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลสถานที่</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อสถานที่</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกชื่อสถานที่" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รหัสสถานที่</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกรหัสสถานที่" {...field} />
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
                        <FormLabel>สถานะใช้งาน</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Item Details Section */}
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดรายการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  type="button"
                  onClick={handleAddItemDetail}
                  variant="outline"
                >
                  เพิ่มกลุ่มรายการใหม่
                </Button>

                {itemDetailsFields.map((itemField, itemIndex) => (
                  <Card
                    key={itemField.id}
                    className="p-4 border-2 border-dashed"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        กลุ่มรายการ {itemIndex + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItemDetail(itemIndex)}
                      >
                        ลบกลุ่ม
                      </Button>
                    </div>

                    <ItemDetailFields form={form} itemIndex={itemIndex} />
                  </Card>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                บันทึกข้อมูลสถานที่
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

// Separate component for handling nested field arrays
interface ItemDetailFieldsProps {
  form: ReturnType<typeof useForm<LocationFormData>>;
  itemIndex: number;
}

function ItemDetailFields({ form, itemIndex }: ItemDetailFieldsProps) {
  const {
    fields: addFields,
    append: appendAdd,
    remove: removeAdd,
  } = useFieldArray({
    control: form.control,
    name: `itemDetails.${itemIndex}.add`,
  });

  const {
    fields: updateFields,
    append: appendUpdate,
    remove: removeUpdate,
  } = useFieldArray({
    control: form.control,
    name: `itemDetails.${itemIndex}.update`,
  });

  const {
    fields: removeFields,
    append: appendRemove,
    remove: removeRemoveField,
  } = useFieldArray({
    control: form.control,
    name: `itemDetails.${itemIndex}.remove`,
  });

  const handleAddItem = () => {
    appendAdd({ name: "", code: "", is_active: false });
  };

  const handleAddUpdateItem = () => {
    appendUpdate({ name: "", code: "", is_active: false });
  };

  const handleAddRemoveItem = () => {
    appendRemove({ id: "" });
  };

  return (
    <div className="space-y-6">
      {/* Add Items Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-green-700">
            เพิ่มรายการใหม่
          </h4>
          <Button
            type="button"
            onClick={handleAddItem}
            variant="outline"
            size="sm"
          >
            เพิ่มรายการ
          </Button>
        </div>

        {addFields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-4 items-end p-3 bg-green-50 rounded-lg border"
          >
            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.add.${index}.name`}
              render={({ field: nameField }) => (
                <FormItem className="flex-1">
                  <FormLabel>ชื่อรายการ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อรายการ" {...nameField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.add.${index}.code`}
              render={({ field: codeField }) => (
                <FormItem className="flex-1">
                  <FormLabel>รหัสรายการ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกรหัสรายการ" {...codeField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.add.${index}.is_active`}
              render={({ field: activeField }) => (
                <FormItem className="flex flex-row items-end space-x-2 space-y-0 pb-2">
                  <FormControl>
                    <Checkbox
                      checked={activeField.value}
                      onCheckedChange={activeField.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">ใช้งาน</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeAdd(index)}
            >
              ลบ
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Update Items Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-blue-700">แก้ไขรายการ</h4>
          <Button
            type="button"
            onClick={handleAddUpdateItem}
            variant="outline"
            size="sm"
          >
            เพิ่มการแก้ไข
          </Button>
        </div>

        {updateFields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-4 items-end p-3 bg-blue-50 rounded-lg border"
          >
            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.update.${index}.name`}
              render={({ field: nameField }) => (
                <FormItem className="flex-1">
                  <FormLabel>ชื่อรายการ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อรายการ" {...nameField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.update.${index}.code`}
              render={({ field: codeField }) => (
                <FormItem className="flex-1">
                  <FormLabel>รหัสรายการ</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกรหัสรายการ" {...codeField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.update.${index}.is_active`}
              render={({ field: activeField }) => (
                <FormItem className="flex flex-row items-end space-x-2 space-y-0 pb-2">
                  <FormControl>
                    <Checkbox
                      checked={activeField.value}
                      onCheckedChange={activeField.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">ใช้งาน</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeUpdate(index)}
            >
              ลบ
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Remove Items Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-red-700">ลบรายการ</h4>
          <Button
            type="button"
            onClick={handleAddRemoveItem}
            variant="outline"
            size="sm"
          >
            เพิ่มการลบ
          </Button>
        </div>

        {removeFields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-4 items-end p-3 bg-red-50 rounded-lg border"
          >
            <FormField
              control={form.control}
              name={`itemDetails.${itemIndex}.remove.${index}.id`}
              render={({ field: idField }) => (
                <FormItem className="flex-1">
                  <FormLabel>ID รายการที่จะลบ</FormLabel>
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
              size="sm"
              onClick={() => removeRemoveField(index)}
            >
              ลบ
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Location Summary Card Component
interface LocationSummaryCardProps {
  data: LocationFormData;
  onNewForm: () => void;
}

function LocationSummaryCard({ data, onNewForm }: LocationSummaryCardProps) {
  const getTotalItems = () => {
    return data.itemDetails.reduce((total, detail) => {
      return (
        total + detail.add.length + detail.update.length + detail.remove.length
      );
    }, 0);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-blue-800">
            สรุปข้อมูลสถานที่ที่บันทึก
          </CardTitle>
          <Button onClick={onNewForm} variant="outline" size="sm">
            สร้างใหม่
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">ข้อมูลสถานที่</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">ชื่อสถานที่:</span>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">รหัสสถานที่:</span>
              <p className="font-medium">{data.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-600">สถานะ:</span>
              <Badge
                variant={data.is_active ? "default" : "secondary"}
                className="ml-2"
              >
                {data.is_active ? "ใช้งาน" : "ไม่ใช้งาน"}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-gray-600">รวมรายการทั้งหมด:</span>
              <Badge variant="outline" className="ml-2">
                {getTotalItems()} รายการ
              </Badge>
            </div>
          </div>
        </div>

        {/* Item Details */}
        {data.itemDetails.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">
              รายละเอียดรายการ ({data.itemDetails.length} กลุ่ม)
            </h3>

            {data.itemDetails.map((itemDetail, groupIndex) => (
              <Card key={groupIndex} className="p-4 border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">
                  กลุ่มรายการ {groupIndex + 1}
                </h4>

                <div className="space-y-4">
                  {/* Add Items */}
                  {itemDetail.add.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-green-700">
                        เพิ่มรายการ ({itemDetail.add.length} รายการ)
                      </h5>
                      <div className="grid gap-2">
                        {itemDetail.add.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-green-100 rounded"
                          >
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({item.code})
                              </span>
                            </div>
                            <Badge
                              variant={item.is_active ? "default" : "secondary"}
                            >
                              {item.is_active ? "ใช้งาน" : "ไม่ใช้งาน"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Update Items */}
                  {itemDetail.update.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-blue-700">
                        แก้ไขรายการ ({itemDetail.update.length} รายการ)
                      </h5>
                      <div className="grid gap-2">
                        {itemDetail.update.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-blue-100 rounded"
                          >
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({item.code})
                              </span>
                            </div>
                            <Badge
                              variant={item.is_active ? "default" : "secondary"}
                            >
                              {item.is_active ? "ใช้งาน" : "ไม่ใช้งาน"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Remove Items */}
                  {itemDetail.remove.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-red-700">
                        ลบรายการ ({itemDetail.remove.length} รายการ)
                      </h5>
                      <div className="grid gap-2">
                        {itemDetail.remove.map((item, index) => (
                          <div key={index} className="p-2 bg-red-100 rounded">
                            <span className="font-medium">ID: {item.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {data.itemDetails.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            ไม่มีรายละเอียดรายการ
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
  FormDescription,
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
import { useEffect } from "react";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useUserList } from "@/hooks/useUserList";
import UserLocation from "./UserLocation";

const formSchema = z.object({
  name: z.string().min(1, "ชื่อสถานที่จำเป็นต้องระบุ"),
  location_type: z.nativeEnum(INVENTORY_TYPE),
  physical_count_type: z.nativeEnum(PHYSICAL_COUNT_TYPE),
  description: z.string().optional(),
  is_active: z.boolean(),
  delivery_point_id: z.string().min(1, "จุดส่งสินค้าจำเป็นต้องระบุ"),
  info: z
    .object({
      floor: z.number(),
      building: z.string(),
      capacity: z.number(),
      responsibleDepartment: z.string(),
      itemCount: z.number(),
      lastCount: z.string(),
    })
    .nullable(),
  users: z
    .object({
      add: z
        .array(
          z.object({
            id: z.string().uuid(),
          })
        )
        .default([]),
      remove: z
        .array(
          z.object({
            id: z.string().uuid(),
          })
        )
        .default([]),
    })
    .default({ add: [], remove: [] }),
});

type FormValues = z.infer<typeof formSchema>;
export type { FormValues };

interface MainLocationProps {
  readonly initialData?: LocationByIdDto;
  readonly mode: formType;
}

export default function LocationForm({ initialData, mode }: MainLocationProps) {
  const { userList } = useUserList();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      location_type: initialData?.location_type ?? INVENTORY_TYPE.CONSIGNMENT,
      physical_count_type:
        initialData?.physical_count_type ?? PHYSICAL_COUNT_TYPE.NO,
      description: initialData?.description ?? "",
      is_active: initialData?.is_active ?? true,
      delivery_point_id: initialData?.delivery_point.id ?? "",
      info: initialData?.info ?? null,
      users: {
        add: [],
        remove: [],
      },
    },
  });

  useEffect(() => {
    if (mode === formType.EDIT && initialData) {
      form.reset({
        name: initialData.name,
        location_type: initialData.location_type,
        physical_count_type: initialData.physical_count_type,
        description: initialData.description,
        is_active: initialData.is_active,
        delivery_point_id: initialData.delivery_point.id,
        info: initialData.info,
        users: {
          add: [],
          remove: [],
        },
      });
    }
  }, [initialData, mode, form]);

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    // TODO: Implement submit logic
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อสถานที่</FormLabel>
                  <FormControl>
                    <Input placeholder="กรุณาระบุชื่อสถานที่" {...field} />
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทสถานที่" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(INVENTORY_TYPE).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physical_count_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ประเภทการนับสต็อก</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทการนับสต็อก" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PHYSICAL_COUNT_TYPE).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
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
                  <FormLabel>จุดส่งสินค้า</FormLabel>
                  <FormControl>
                    <Input placeholder="กรุณาเลือกจุดส่งสินค้า" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="กรุณาระบุรายละเอียด" {...field} />
                  </FormControl>
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
                    <FormLabel>สถานะการใช้งาน</FormLabel>
                    <FormDescription>เปิด/ปิดการใช้งานสถานที่</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="users"
            render={() => (
              <FormItem>
                <FormLabel>ผู้ใช้งาน</FormLabel>
                <UserLocation
                  control={form.control}
                  initialUsers={initialData?.users || []}
                  userList={userList}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {mode === formType.ADD ? "เพิ่มสถานที่" : "แก้ไขสถานที่"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

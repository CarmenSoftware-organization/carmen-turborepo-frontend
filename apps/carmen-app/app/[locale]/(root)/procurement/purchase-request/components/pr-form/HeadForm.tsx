"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";

interface HeadFormProps {
  form: UseFormReturn<PrSchemaV2Dto>;
  isReadOnly: boolean;
}

export default function HeadForm({ form, isReadOnly }: HeadFormProps) {
  return (
    <>
      {/* Purchase Request Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* PR Number */}
        <FormField
          control={form.control}
          name="pr_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หมายเลข PR</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="PR-XXXX"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PR Date */}
        <FormField
          control={form.control}
          name="pr_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันที่ PR</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isReadOnly}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
                      ) : (
                        <span>เลือกวันที่</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value) : undefined
                    }
                    onSelect={(date) => {
                      field.onChange(date?.toISOString());
                    }}
                    disabled={(date) =>
                      date > new Date() ||
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PR Status */}
        <FormField
          control={form.control}
          name="pr_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สถานะ PR</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isReadOnly}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requestor ID */}
        <FormField
          control={form.control}
          name="requestor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ผู้ขอ</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ID ผู้ขอ"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department ID */}
        <FormField
          control={form.control}
          name="department_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>แผนก</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ID แผนก"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Workflow ID */}
        <FormField
          control={form.control}
          name="workflow_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workflow</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ID Workflow"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Workflow Name */}
        <FormField
          control={form.control}
          name="workflow_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ Workflow</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ชื่อ Workflow"
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Version */}
        <FormField
          control={form.control}
          name="doc_version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เวอร์ชันเอกสาร</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  disabled={isReadOnly}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Active */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  เปิดใช้งาน
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>รายละเอียด</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="รายละเอียดของ Purchase Request"
                disabled={isReadOnly}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Note */}
      <FormField
        control={form.control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>หมายเหตุ *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="หมายเหตุ"
                disabled={isReadOnly}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
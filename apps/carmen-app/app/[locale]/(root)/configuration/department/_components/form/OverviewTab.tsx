"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartmentFormData } from "../../_schemas/department-form.schema";
import { DepartmentGetByIdDto } from "@/dtos/department.dto";

interface OverviewTabProps {
  readonly form: UseFormReturn<DepartmentFormData>;
  readonly isViewMode: boolean;
  readonly department?: DepartmentGetByIdDto;
}

export default function OverviewTab({ form, isViewMode, department }: OverviewTabProps) {
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tDepartment = useTranslations("Department");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Department Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("name")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} placeholder={tDepartment("enter_name")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tHeader("code")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} placeholder={tDepartment("enter_code")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("status")}</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
                disabled={isViewMode}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={tCommon("select_status")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">{tCommon("active")}</SelectItem>
                  <SelectItem value="false">{tCommon("inactive")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
            <FormLabel>{tHeader("description")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                disabled={isViewMode}
                placeholder={tDepartment("enter_description")}
                rows={3}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

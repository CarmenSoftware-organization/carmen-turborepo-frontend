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
import { DepartmentFormData } from "../../_schemas/department-form.schema";
import FormBoolean from "@/components/form-custom/form-boolean";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";

interface OverviewTabProps {
  readonly form: UseFormReturn<DepartmentFormData>;
  readonly isViewMode: boolean;
}

export default function OverviewTab({ form, isViewMode }: OverviewTabProps) {
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tDepartment = useTranslations("Department");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("name")}</FormLabel>
              <FormControl>
                <InputValidate
                  {...field}
                  disabled={isViewMode}
                  placeholder={tDepartment("enter_name")}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tHeader("code")}</FormLabel>
              <FormControl>
                <InputValidate
                  {...field}
                  disabled={isViewMode}
                  placeholder={tDepartment("enter_code")}
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{tHeader("description")}</FormLabel>
              <FormControl>
                <TextareaValidate
                  {...field}
                  disabled={isViewMode}
                  placeholder={tDepartment("enter_description")}
                  maxLength={256}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="is_active"
        required
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormBoolean
                value={field.value}
                onChange={field.onChange}
                label={tCommon("active")}
                type="checkbox"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRef, useCallback, KeyboardEvent } from "react";
import { Hash, Type, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  readonly form: UseFormReturn<DepartmentFormData>;
  readonly isViewMode: boolean;
}

export default function OverviewTab({ form, isViewMode }: OverviewTabProps) {
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tDepartment = useTranslations("Department");

  // Refs for keyboard navigation (Tab flow optimization for power users)
  const codeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Watch is_active for status display
  const isActive = form.watch("is_active");

  // Keyboard navigation - Enter to move to next field (ERP power user pattern)
  const handleKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
      nextRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
    ) => {
      if (e.key === "Enter" && !e.shiftKey && nextRef?.current) {
        e.preventDefault();
        nextRef.current.focus();
      }
    },
    []
  );

  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
      const value = e.target.value.toUpperCase().replaceAll(/[^A-Z0-9_-]/g, "");
      onChange(value);
    },
    []
  );

  return (
    <div className="space-y-5">
      {/* Primary Fields - Compact ERP Layout */}
      <div className="grid gap-x-6 gap-y-4 grid-cols-1 md:grid-cols-[200px_1fr]">
        {/* Code Field */}
        <FormField
          control={form.control}
          name="code"
          icon={<Hash className="h-3 w-3" aria-hidden="true" />}
          required
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tHeader("code")}
              </FormLabel>
              <FormControl>
                <InputValidate
                  {...field}
                  ref={codeRef}
                  disabled={isViewMode}
                  placeholder="DEPT001"
                  maxLength={10}
                  onChange={(e) => handleCodeChange(e, field.onChange)}
                  onKeyDown={(e) => handleKeyDown(e, nameRef)}
                  className="h-9 text-sm uppercase tracking-wider"
                  autoComplete="off"
                  spellCheck={false}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          icon={<Type className="h-3 w-3" aria-hidden="true" />}
          required
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {tCommon("name")}
              </FormLabel>
              <FormControl>
                <InputValidate
                  {...field}
                  ref={nameRef}
                  disabled={isViewMode}
                  placeholder={tDepartment("enter_name")}
                  maxLength={100}
                  onKeyDown={(e) => handleKeyDown(e, descRef)}
                  className="h-9 text-sm"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Description Field */}
      <FormField
        control={form.control}
        name="description"
        icon={<FileText className="h-3 w-3" aria-hidden="true" />}
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tHeader("description")}
            </FormLabel>
            <FormControl>
              <TextareaValidate
                {...field}
                ref={descRef}
                disabled={isViewMode}
                placeholder={tDepartment("enter_description")}
                maxLength={256}
                className="text-sm resize-none"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="pt-3 border-t border-dashed">
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <fieldset
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                  isActive
                    ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/10"
                    : "border-red-500/30 bg-red-50/50 dark:bg-red-950/10"
                )}
              >
                <legend className="sr-only">{tCommon("status")}</legend>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      isActive
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}
                    aria-hidden="true"
                  >
                    {isActive ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                      )}
                    >
                      {isActive ? tCommon("active") : tCommon("inactive")}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {tDepartment("active_description")}
                    </p>
                  </div>
                </div>
                <FormControl>
                  <FormBoolean
                    value={field.value}
                    onChange={field.onChange}
                    label=""
                    type="switch"
                    disabled={isViewMode}
                  />
                </FormControl>
              </fieldset>
            </FormItem>
          )}
        />
      </div>

      {/* Keyboard Shortcut Hint for Power Users */}
      {!isViewMode && (
        <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground/60">
          <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">Enter</kbd>
          <span>{tDepartment("next_field_hint")}</span>
        </div>
      )}
    </div>
  );
}

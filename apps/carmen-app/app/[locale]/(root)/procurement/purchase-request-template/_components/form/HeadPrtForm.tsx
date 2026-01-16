import { Input } from "@/components/ui/input";
import { CalendarIcon, FileText, Hash } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { PrtFormValues } from "./PrtForm";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/form-custom/form";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  readonly form: UseFormReturn<PrtFormValues>;
}

export default function HeadPrtForm({ form }: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {tPurchaseRequest("pr_name")}
                </div>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled className="mt-2 text-xs bg-muted" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workflow_name"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {tPurchaseRequest("pr_type")}
                </div>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled className="mt-2 text-xs bg-muted" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department_name"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {tPurchaseRequest("department")}
                </div>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled className="mt-2 text-xs bg-muted" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {tPurchaseRequest("description")}
                </div>
              </FormLabel>
              <FormControl>
                <Textarea {...field} disabled />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

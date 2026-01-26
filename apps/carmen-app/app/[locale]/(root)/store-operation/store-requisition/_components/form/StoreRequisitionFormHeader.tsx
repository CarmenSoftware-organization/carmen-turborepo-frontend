import { formType } from "@/dtos/form.dto";
import { SrCreate } from "@/dtos/sr.dto";
import { Control, useWatch } from "react-hook-form";
import { Building2, CalendarIcon, GitBranch, MapPin, User } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import LookupWorkflow from "@/components/lookup/LookupWorkflow";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { Label } from "@/components/ui/label";
import DateInput from "@/components/form-custom/DateInput";
import LookupLocation from "@/components/lookup/LookupLocation";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";

interface StoreRequisitionFormHeaderProps {
  readonly control: Control<SrCreate>;
  readonly mode: formType;
  readonly buCode: string;
  readonly departmentName?: string;
  readonly requestorName?: string;
}

export default function StoreRequisitionFormHeader({
  control,
  mode,
  buCode,
  departmentName,
  requestorName,
}: StoreRequisitionFormHeaderProps) {
  const t = useTranslations("StoreRequisition.form");
  const fromLocationId = useWatch({ control, name: "details.from_location_id" });

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="details.workflow_id"
          required
          icon={<GitBranch className="h-4 w-4" />}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("workflow")}</FormLabel>
              <FormControl>
                <LookupWorkflow
                  value={field.value}
                  onValueChange={field.onChange}
                  type={enum_workflow_type.purchase_request}
                  disabled={mode === formType.VIEW}
                  bu_code={buCode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="details.sr_date"
          required
          icon={<CalendarIcon className="h-4 w-4" />}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("orderDate")}</FormLabel>
              <DateInput field={field} disablePastDates disabled={mode === formType.VIEW} />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="details.expected_date"
          required
          icon={<CalendarIcon className="h-4 w-4" />}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("expectedDate")}</FormLabel>
              <DateInput field={field} disablePastDates disabled={mode === formType.VIEW} />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="details.from_location_id"
          required
          icon={<MapPin className="h-4 w-4" />}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fromLocation")}</FormLabel>
              <FormControl>
                <LookupLocation
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mode === formType.VIEW}
                  bu_code={buCode}
                  classNames={cn(mode === formType.VIEW && "bg-muted")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="details.to_location_id"
          required
          icon={<MapPin className="h-4 w-4" />}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("toLocation")}</FormLabel>
              <FormControl>
                <LookupLocation
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mode === formType.VIEW || !fromLocationId}
                  bu_code={buCode}
                  excludeIds={fromLocationId ? [fromLocationId] : []}
                  classNames={cn(mode === formType.VIEW && "bg-muted")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {t("requestor")}
            </div>
          </Label>
          <Input placeholder={t("requestor")} disabled className="bg-muted" value={requestorName} />
        </div>

        <div className="space-y-2">
          <Label>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>{t("department")}</span>
            </div>
          </Label>
          <Input placeholder={t("department")} disabled className="bg-muted" value={departmentName} />
        </div>
      </div>

      {/* Description */}
      <FormField
        control={control}
        name="details.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("description")}</FormLabel>
            {mode === formType.VIEW ? (
              <p className="text-xs">{field.value}</p>
            ) : (
              <FormControl>
                <TextareaValidate {...field} maxLength={256} />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

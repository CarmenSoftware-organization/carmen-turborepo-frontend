import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { PriceListTemplateDetailsDto } from "@/dtos/price-list-template.dto";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import { useTranslations } from "next-intl";
import NumberInput from "@/components/form-custom/NumberInput";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Props {
  // @ts-ignore
  form: UseFormReturn<any>;
  isViewMode: boolean;
  templateData?: PriceListTemplateDetailsDto;
}

export default function TabOverview({ form, isViewMode, templateData }: Props) {
  const tPlt = useTranslations("PriceListTemplate");
  const tHeader = useTranslations("TableHeader");

  const Label = ({ children }: { children: React.ReactNode }) => (
    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      {children}
    </FormLabel>
  );

  return (
    <div className="space-y-6">
      {/* Section 1: Template Info */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{tPlt("tmp_info")}</h3>
        </div>

        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="name"
            required
            render={({ field }) => (
              <FormItem className="col-span-2 space-y-1">
                <Label>{tPlt("tmp_name")}</Label>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPlt("tmp_name_placeholder")}
                    className="h-8 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            required
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tHeader("status")}</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder={tHeader("status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validity_period"
            required
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>
                  {tHeader("valid_period")} ({tHeader("days")})
                </Label>
                <FormControl>
                  <NumberInput {...field} disabled={isViewMode} min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency_id"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tHeader("currency")}</Label>
                <LookupCurrency onValueChange={field.onChange} value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* Section 2: Instructions & Description */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground lg:col-span-4">Details</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="vendor_instructions"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tPlt("vendor_instruction")}</Label>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPlt("vendor_instruction_placeholder")}
                    rows={3}
                    className="min-h-[80px] resize-none text-sm"
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
              <FormItem className="space-y-1">
                <Label>{tHeader("description")}</Label>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPlt("tmp_desc_placeholder")}
                    rows={3}
                    className="min-h-[80px] resize-none text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

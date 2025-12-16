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
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { useTranslations } from "next-intl";
import NumberInput from "@/components/form-custom/NumberInput";

interface Props {
  // @ts-ignore
  form: UseFormReturn<any>;
  isViewMode: boolean;
  templateData?: PriceListTemplateDetailsDto;
}

export default function TabOverview({ form, isViewMode, templateData }: Props) {
  const tPlt = useTranslations("PriceListTemplate");
  const tHeader = useTranslations("TableHeader");
  return (
    <div className="space-y-8 mt-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {tPlt("tmp_info")}
        </h2>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tPlt("tmp_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isViewMode}
                      placeholder={tPlt("tmp_name_placeholder")}
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
                <FormItem>
                  <FormLabel>{tHeader("status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl>
                      <SelectTrigger>
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="validity_period"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tHeader("valid_period")} ({tHeader("days")})
                  </FormLabel>
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
                <FormItem>
                  <FormLabel>{tHeader("currency")}</FormLabel>
                  <CurrencyLookup onValueChange={field.onChange} value={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vendor_instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tPlt("vendor_instruction")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPlt("vendor_instruction_placeholder")}
                    rows={3}
                    className="resize-none"
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
              <FormItem>
                <FormLabel>{tHeader("description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPlt("tmp_desc_placeholder")}
                    rows={3}
                    className="resize-none"
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

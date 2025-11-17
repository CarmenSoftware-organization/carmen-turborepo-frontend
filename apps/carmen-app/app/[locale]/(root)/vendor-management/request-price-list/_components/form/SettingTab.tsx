import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  form: UseFormReturn<any>;
  isViewMode: boolean;
  reminderFields: any[];
  appendReminder: (value: any) => void;
  removeReminder: (index: number) => void;
  escalationFields: any[];
  appendEscalation: (value: any) => void;
  removeEscalation: (index: number) => void;
}

export default function SettingTab({
  form,
  isViewMode,
  reminderFields,
  appendReminder,
  removeReminder,
  escalationFields,
  appendEscalation,
  removeEscalation,
}: Props) {
  const tRfp = useTranslations("RFP");

  return (
    <div className="space-y-8 mt-4">
      {/* RFP Settings */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {tRfp("rfp_settings")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rfp_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRfp("rfp_type")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={tRfp("select_rfp_type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buy">{tRfp("type_buy")}</SelectItem>
                    <SelectItem value="sell">{tRfp("type_sell")}</SelectItem>
                    <SelectItem value="recurring">{tRfp("type_recurring")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRfp("priority")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={tRfp("select_priority")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">{tRfp("priority_high")}</SelectItem>
                    <SelectItem value="medium">{tRfp("priority_medium")}</SelectItem>
                    <SelectItem value="low">{tRfp("priority_low")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portal_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRfp("portal_duration_days")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isViewMode}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="submission_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRfp("submission_method")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={tRfp("select_submission_method")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="auto">{tRfp("method_auto")}</SelectItem>
                    <SelectItem value="manual">{tRfp("method_manual")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="require_approval"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{tRfp("require_approval")}</FormLabel>
                <div className="flex items-center gap-2 h-10">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value ? tRfp("enabled") : tRfp("disabled")}
                  </span>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auto_reminder"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{tRfp("auto_reminder")}</FormLabel>
                <div className="flex items-center gap-2 h-10">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value ? tRfp("enabled") : tRfp("disabled")}
                  </span>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tRfp("instructions")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isViewMode}
                  placeholder={tRfp("instructions_placeholder")}
                  rows={3}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Reminders */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tRfp("reminders")}
          </h2>
          {!isViewMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                appendReminder({
                  type: "before_deadline",
                  days: 3,
                  recipients: [],
                  message: "",
                  enabled: true,
                });
              }}
            >
              {tRfp("add_reminder")}
            </Button>
          )}
        </div>

        {reminderFields.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8 border-t border-border">
            {tRfp("no_reminders_configured")}
          </div>
        ) : (
          <div className="space-y-2">
            {reminderFields.map((field, index) => (
              <div key={field.id} className="bg-muted/50 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {tRfp("reminder_number")} #{index + 1}
                  </span>
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReminder(index)}
                      className="hover:text-destructive h-7 w-7 p-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <FormField
                    control={form.control}
                    name={`reminders.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{tRfp("type")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isViewMode}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="before_deadline">{tRfp("type_before_deadline")}</SelectItem>
                            <SelectItem value="after_deadline">{tRfp("type_after_deadline")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`reminders.${index}.days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{tRfp("days")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isViewMode}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`reminders.${index}.enabled`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs">{tRfp("status")}</FormLabel>
                        <div className="flex items-center gap-2 h-9">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <span className="text-xs text-muted-foreground">
                            {field.value ? tRfp("active") : tRfp("inactive")}
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`reminders.${index}.message`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{tRfp("message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isViewMode}
                          rows={2}
                          className="resize-none text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Escalations */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tRfp("escalations")}
          </h2>
          {!isViewMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                appendEscalation({
                  type: "after_deadline",
                  days: 1,
                  recipients: [],
                  message: "",
                  enabled: true,
                });
              }}
            >
              {tRfp("add_escalation")}
            </Button>
          )}
        </div>

        {escalationFields.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8 border-t border-border">
            {tRfp("no_escalations_configured")}
          </div>
        ) : (
          <div className="space-y-2">
            {escalationFields.map((field, index) => (
              <div key={field.id} className="bg-muted/50 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {tRfp("escalation_number")} #{index + 1}
                  </span>
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEscalation(index)}
                      className="hover:text-destructive h-7 w-7 p-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <FormField
                    control={form.control}
                    name={`escalations.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{tRfp("type")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isViewMode}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="before_deadline">{tRfp("type_before_deadline")}</SelectItem>
                            <SelectItem value="after_deadline">{tRfp("type_after_deadline")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`escalations.${index}.days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{tRfp("days")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isViewMode}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`escalations.${index}.enabled`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs">{tRfp("status")}</FormLabel>
                        <div className="flex items-center gap-2 h-9">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <span className="text-xs text-muted-foreground">
                            {field.value ? tRfp("active") : tRfp("inactive")}
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`escalations.${index}.message`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{tRfp("message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isViewMode}
                          rows={2}
                          className="resize-none text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
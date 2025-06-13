import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditNoteFormDto } from "@/dtos/credit-note.dto";
import { formType } from "@/dtos/form.dto";
import { Hash, CalendarIcon, FileText } from "lucide-react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

interface HeadCnFormProps {
  readonly control: Control<CreditNoteFormDto>;
  readonly mode: formType;
  readonly cnNo?: string;
}

export default function HeadCnForm({ control, mode, cnNo }: HeadCnFormProps) {
  return (
    <div className="space-y-2 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-1">
        {mode !== formType.ADD && (
          <div className="col-span-1">
            <Label className="text-xs font-medium">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                CN Number
              </div>
            </Label>
            <Input value={cnNo} disabled className="mt-2 text-xs bg-muted" />
          </div>
        )}

        <FormField
          control={control}
          name="cn_date"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  CN Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs bg-muted mt-1",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span className="text-muted-foreground">Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Select date
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString() : new Date().toISOString()
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Note
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground mt-1 px-2 py-1 rounded min-h-[28px] flex items-center">
                  {field.value ? field.value : "-"}
                </p>
              ) : (
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className="mt-1 min-h-[56px] resize-none text-xs bg-muted"
                    placeholder="Enter note..."
                  />
                </FormControl>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

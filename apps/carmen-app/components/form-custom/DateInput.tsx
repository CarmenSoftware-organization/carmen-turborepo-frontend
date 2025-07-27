import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FormControl } from "../ui/form";

// <DateInput field={...} wrapWithFormControl={false} /> เพื่อไม่ต้องใช้ FormControl

interface DateInputProps {
    readonly field: any;
    readonly wrapWithFormControl?: boolean;
    readonly disabled?: boolean;
}

export default function DateInput({ field, wrapWithFormControl = true, disabled = false }: DateInputProps) {
    const ButtonComponent = (
        <Button
            variant="outline"
            className={cn(
                "w-full pl-2 text-left font-normal text-xs bg-background",
                !field.value && "text-muted-foreground",
                disabled && "bg-muted"
            )}
            disabled={disabled}
        >
            {field.value ? (
                format(new Date(field.value), "PPP")
            ) : (
                <span className="text-muted-foreground">Select date</span>
            )}
            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
        </Button>
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                {wrapWithFormControl ? <FormControl>{ButtonComponent}</FormControl> : ButtonComponent}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                        if (date) {
                            field.onChange(date.toISOString());
                        }
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FormControl } from "../ui/form";
import { useState, useEffect } from "react";

// <DateInput field={...} wrapWithFormControl={false} /> เพื่อไม่ต้องใช้ FormControl

type DateValue = string | Date | undefined;

interface DateField {
    value: DateValue;
    onChange: (value: string) => void;
}

interface DateInputProps {
    readonly field: DateField;
    readonly wrapWithFormControl?: boolean;
    readonly disabled?: boolean;
    readonly classNames?: string;
    readonly disablePastDates?: boolean;
}

export default function DateInput({ field, wrapWithFormControl = true, disabled = false, classNames = "", disablePastDates = false }: DateInputProps) {
    const [internalValue, setInternalValue] = useState<DateValue>(field.value);

    // Sync internal value with field value
    useEffect(() => {
        setInternalValue(field.value);
    }, [field.value]);

    const formatDate = (value: DateValue): string => {
        if (!value) return "";
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return "";
            return format(date, "dd/MM/yyyy");
        } catch {
            return "";
        }
    };

    const getSelectedDate = (): Date | undefined => {
        if (!internalValue) return undefined;
        try {
            const date = new Date(internalValue);
            return isNaN(date.getTime()) ? undefined : date;
        } catch {
            return undefined;
        }
    };

    const formattedDate = formatDate(internalValue);
    const selectedDate = getSelectedDate();

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ButtonComponent = (
        <Button
            variant="outline"
            className={cn(
                "w-full pl-2 text-left font-normal bg-background",
                !internalValue && "text-muted-foreground",
                disabled && "bg-muted",
                classNames
            )}
            disabled={disabled}
            aria-label={formattedDate ? `Selected date: ${formattedDate}` : "Select date"}
        >
            {formattedDate || <span className="text-muted-foreground">Select date</span>}
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
                    selected={selectedDate}
                    onSelect={(date) => {
                        if (date && !isNaN(date.getTime())) {
                            const isoString = date.toISOString();
                            setInternalValue(isoString);
                            field.onChange(isoString);
                        }
                    }}
                    disabled={disablePastDates ? (date) => date < today : undefined}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, FileText } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, isSameDay, isToday, startOfMonth, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function FilterSubReport() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    const handleSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
    };

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return "Pick a date range";

        if (!range.to) {
            if (isToday(range.from)) {
                return "Today";
            }
            return format(range.from, "PPP");
        }

        if (isSameDay(range.from, range.to)) {
            if (isToday(range.from)) {
                return "Today";
            }
            return format(range.from, "PPP");
        }

        return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
    };

    const predefinedRanges = [
        { label: "Today", range: { from: new Date(), to: new Date() } },
        { label: "Yesterday", range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) } },
        { label: "Last 7 days", range: { from: subDays(new Date(), 6), to: new Date() } },
        { label: "Last 30 days", range: { from: subDays(new Date(), 29), to: new Date() } },
    ];

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateRange(date)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                        <div className="flex gap-2 flex-wrap">
                            {predefinedRanges.map((item) => (
                                <Button
                                    key={item.label}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleSelect(item.range)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
            </Button>
            <Button>
                <FileText className="h-4 w-4 mr-2" />
                Export
            </Button>
        </div>
    );
}

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CalendarButtonProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly field: any;
    readonly classNames?: string;
}

export default function CalendarButton({ field, classNames }: CalendarButtonProps) {
    return (
        <Button
            variant="outline"
            className={cn(
                "w-full pl-2 text-left font-normal text-xs mt-1 bg-muted",
                !field.value && "text-muted-foreground",
                classNames
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
    )
}
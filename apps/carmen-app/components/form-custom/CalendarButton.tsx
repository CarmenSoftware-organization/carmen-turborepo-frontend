import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";

interface CalendarButtonProps<T extends FieldValues = FieldValues> {
    readonly field: ControllerRenderProps<T, Path<T>>;
    readonly classNames?: string;
}

export default function CalendarButton<T extends FieldValues = FieldValues>({ field, classNames }: CalendarButtonProps<T>) {
    const t = useTranslations("Action");
    return (
        <Button
            variant="outline"
            className={cn(
                "w-full pl-2 text-left font-normal mt-1 bg-muted",
                !field.value && "text-muted-foreground",
                classNames
            )}
            disabled
        >
            {field.value ? (
                format(new Date(field.value), "PPP")
            ) : (
                <span className="text-muted-foreground">{t("select_date")}</span>
            )}
            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
        </Button>
    )
}
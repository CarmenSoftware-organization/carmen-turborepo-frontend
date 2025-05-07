import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useUnit } from "@/hooks/useUnit";

interface UnitLookupProps {
    readonly value?: string;
    readonly onValueChange: (value: string) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
}

export default function UnitLookup({ value, onValueChange, placeholder = "Select unit", disabled = false }: UnitLookupProps) {
    const { units, isLoading } = useUnit();
    const [open, setOpen] = useState(false);

    const selectedUnitName = useMemo(() => {
        if (!value || !units || !Array.isArray(units)) return null;
        const found = units.find(unit => unit.id === value);
        return found?.name ?? null;
    }, [value, units]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedUnitName ? selectedUnitName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search unit..." />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No units found.</CommandEmpty>
                                <CommandGroup>
                                    {units && units.length > 0 ? (
                                        units.map((unit) => (
                                            <CommandItem
                                                key={unit.id}
                                                value={unit.name}
                                                onSelect={() => {
                                                    if (unit.id) {
                                                        onValueChange(unit.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {unit.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === unit.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No units available.</CommandItem>
                                    )}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

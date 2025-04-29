"use client";

import { useUnit } from "@/hooks/useUnit";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Unit {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    created_by_id: string;
    updated_at: string;
    updated_by_id: string | null;
}

export default function LookupPage() {
    const { units } = useUnit();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const selectedUnit = units.find((unit) => unit.id === value);

    console.log('units', units);


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lookup</h1>
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {selectedUnit?.name || "Select unit..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search unit..." />
                                <CommandEmpty>No unit found.</CommandEmpty>
                                <CommandGroup>
                                    {units.map((unit) => (
                                        <CommandItem
                                            key={unit.id}
                                            value={unit.id}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === unit.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {unit.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Selected Unit Details:</h2>
                    {selectedUnit && (
                        <pre className="bg-muted p-4 rounded-md">
                            {JSON.stringify(selectedUnit, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}

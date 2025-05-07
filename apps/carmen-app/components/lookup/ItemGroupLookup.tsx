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
import { useItemGroup } from "@/hooks/useItemGroup";

interface ItemGroupLookupProps {
    readonly value?: string;
    readonly onValueChange: (value: string) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
}

export default function ItemGroupLookup({
    value,
    onValueChange,
    placeholder = "Select product item group",
    disabled = false
}: ItemGroupLookupProps) {
    // เรียกใช้ hook โดยเฉพาะเจาะจงแต่ละตัวที่ต้องการ
    const { itemGroups, isLoading } = useItemGroup();
    const [open, setOpen] = useState(false);

    // ใช้ useMemo เพื่อหาชื่อกลุ่มที่เลือก และป้องกันการคำนวณซ้ำ
    const selectedItemName = useMemo(() => {
        if (!value || !itemGroups || !Array.isArray(itemGroups)) return null;
        const found = itemGroups.find(group => group?.id === value);
        return found?.name ?? null;
    }, [value, itemGroups]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedItemName ? selectedItemName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search item group..." />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No item group found.</CommandEmpty>
                                <CommandGroup>
                                    {itemGroups && itemGroups.length > 0 ? (
                                        itemGroups.map((group) => (
                                            <CommandItem
                                                key={group.id}
                                                value={group.id}
                                                onSelect={(currentValue) => {
                                                    onValueChange(currentValue);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === group.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {group.name}
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No item groups available.</CommandItem>
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
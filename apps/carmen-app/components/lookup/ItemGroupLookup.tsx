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
import { PropsLookup } from "@/dtos/lookup.dto";
export default function ItemGroupLookup({
    value,
    onValueChange,
    placeholder = "Select product item group",
    disabled = false
}: Readonly<PropsLookup>) {
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
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
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
                                                value={group.name}
                                                onSelect={() => {
                                                    onValueChange(group.id);
                                                    setOpen(false);
                                                }}
                                            >

                                                {group.name}
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === group.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
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
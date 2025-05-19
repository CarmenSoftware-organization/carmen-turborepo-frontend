import { useDepartment } from "@/hooks/useDepartment";
import { useMemo, useState } from "react";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DepartmentLookupProps {
    readonly value?: string;
    readonly onValueChange: (value: string) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
}
export default function DepartmentLookup({ value, onValueChange, placeholder = "Select department", disabled = false }: DepartmentLookupProps) {
    const { departments, isLoading } = useDepartment();
    const [open, setOpen] = useState(false);

    const selectedDepartmentName = useMemo(() => {
        if (!value || !departments || !Array.isArray(departments)) return null;
        const found = departments.find(department => department.id === value);
        return found?.name ?? null;
    }, [value, departments]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedDepartmentName ? selectedDepartmentName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search department..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No departments found.</CommandEmpty>
                                <CommandGroup>
                                    {departments && departments.length > 0 ? (
                                        departments.map((department) => (
                                            <CommandItem
                                                key={department.id}
                                                value={department.name}
                                                onSelect={() => {
                                                    if (department.id) {
                                                        onValueChange(department.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {department.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === department.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No departments available.</CommandItem>
                                    )}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

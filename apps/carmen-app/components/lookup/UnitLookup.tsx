import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
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
import UnitDialog from "@/components/shared/UnitDialog";
import { UnitDto } from "@/dtos/unit.dto";
import { formType } from "@/dtos/form.dto";
import { PropsLookup } from "@/dtos/lookup.dto";
import { useUnitQuery } from "@/hooks/use-unit";
import { useAuth } from "@/context/AuthContext";

export default function UnitLookup({
    value,
    onValueChange,
    placeholder = "Select unit",
    disabled = false,
    classNames
}: Readonly<PropsLookup>) {
    const { token, tenantId } = useAuth();
    const { units, isLoading } = useUnitQuery({
        token,
        tenantId,
        params: {
            perpage: -1,
        }
    });

    // console.log('units', units?.data);

    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const selectedUnitName = useMemo(() => {
        if (!value || !units || !Array.isArray(units.data)) return null;
        const found = units.data.find((unit: UnitDto) => unit.id === value);
        return found?.name ?? null;
    }, [value, units]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddUnit = (data: any) => {
        onValueChange(data.id);
        setDialogOpen(false);
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        aria-expanded={open}
                        className={cn(classNames)}
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
                        <div className="relative w-full">
                            <CommandInput placeholder="Search unit..." className="w-full pr-10" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                onClick={handleOpenDialog}
                                type="button"
                                aria-label="Add new unit"
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <CommandList>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty>No units found.</CommandEmpty>
                                    <CommandGroup>
                                        {units && units.data.length > 0 ? (
                                            units.data.map((unit: UnitDto) => (
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
            <UnitDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={formType.ADD}
                onSubmit={handleAddUnit}
            />
        </>
    );
}

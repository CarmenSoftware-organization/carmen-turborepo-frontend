"use client";
import { UnitDto } from "@/dtos/unit.dto";
import { useCallback, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly availableUnits: UnitDto[];
  readonly disabled?: boolean;
}

export default function UnitCombobox({ value, onChange, availableUnits, disabled = false }: Props) {
  const tCommon = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const getUnitName = useCallback(
    (unitId: string) => {
      return availableUnits.find((unit: UnitDto) => unit.id === unitId)?.name ?? "Select unit...";
    },
    [availableUnits]
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn("min-w-24 h-7 justify-end text-xs px-1", !value && "text-muted-foreground")}
          disabled={disabled}
        >
          {value ? getUnitName(value) : "Select unit..."}
          <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search unit..." className="h-8" />
          <CommandList>
            <CommandEmpty>{tCommon("no_data_found")}</CommandEmpty>
            <CommandGroup>
              {availableUnits.map((unit: UnitDto) => (
                <CommandItem
                  key={unit.id}
                  value={unit.name}
                  onSelect={() => {
                    onChange(unit.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === unit.id ? "opacity-100" : "opacity-0")}
                  />
                  {unit.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

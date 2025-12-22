import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useBuTypeQuery } from "@/hooks/use-bu-type";
import { BuTypeGetAllDto } from "@/dtos/bu-type.dto";
import { Badge } from "@/components/ui/badge";

interface BuTypeLookupProps {
  readonly value?: { id: string; name: string }[];
  readonly onValueChange: (value: { id: string; name: string }[]) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export default function LookupBuType({
  value = [],
  onValueChange,
  placeholder = "Select business type",
  disabled = false,
}: BuTypeLookupProps) {
  const { token, buCode } = useAuth();
  const { buTypes, isLoading } = useBuTypeQuery(token, buCode, {
    perpage: -1,
  });

  const buTypeData = useMemo(() => buTypes?.data ?? [], [buTypes?.data]);
  const [open, setOpen] = useState(false);

  const handleSelect = (buType: BuTypeGetAllDto) => {
    const isSelected = value.some((item) => item.id === buType.id);
    let newValue;
    if (isSelected) {
      newValue = value.filter((item) => item.id !== buType.id);
    } else {
      newValue = [...value, { id: buType.id, name: buType.name }];
    }
    onValueChange(newValue);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newValue = value.filter((item) => item.id !== id);
    onValueChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((item) => (
                <Badge key={item.id} variant="secondary" className="mr-1 mb-1">
                  {item.name}
                  <div
                    role="button"
                    tabIndex={0}
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(e as any, item.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => handleRemove(e, item.id)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </div>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search department..." className="w-full pr-10" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <CommandEmpty>No business types found.</CommandEmpty>
                <CommandGroup>
                  {buTypeData.length > 0 ? (
                    buTypeData.map((buType: BuTypeGetAllDto) => {
                      const isSelected = value.some((item) => item.id === buType.id);
                      return (
                        <CommandItem
                          key={buType.id}
                          value={buType.name}
                          onSelect={() => handleSelect(buType)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className={cn("h-4 w-4")} />
                          </div>
                          {buType.name}
                        </CommandItem>
                      );
                    })
                  ) : (
                    <CommandItem disabled>No business types available.</CommandItem>
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

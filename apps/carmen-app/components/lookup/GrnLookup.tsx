import { PropsLookup } from "@/dtos/lookup.dto";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useGrn } from "@/hooks/useGrn";
import { GoodsReceivedNoteListDto } from "@/dtos/grn.dto";

export default function GrnLookup({
  value,
  onValueChange,
  placeholder = "Select GRN",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { grns, isLoading } = useGrn();

  const grnDatas = grns.data;

  const [open, setOpen] = useState(false);

  const selectedGrn = useMemo(() => {
    if (!value || !grnDatas || !Array.isArray(grnDatas)) return null;
    const found = grnDatas.find((grn) => grn.id === value);
    return found?.grn_no ?? null;
  }, [value, grnDatas]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value && selectedGrn ? selectedGrn : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value: string, search: string) => {
            if (!search) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder="Search price range..."
            className="w-full pr-10"
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <CommandEmpty>No price ranges found.</CommandEmpty>
                <CommandGroup>
                  {grnDatas && grnDatas.length > 0 ? (
                    grnDatas.map((grn: GoodsReceivedNoteListDto) => (
                      <CommandItem
                        key={grn.id}
                        value={grn.id}
                        onSelect={() => {
                          onValueChange(grn.id);
                          setOpen(false);
                        }}
                      >
                        {grn.grn_no}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === grn.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>
                      No price ranges available.
                    </CommandItem>
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

import { useDepartmentsQuery } from "@/hooks/use-departments";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsLookup } from "@/dtos/lookup.dto";
import { useAuth } from "@/context/AuthContext";
import { DepartmentGetListDto } from "@/dtos/department.dto";

export default function LookupDepartment({
  value,
  onValueChange,
  placeholder = "Select department",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, buCode } = useAuth();
  const { departments, isLoading } = useDepartmentsQuery(token, buCode);
  const [open, setOpen] = useState(false);

  const selectedDepartmentName = useMemo(() => {
    if (!value || !departments || !Array.isArray(departments)) return null;
    const found = departments.find((department) => department.id === value);
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
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No departments found.</CommandEmpty>
                <CommandGroup>
                  {departments && departments.length > 0 ? (
                    departments.map((department: DepartmentGetListDto) => (
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
  );
}

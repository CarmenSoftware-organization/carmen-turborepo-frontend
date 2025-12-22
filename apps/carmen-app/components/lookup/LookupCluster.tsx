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
import { useClusterQuery } from "@/hooks/useCluster";
import { useAuth } from "@/context/AuthContext";
import { ClusterGetDto } from "@/dtos/cluster.dto";

export default function LookupCluster({
  value,
  onValueChange,
  placeholder = "Select cluster",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token } = useAuth();
  const { data, isLoading } = useClusterQuery(token);
  const clsuters = useMemo(() => data?.data ?? [], [data?.data]);
  const [open, setOpen] = useState(false);

  const selectedClusterName = useMemo(() => {
    if (!value || !clsuters || !Array.isArray(clsuters)) return null;
    const found = clsuters.find((cluster) => cluster.id === value);
    return found?.name ?? null;
  }, [value, clsuters]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value && selectedClusterName ? selectedClusterName : placeholder}
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
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <CommandEmpty>No clusters found.</CommandEmpty>
                <CommandGroup>
                  {clsuters.length > 0 ? (
                    clsuters.map((cluster: ClusterGetDto) => (
                      <CommandItem
                        key={cluster.id}
                        value={cluster.name}
                        onSelect={() => {
                          if (cluster.id) {
                            onValueChange(cluster.id);
                          }
                          setOpen(false);
                        }}
                      >
                        {cluster.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === cluster.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>No clusters available.</CommandItem>
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

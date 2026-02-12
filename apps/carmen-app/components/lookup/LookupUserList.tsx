import { useUserList } from "@/hooks/useUserList";
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

export interface UserListItem {
  user_id: string;
  firstname: string;
  lastname: string;
}

interface LookupUserListProps extends PropsLookup {
  readonly onSelectObject?: (obj: UserListItem) => void;
}

export default function LookupUserList({
  value,
  onValueChange,
  placeholder = "Select user",
  disabled = false,
  classNames,
  onSelectObject,
}: Readonly<LookupUserListProps>) {
  const { token, buCode } = useAuth();
  const { userList, isLoading } = useUserList(token, buCode);
  const [open, setOpen] = useState(false);

  const selectedUserName = useMemo(() => {
    if (!value || !userList || !Array.isArray(userList)) return null;
    const found = userList.find((user) => user.user_id === value);
    return found ? found.firstname + "" + found.lastname : null;
  }, [value, userList]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn("w-full justify-between", classNames)}
          disabled={disabled}
        >
          <span className="truncate overflow-hidden overflow-ellipsis pr-2">
            {value && selectedUserName ? selectedUserName : placeholder}
          </span>
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
          <CommandInput placeholder="Search user..." className="w-full pr-10" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {userList && userList.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    userList.map((user: any) => (
                      <CommandItem
                        key={user.user_id}
                        value={user.firstname}
                        onSelect={() => {
                          if (user.user_id) {
                            onValueChange(user.user_id);
                            if (onSelectObject) {
                              onSelectObject(user as UserListItem);
                            }
                          }
                          setOpen(false);
                        }}
                      >
                        <span className="truncate overflow-hidden overflow-ellipsis pr-2">
                          {user.firstname}
                        </span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === user.user_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>No users available.</CommandItem>
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

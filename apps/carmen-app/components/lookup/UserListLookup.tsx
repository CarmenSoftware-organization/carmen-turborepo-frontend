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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserListLookupProps {
    readonly value?: string;
    readonly onValueChange: (value: string) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
}

export default function UserListLookup({
    value,
    onValueChange,
    placeholder = "Select user",
    disabled = false
}: UserListLookupProps) {
    const { userList, isLoading } = useUserList();
    const [open, setOpen] = useState(false);

    const selectedUserName = useMemo(() => {
        if (!value || !userList || !Array.isArray(userList)) return null;
        const found = userList.find(user => user.id === value);
        return found?.name ?? null;
    }, [value, userList]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    <span className="truncate overflow-hidden overflow-ellipsis pr-2">
                        {value && selectedUserName ? selectedUserName : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search user..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup>
                                    {userList && userList.length > 0 ? (
                                        userList.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                value={user.name}
                                                onSelect={() => {
                                                    if (user.id) {
                                                        onValueChange(user.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                <span className="truncate overflow-hidden overflow-ellipsis pr-2">
                                                    {user.name}
                                                </span>
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === user.id ? "opacity-100" : "opacity-0"
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

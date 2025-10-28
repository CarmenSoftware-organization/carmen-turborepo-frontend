import { UserLocationDto } from "@/dtos/location.dto";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import SearchInput from "@/components/ui-custom/SearchInput";

interface Props {
    users: UserLocationDto[];
}

export default function TabUsersLocation({ users }: Props) {
    const tCommon = useTranslations("Common");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter((user) => {
            const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
            return fullName.includes(query);
        });
    }, [users, searchQuery]);

    const highlightText = (text: string, query: string, itemId: string) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) => {
            const uniqueKey = `${itemId}-${part}-${index}`;
            if (part.toLowerCase() === query.toLowerCase()) {
                return (
                    <mark
                        key={uniqueKey}
                        className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-medium rounded px-0.5"
                    >
                        {part}
                    </mark>
                );
            }
            return <span key={uniqueKey}>{part}</span>;
        });
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">
                    {tCommon("users")} ({filteredUsers.length})
                </h2>


                <SearchInput
                    defaultValue={searchQuery}
                    onSearch={setSearchQuery}
                    placeholder={tCommon("search")}
                    data-id="bu-type-search-input"
                />
            </div>

            {filteredUsers.length > 0 ? (
                <ul className="h-[300px] w-full overflow-y-auto border border-border rounded-md">
                    {filteredUsers.map((user, index) => {
                        const fullName = `${user.firstname ?? "-"} ${user.lastname ?? "-"}`;
                        return (
                            <li
                                key={user.id}
                                className={`text-xs p-2 hover:bg-muted/50 transition-colors ${index === filteredUsers.length - 1 ? "" : "border-b border-border/50"}`}
                            >
                                {highlightText(fullName, searchQuery, user.id)}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="h-[300px] border border-border rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-xs">
                        {tCommon("data_not_found")}
                    </p>
                </div>
            )}
        </div>
    );
}

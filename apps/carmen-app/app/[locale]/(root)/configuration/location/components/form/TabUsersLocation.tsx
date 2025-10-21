import { UserLocationDto } from "@/dtos/config.dto";
import { useTranslations } from "next-intl";

interface Props {
    users: UserLocationDto[];
}

export default function TabUsersLocation({ users }: Props) {
    const tCommon = useTranslations("Common");
    return (
        <div className="space-y-2">
            <h2 className="text-sm font-semibold">
                {tCommon("users")} ({users.length ?? 0})
            </h2>
            {(users.length ?? 0) > 0 ? (
                <ul className="space-y-1 h-[300px] overflow-y-auto text-sm pl-4 list-disc p-2">
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.firstname ?? '-'} {user.lastname ?? '-'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-xs text-center py-2">
                    {tCommon("data_not_found")}
                </p>
            )}
        </div>
    );
}
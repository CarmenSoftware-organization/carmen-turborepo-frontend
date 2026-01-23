import { useTranslations } from "next-intl";
import { UserDpDto } from "../../_types/users-department.type";

interface Props {
  initUsers: UserDpDto[];
}

export default function UsersDepartment({ initUsers }: Props) {
  console.log("initUsers", initUsers);
  const tDepartment = useTranslations("Department");
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {tDepartment("users")} ({initUsers.length})
      </h2>

      {initUsers.length > 0 ? (
        <div className="grid gap-3">
          {initUsers.map((user) => (
            <div
              key={user.key}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-md border border-border"
            >
              <span className="text-sm font-medium">{user.title}</span>
              {user.is_hod && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium">
                  HOD
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
          <p className="text-sm text-muted-foreground">{tDepartment("no_users_assigned")}</p>
        </div>
      )}
    </div>
  );
}

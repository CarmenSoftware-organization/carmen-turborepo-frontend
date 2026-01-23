import { useTranslations } from "next-intl";
import { UserDpDto } from "../../_types/users-department.type";
import { Crown, User, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  initUsers: UserDpDto[];
}

export default function UsersDepartment({ initUsers }: Props) {
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");

  const hodCount = useMemo(
    () => initUsers.filter((user) => user.is_hod).length,
    [initUsers]
  );

  if (initUsers.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/5"
        aria-label={tDepartment("no_users_assigned")}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 mb-4">
          <UserX className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {tDepartment("no_users_assigned")}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {tDepartment("add_users_hint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>{tCommon("name")}</TableHead>
              <TableHead className="w-24 text-center">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">HOD</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{tDepartment("hod_tooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initUsers.map((user, index) => (
              <TableRow
                key={user.key}
                className={cn(
                  user.is_hod && "bg-amber-50/50 dark:bg-amber-950/10"
                )}
              >
                <TableCell className="text-center text-muted-foreground text-xs">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full shrink-0",
                        user.is_hod
                          ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                      )}
                      aria-hidden="true"
                    >
                      {user.is_hod ? (
                        <Crown className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm truncate",
                        user.is_hod && "font-medium"
                      )}
                      title={user.title}
                    >
                      {user.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {user.is_hod && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50"
                          >
                            <Crown className="h-3 w-3 mr-1" aria-hidden="true" />
                            HOD
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{tDepartment("hod_badge_tooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground">
        <span>
          {tDepartment("total_users")}: <strong>{initUsers.length}</strong>
        </span>
        {hodCount > 0 && (
          <span className="flex items-center gap-1">
            <Crown className="h-3 w-3 text-amber-500" aria-hidden="true" />
            HOD: <strong>{hodCount}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

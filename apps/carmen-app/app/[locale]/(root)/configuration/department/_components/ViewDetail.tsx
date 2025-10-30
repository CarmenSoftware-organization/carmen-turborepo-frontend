"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, SquarePen } from "lucide-react";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

interface ViewDetailProps {
  readonly data: {
    name: string;
    description: string;
    is_active: boolean;
    users: Array<{ key: string; title: string; isHod: boolean }>;
  };
  readonly onEdit: () => void;
  readonly onBack: () => void;
}

export default function ViewDetail({ data, onEdit, onBack }: ViewDetailProps) {
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="fxr-c gap-4">
          <Button size={"sm"} variant={"outline"} className="h-7 w-7" onClick={onBack}>
            <ChevronLeft />
          </Button>
          <h1 className="text-xl font-semibold">{data.name}</h1>
        </div>
        <Button onClick={onEdit} size="sm" className="fxr-c gap-2 text-sm">
          <SquarePen className="w-4 h-4" />
          {tCommon("edit")}
        </Button>
      </div>

      <Separator />

      <dl className="grid grid-cols-[140px_1fr] gap-y-2 gap-x-4 text-sm">
        <dt className="font-medium text-muted-foreground">{tHeader("status")}</dt>
        <dd>
          <StatusCustom is_active={data?.is_active ?? true}>
            {data?.is_active ? tCommon("active") : tCommon("inactive")}
          </StatusCustom>
        </dd>

        <dt className="font-medium text-muted-foreground">{tHeader("description")}</dt>
        <dd>{data?.description ?? "-"}</dd>
      </dl>

      <Separator />

      <div className="space-y-2">
        <h2 className="text-sm font-semibold">
          {tCommon("users")} ({data?.users?.length ?? 0})
        </h2>
        {(data?.users?.length ?? 0) > 0 ? (
          <ul className="space-y-1 max-h-[150px] overflow-y-auto text-sm pl-4 list-disc">
            {data?.users.map((user) => (
              <li key={user.key} className="font-medium">
                {user.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-xs text-center py-2">
            {tCommon("data_not_found")}
          </p>
        )}
      </div>
    </div>
  );
}

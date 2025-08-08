"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, SquarePen, } from "lucide-react";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useTranslations } from "next-intl";

interface ViewDetailProps {
    readonly data: {
        name: string;
        description: string;
        is_active: boolean;
        users: Array<{ key: string; title: string; isHod: boolean }>;
    };
    readonly onEdit: () => void;
    readonly onBack: () => void;
};


export default function ViewDetail({ data, onEdit, onBack }: ViewDetailProps) {
    const tCommon = useTranslations("Common");
    const tHeader = useTranslations("TableHeader");
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-transparent"
                    onClick={onBack}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-3xl font-bold leading-tight">{data.name}</h1>
            </div>

            {/* Details */}
            <div className="px-6 space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-start">
                    <p className="font-semibold text-base">{tHeader("status")}</p>
                    <StatusCustom is_active={data?.is_active ?? true}>
                        {data?.is_active ? tCommon("active") : tCommon("inactive")}
                    </StatusCustom>

                    <p className="font-semibold text-base">{tHeader("description")}</p>
                    <p className="text-base">{data?.description ?? '-'}</p>
                </div>

                {/* Users */}
                <div className="space-y-2 pt-4">
                    <p className="font-semibold text-base">
                        {tCommon("users")} ({data.users.length ?? 0})
                    </p>
                    {(data?.users?.length ?? 0) > 0 ? (
                        <div className="overflow-y-auto max-h-[200px]">
                            {data?.users.map((user) => (
                                <ul key={user.key} className="list-disc list-inside">
                                    <li className="text-sm font-medium">{user.title}</li>
                                </ul>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm">{tCommon("data_not_found")}</p>
                    )}
                </div>
            </div>

            {/* Edit button */}
            <div className="px-6">
                <Button
                    onClick={onEdit}
                    size="sm"
                    variant="outlinePrimary"
                    className="flex items-center gap-2"
                >
                    <SquarePen className="w-4 h-4" />
                    {tCommon("edit")}
                </Button>
            </div>
        </div>

    );
}
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export type ActivityLogItem = {
    id: string;
    date: string;
    user: string;
    action: string;
};

type ActivityLogComponentProps = {
    readonly initialActivities: ActivityLogItem[];
    readonly onSearchChange?: (searchTerm: string) => void;
    readonly searchPlaceholder?: string;
};

export default function ActivityLogComponent({
    initialActivities,
    onSearchChange,
    searchPlaceholder = "Search Activity log..."
}: ActivityLogComponentProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activities, setActivities] = useState<ActivityLogItem[]>(initialActivities);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (onSearchChange) {
            onSearchChange(value);
        } else {
            // Default local search implementation
            const filtered = value.trim() === ""
                ? initialActivities
                : initialActivities.filter(activity =>
                    activity.date.toLowerCase().includes(value.toLowerCase()) ||
                    activity.user.toLowerCase().includes(value.toLowerCase()) ||
                    activity.action.toLowerCase().includes(value.toLowerCase())
                );
            setActivities(filtered);
        }
    };

    return (
        <div>
            <Input
                className="h-7 mb-2"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <ScrollArea className="h-[calc(80vh-120px)]">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <Card key={activity.id} className="p-1.5 mb-1.5">
                            <div className="flex items-start gap-1.5">
                                <div className="h-5 w-5 bg-muted rounded-full flex items-center justify-center text-[10px] font-medium shrink-0">
                                    {activity.user.charAt(0)}
                                </div>
                                <div className="w-full min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-[11px] truncate">{activity.user}</p>
                                        <p className="text-[10px] text-muted-foreground shrink-0">{activity.date}</p>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">{activity.action}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-center py-3 text-xs text-muted-foreground">
                        No Activity Log
                    </p>
                )}
            </ScrollArea>
        </div>
    );
} 
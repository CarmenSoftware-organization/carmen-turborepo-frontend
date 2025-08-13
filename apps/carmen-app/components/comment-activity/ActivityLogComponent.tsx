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
                className="h-7 mb-3"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
            />

            <ScrollArea className="h-[calc(80vh-120px)]">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <Card key={activity.id} className="p-2 mb-2">
                            <div className="flex items-start gap-2">
                                <div className="h-6 w-6 bg-muted rounded-full fxr-c justify-center">
                                    {activity.user.charAt(0)}
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-xs">{activity.user}</p>
                                        <p className="text-xs">{activity.date}</p>
                                    </div>
                                    <p className="text-xs">{activity.action}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-center py-4 text-sm text-muted-foreground">
                        No Activity Log
                    </p>
                )}
            </ScrollArea>
        </div>
    );
} 
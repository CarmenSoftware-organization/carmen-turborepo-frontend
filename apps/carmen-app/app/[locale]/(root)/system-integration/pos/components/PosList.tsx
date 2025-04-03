import SystemCategory from "./SystemCategory";
import SystemRecentActivity from "./SystemRecentActivity";
import SystemStatus from "./SystemStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function PosList() {
    return (
        <ScrollArea className="space-y-4 h-[calc(105vh-190px)]">
            <SystemStatus />
            <SystemCategory />
            <SystemRecentActivity />
        </ScrollArea>
    );
}

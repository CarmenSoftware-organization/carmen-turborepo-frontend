import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import BalanceReport from "./BalanceReport";
import MovementHistory from "./MovementHistory";

export default function InventoryBalanceTabs() {
    return (
        <Tabs defaultValue="balance_report">
            <TabsList>
                <TabsTrigger value="balance_report">Balance Report</TabsTrigger>
                <TabsTrigger value="movement_history">Movement History</TabsTrigger>
            </TabsList>
            <TabsContent value="balance_report">
                <BalanceReport />
            </TabsContent>
            <TabsContent value="movement_history">
                <MovementHistory />
            </TabsContent>
        </Tabs>
    );
}

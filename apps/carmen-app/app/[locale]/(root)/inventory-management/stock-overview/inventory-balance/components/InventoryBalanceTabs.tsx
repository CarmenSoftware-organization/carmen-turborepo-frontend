import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function InventoryBalanceTabs() {
    return (
        <Tabs defaultValue="balance_report" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="balance_report">Balance Report</TabsTrigger>
                <TabsTrigger value="movement_history">Movement History</TabsTrigger>
            </TabsList>
            <TabsContent value="balance_report">

            </TabsContent>
            <TabsContent value="password">

            </TabsContent>
        </Tabs>
    );
}

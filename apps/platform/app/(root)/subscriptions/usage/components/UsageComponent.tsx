import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUBSCRIPTION_TAB } from "@/constants/enum";
import { ChartLine, FileText } from "lucide-react";
import UsageTab from "./UsageTab";

export default function UsageComponent() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Subscription Usage</h2>
                <p className="text-muted-foreground">
                    Monitor resource usage across business units
                </p>
            </div>
            <Tabs defaultValue={SUBSCRIPTION_TAB.USAGE} className="space-y-4">
                <TabsList>
                    <TabsTrigger value={SUBSCRIPTION_TAB.USAGE} className='flex items-center gap-2'>
                        <FileText className='h-4 w-4' />
                        Current Usage
                    </TabsTrigger>
                    <TabsTrigger value={SUBSCRIPTION_TAB.TRENDS} className='flex items-center gap-2'>
                        <ChartLine className='h-4 w-4' />
                        Usage Trends
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={SUBSCRIPTION_TAB.USAGE}>
                    <UsageTab />
                </TabsContent>
                <TabsContent value={SUBSCRIPTION_TAB.TRENDS}>
                    {/* <TrendsTab /> */}
                </TabsContent>
            </Tabs>
        </div>
    )
}

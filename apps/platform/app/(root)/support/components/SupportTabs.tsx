import { SUPPORT_TAB } from "@/constants/enum"
import { mockSupport } from "@/mock-data/support"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClipboardMinus, TicketCheck, View } from 'lucide-react'
import OverviewTab from "./tabs/OverviewTab";
import TicketTab from "./tabs/TicketTab";
import ReportTab from "./tabs/ReportTab";

export default function SupportTabs() {
    const supports = mockSupport;

    return (
        <Tabs defaultValue={SUPPORT_TAB.OVERVIEW} className="space-y-4">
            <TabsList>
                <TabsTrigger value={SUPPORT_TAB.OVERVIEW} className="flex items-center gap-2">
                    <View className="h-4 w-4" />
                    Overview
                </TabsTrigger>
                <TabsTrigger value={SUPPORT_TAB.TICKETS} className="flex items-center gap-2">
                    <TicketCheck className="h-4 w-4" />
                    Tickets
                </TabsTrigger>
                <TabsTrigger value={SUPPORT_TAB.REPORTS} className="flex items-center gap-2">
                    <ClipboardMinus className="h-4 w-4" />
                    Reports
                </TabsTrigger>
            </TabsList>

            <TabsContent value={SUPPORT_TAB.OVERVIEW}>
                <OverviewTab supports={supports} />
            </TabsContent>

            <TabsContent value={SUPPORT_TAB.TICKETS}>
                <TicketTab tickets={supports.support_results} />
            </TabsContent>

            <TabsContent value={SUPPORT_TAB.REPORTS}>
                <ReportTab />
            </TabsContent>
        </Tabs>
    )
}

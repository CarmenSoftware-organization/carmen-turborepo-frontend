import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUBSCRIPTION_REPORT_TAB } from "@/constants/enum";
import TabReportOverview from "./tabs/TabReportOverview";
import TabReportModule from "./tabs/TabReportModule";
import TabReportRevenue from "./tabs/TabReportRevenue";
import TabReportLicense from "./tabs/TabReportLicense";
import { LayoutDashboard, FileKey, Boxes, DollarSign } from "lucide-react";

export default function TabReport() {
    return (
        <Tabs defaultValue={SUBSCRIPTION_REPORT_TAB.OVERVIEW}>
            <TabsList>
                <TabsTrigger value={SUBSCRIPTION_REPORT_TAB.OVERVIEW} className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Overview
                </TabsTrigger>
                <TabsTrigger value={SUBSCRIPTION_REPORT_TAB.LICENSES} className="flex items-center gap-2">
                    <FileKey className="h-4 w-4" />
                    Licenses
                </TabsTrigger>
                <TabsTrigger value={SUBSCRIPTION_REPORT_TAB.MODULES} className="flex items-center gap-2">
                    <Boxes className="h-4 w-4" />
                    Modules
                </TabsTrigger>
                <TabsTrigger value={SUBSCRIPTION_REPORT_TAB.REVENUE} className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Revenue
                </TabsTrigger>
            </TabsList>
            <TabsContent value={SUBSCRIPTION_REPORT_TAB.OVERVIEW}>
                <TabReportOverview />
            </TabsContent>
            <TabsContent value={SUBSCRIPTION_REPORT_TAB.LICENSES}>
                <TabReportLicense />
            </TabsContent>
            <TabsContent value={SUBSCRIPTION_REPORT_TAB.MODULES}>
                <TabReportModule />
            </TabsContent>
            <TabsContent value={SUBSCRIPTION_REPORT_TAB.REVENUE}>
                <TabReportRevenue />
            </TabsContent>
        </Tabs>
    )
}

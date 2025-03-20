import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUBSCRIPTION_PLAN_TAB } from "@/constants/enum";
import ConfigurationDetail from "./tabs/ConfigurationDetail";
import LicenseRule from "./tabs/LicenseRule";
import PlanTier from "./tabs/PlanTier";

export default function TabsPlan() {
    return (
        <Tabs defaultValue={SUBSCRIPTION_PLAN_TAB.PLAN}>
            <TabsList>
                <TabsTrigger value={SUBSCRIPTION_PLAN_TAB.PLAN}>{SUBSCRIPTION_PLAN_TAB.PLAN}</TabsTrigger>
                <TabsTrigger value={SUBSCRIPTION_PLAN_TAB.CONFIGURATION}>{SUBSCRIPTION_PLAN_TAB.CONFIGURATION}</TabsTrigger>
                <TabsTrigger value={SUBSCRIPTION_PLAN_TAB.RULE}>{SUBSCRIPTION_PLAN_TAB.RULE}</TabsTrigger>
            </TabsList>
            <TabsContent value={SUBSCRIPTION_PLAN_TAB.PLAN}>
                <PlanTier />
            </TabsContent>
            <TabsContent value={SUBSCRIPTION_PLAN_TAB.CONFIGURATION}>
                <ConfigurationDetail />
            </TabsContent>
            <TabsContent value={SUBSCRIPTION_PLAN_TAB.RULE}>
                <LicenseRule />
            </TabsContent>
        </Tabs>
    )
}
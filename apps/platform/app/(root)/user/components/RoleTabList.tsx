import { ROLE_PLATFORM_TAB } from "@/constants/enum";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Building2, FileStack } from 'lucide-react'
import RoleTabCluster from "./RoleTabCluster";
import RoleTabPlatform from "./RoleTabPlatform";
import RoleTabDepartment from "./RoleTabDepartment";
export default function RoleTabList() {
    return (
        <Tabs defaultValue={ROLE_PLATFORM_TAB.PLATFORM} className="space-y-4">
            <TabsList>
                <TabsTrigger value={ROLE_PLATFORM_TAB.PLATFORM} className='flex items-center gap-2'>
                    <Shield className='h-4 w-4' />
                    Platform Role
                </TabsTrigger>
                <TabsTrigger value={ROLE_PLATFORM_TAB.CLUSTER} className='flex items-center gap-2'>
                    <Building2 className='h-4 w-4' />
                    Business Unit Report
                </TabsTrigger>
                <TabsTrigger value={ROLE_PLATFORM_TAB.DEPARTMENT} className='flex items-center gap-2'>
                    <FileStack className='h-4 w-4' />
                    Report Templates
                </TabsTrigger>
            </TabsList>
            <TabsContent value={ROLE_PLATFORM_TAB.PLATFORM}>
                <RoleTabPlatform />
            </TabsContent>
            <TabsContent value={ROLE_PLATFORM_TAB.CLUSTER}>
                <RoleTabCluster />
            </TabsContent>
            <TabsContent value={ROLE_PLATFORM_TAB.DEPARTMENT}>
                <RoleTabDepartment />
            </TabsContent>
        </Tabs>
    )
}

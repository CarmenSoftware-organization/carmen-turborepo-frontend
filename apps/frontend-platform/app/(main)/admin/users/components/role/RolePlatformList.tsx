import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building, Building2, Shield } from 'lucide-react'
import React from 'react'
import TabPlatform from './TabPlatform'
import TabCluster from './TabCluster'
import TabDepartment from './TabDepartment'
import { ROLE_PLATFORM_TAB } from '@/constants/enum'
const RolePlatformList = () => {
    return (
        <Tabs defaultValue={ROLE_PLATFORM_TAB.PLATFORM} className="space-y-4">
            <TabsList>
                <TabsTrigger value={ROLE_PLATFORM_TAB.PLATFORM} className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Platform Roles
                </TabsTrigger>
                <TabsTrigger value={ROLE_PLATFORM_TAB.CLUSTER} className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Cluster Roles
                </TabsTrigger>
                <TabsTrigger value={ROLE_PLATFORM_TAB.DEPARTMENT} className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Department Roles
                </TabsTrigger>
            </TabsList>

            <TabsContent value={ROLE_PLATFORM_TAB.PLATFORM}>
                <TabPlatform />
            </TabsContent>

            <TabsContent value={ROLE_PLATFORM_TAB.CLUSTER}>
                <TabCluster />
            </TabsContent>

            <TabsContent value={ROLE_PLATFORM_TAB.DEPARTMENT}>
                <TabDepartment />
            </TabsContent>
        </Tabs>
    )
}

export default RolePlatformList
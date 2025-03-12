import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { REPORT_TAB } from '@/constants/enum'
import { Building2, FileStack, FileText } from 'lucide-react'
import Assignments from './tab/Assignments'
import BusinessReport from './tab/BusinessReport'
import Templates from './tab/Templates'
const ReportTabList = () => {
    return (
        <Tabs defaultValue={REPORT_TAB.ASSIGNMENTS} className="space-y-4">
            <TabsList>
                <TabsTrigger value={REPORT_TAB.ASSIGNMENTS} className='flex items-center gap-2'>
                    <FileText className='h-4 w-4' />
                    Assignments
                </TabsTrigger>
                <TabsTrigger value={REPORT_TAB.BU_REPORT} className='flex items-center gap-2'>
                    <Building2 className='h-4 w-4' />
                    BU Report
                </TabsTrigger>
                <TabsTrigger value={REPORT_TAB.TEMPLATES} className='flex items-center gap-2'>
                    <FileStack className='h-4 w-4' />
                    Templates
                </TabsTrigger>
            </TabsList>
            <TabsContent value={REPORT_TAB.ASSIGNMENTS}>
                <Assignments />
            </TabsContent>
            <TabsContent value={REPORT_TAB.BU_REPORT}>
                <BusinessReport />
            </TabsContent>
            <TabsContent value={REPORT_TAB.TEMPLATES}>
                <Templates />
            </TabsContent>
        </Tabs>
    )
}

export default ReportTabList
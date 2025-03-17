import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { REPORT_TAB } from '@/constants/enum';
import { Building2, FileStack, FileText } from 'lucide-react'
import Assignments from './tabs/Assignments';
import BusinessReport from './tabs/BusinessReport';
import ReportTemplate from './tabs/ReportTemplate';

export default function ReportTabList() {
    return (
        <Tabs defaultValue={REPORT_TAB.ASSIGNMENTS} className="space-y-4">
            <TabsList>
                <TabsTrigger value={REPORT_TAB.ASSIGNMENTS} className='flex items-center gap-2'>
                    <FileText className='h-4 w-4' />
                    Report Assignments
                </TabsTrigger>
                <TabsTrigger value={REPORT_TAB.BU_REPORT} className='flex items-center gap-2'>
                    <Building2 className='h-4 w-4' />
                    Business Unit Report
                </TabsTrigger>
                <TabsTrigger value={REPORT_TAB.TEMPLATES} className='flex items-center gap-2'>
                    <FileStack className='h-4 w-4' />
                    Report Templates
                </TabsTrigger>
            </TabsList>
            <TabsContent value={REPORT_TAB.ASSIGNMENTS}>
                <Assignments />
            </TabsContent>
            <TabsContent value={REPORT_TAB.BU_REPORT}>
                <BusinessReport />
            </TabsContent>
            <TabsContent value={REPORT_TAB.TEMPLATES}>
                <ReportTemplate />
            </TabsContent>
        </Tabs>
    )
}

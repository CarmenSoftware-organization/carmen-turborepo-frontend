import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area';
import { getBusinessUnitReports } from '@/services/report/report';
import { ReportBusinessUnitType, ReportClusterType, ReportSubType } from '@/types/main';
import { Building2, FolderTree, MoreHorizontal } from 'lucide-react';
import React from 'react'

const BusinessReport = async () => {
    const businessUnitReports = await getBusinessUnitReports();
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold tracking-tight'>Business Unit Reports</h2>
                <div className='flex items-center gap-2'>
                    <Input placeholder='Search' className='h-8 w-64' />
                </div>
            </div>
            <ScrollArea className='h-[500px]'>
                {businessUnitReports.map((report: ReportClusterType) => (
                    <div key={report.id}>
                        <div className='flex items-center gap-2 mb-2'>
                            <FolderTree className="h-5 w-5 text-muted-foreground" />
                            <h3 className='text-lg font-medium'>{report.cluster}</h3>
                        </div>
                        {report.business_unit.map((bu: ReportBusinessUnitType) => (
                            <Card key={bu.id} className='m-4'>
                                <CardHeader>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <Building2 className="h-5 w-5 text-muted-foreground" />
                                                <h4 className='text-md font-medium'>{bu.name}</h4>
                                            </div>
                                            <p className='text-sm text-muted-foreground'>{bu.description}</p>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>

                                </CardHeader>
                                <CardContent>
                                    {bu.reports.map((report: ReportSubType) => (
                                        <div key={report.id} className='flex items-center gap-2 space-y-2'>
                                            <h4 className='text-md font-medium'>{report.title}</h4>
                                            <Badge variant='default'>{report.type}</Badge>
                                            <Badge variant='secondary'>{report.status}</Badge>
                                            <Badge variant='outline'>{report.category}</Badge>
                                        </div>
                                    ))}
                                </CardContent>

                            </Card>
                        ))}
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}

export default BusinessReport;
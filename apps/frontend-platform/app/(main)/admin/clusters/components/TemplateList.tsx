import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TemplateReportType } from '@/types/main'
import React from 'react'

interface TemplateListProps {
    templates: TemplateReportType[]
}
const TemplateList = ({ templates }: TemplateListProps) => {
    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>
                        Available Templates
                    </CardTitle>
                </CardHeader>

                <ScrollArea className='h-[500px]'>
                    <CardContent>
                        {templates.map((template) => (
                            <Card key={template.id} className='mb-2'>
                                <div className='flex items-start justify-between p-4'>
                                    <div className='space-y-4'>
                                        <p className='text-lg font-medium'>{template.title}</p>
                                        <div className='space-y-1'>
                                            <p className='text-sm text-muted-foreground'>{template.description}</p>
                                            <p className='text-sm text-muted-foreground'>Assigned to {template.count_assigned} hotels in this group</p>
                                        </div>

                                    </div>
                                    <Badge variant='default'>{template.type}</Badge>
                                </div>
                            </Card>
                        ))}
                    </CardContent>
                </ScrollArea>
            </Card>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>
                        Hotel Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    )
}

export default TemplateList
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getReportTemplates } from '@/services/report/report'
import { ReportTemplateType } from '@/types/main'
import { format } from 'date-fns'
import React from 'react'

const Templates = async () => {
    const templates = await getReportTemplates()
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold tracking-tight'>Report Templates</h2>
                <div className='flex items-center gap-2'>
                    <Input placeholder='Search' className='h-8 w-64' />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Available Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Schedule</TableHead>
                                <TableHead>Data Points</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {templates.map((template: ReportTemplateType) => (
                                <TableRow key={template.id}>
                                    <TableCell>{template.name}</TableCell>
                                    <TableCell>{template.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>{template.status}</Badge>
                                    </TableCell>
                                    <TableCell>{template.schedule}</TableCell>
                                    <TableCell>{template.data_points}</TableCell>
                                    <TableCell className='flex flex-wrap gap-1'>
                                        {template.assigned_to.map((assignee) => (
                                            <Badge key={assignee.name} variant='default'>{assignee.name}</Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell>{format(template.last_updated, 'MMM d, yyyy')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Templates
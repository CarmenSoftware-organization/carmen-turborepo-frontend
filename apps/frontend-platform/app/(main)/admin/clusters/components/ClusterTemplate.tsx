import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTemplateReports } from '@/services/cluster/template-report';
import { Plus } from 'lucide-react';
import React from 'react'
import TemplateList from './TemplateList';

const ClusterTemplate = async () => {
    const reportTemplates = await getTemplateReports();
    return (
        <div className="space-y-6">
            <div className='space-y-1'>
                <h2 className="text-2xl font-bold tracking-tight">Report Templates</h2>
                <p className="text-muted-foreground">
                    Manage and assign report templates across clusters
                </p>
            </div>
            <div className='flex items-center justify-between'>
                <Input type='text' placeholder='Search...' className='w-1/3 h-8' />
                <Button size='sm'>
                    <Plus />
                    Create Template
                </Button>
            </div>
            {/* <ClusterTemplates /> */}
            <TemplateList templates={reportTemplates} />
        </div>
    )
}

export default ClusterTemplate;
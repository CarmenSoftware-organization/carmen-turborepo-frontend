import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'
import SupportList from './SupportList'

const SupportComponent = () => {
    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Support
                    </h2>
                    <p className="text-muted-foreground">
                        Manage support tickets and customer requests
                    </p>
                </div>
                <Button className="font-medium" size={'sm'}>
                    <Plus className="h-4 w-4" />
                    Add Ticket
                </Button>
            </div>
            <SupportList />
        </div>
    )
}

export default SupportComponent
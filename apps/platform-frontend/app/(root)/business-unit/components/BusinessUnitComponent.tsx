import React from 'react'
import { getBusinessUnits } from '@/services/bu.service'
import { Button } from '@/components/ui/button';
import BuFilter from './BuFilter';
import BuList from './BuList';
import Link from 'next/link';

const BusinessUnitComponent = async () => {
    const businessUnits = await getBusinessUnits();
    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='space-y-2'>
                    <h2 className="text-2xl font-bold tracking-tight">Business Units</h2>
                    <p className="text-muted-foreground">
                        Manage all hotels and properties in the system
                    </p>
                </div>
                <Button asChild>
                    <Link href="/business-unit/add">Add Business Unit</Link>
                </Button>
            </div>
            <BuFilter />
            <BuList businessUnits={businessUnits} />
        </>
    )
}

export default BusinessUnitComponent
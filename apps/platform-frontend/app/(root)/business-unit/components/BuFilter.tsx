import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const BuFilter = () => {
    return (
        <div className='flex justify-between items-center'>
            <div className='flex gap-2 w-1/2'>
                <Input type='text' placeholder='Search' />
                <Button>Search</Button>
            </div>
            <div className='flex gap-2'>
                <Button>Export</Button>
                <Button>Import</Button>
            </div>
        </div>
    )
}

export default BuFilter
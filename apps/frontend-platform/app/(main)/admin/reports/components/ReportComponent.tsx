import React from 'react'
import ReportTabList from './ReportTabList'

const ReportComponent = () => {
    return (
        <div className='space-y-6'>
            <div className='space-y-1'>
                <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
                <p className="text-muted-foreground">
                    Manage report assignments and templates
                </p>
            </div>
            <ReportTabList />
        </div>
    )
}

export default ReportComponent
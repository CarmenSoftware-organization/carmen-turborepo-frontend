import React from 'react'
import NotiApproval from './NotiApproval'
import RecentApprovals from './RecentApprovals'
import PrqApproval from './PrqApproval'
import * as m from '@/paraglide/messages.js';
const MyApprovalList = () => {
    return (
        <div className='container mx-auto p-6'>
            <h1 className="text-3xl font-semibold mb-6">{m.department_approve()}</h1>
            <div className="grid gap-6 lg:grid-cols-3">
                <PrqApproval />
                <div className='space-y-6'>
                    <RecentApprovals />
                    <NotiApproval />
                </div>

            </div>
        </div>
    )
}

export default MyApprovalList
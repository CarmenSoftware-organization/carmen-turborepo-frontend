import React from 'react'
import RolePlatformList from './RolePlatformList'

const RolePlatformComponent = () => {
    return (
        <div className='space-y-6'>
            <div className='space-y-1'>
                <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
                <p className="text-muted-foreground">
                    Configure and manage user roles across the platform
                </p>
            </div>
            <RolePlatformList />
        </div>
    )
}

export default RolePlatformComponent
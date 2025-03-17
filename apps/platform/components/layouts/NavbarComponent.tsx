import React from 'react'
import { SwitchTheme } from '../SwitchTheme'
import UserAvatar from '../UserAvatar'

export const NavbarComponent = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex items-center justify-end gap-2 p-1">
                <SwitchTheme />
                <UserAvatar />
            </nav>
        </header>
    )
}

import RefreshToken from '@/components/RefreshToken';
import { Card, CardContent } from '@/components/ui/card'
import { session_expire } from '@/paraglide/messages';
import React from 'react'

const RefreshTokenComponents = () => {
    return (
        <Card
            className="border-destructive w-full md:w-1/2"
            data-id="currency-refresh-token-card"
        >
            <CardContent className="pt-6" data-id="currency-refresh-token-content">
                <div
                    className="flex flex-col items-center gap-4"
                    data-id="currency-refresh-token-container"
                >
                    <p className="text-destructive">{session_expire()}</p>
                    <RefreshToken />
                </div>
            </CardContent>
        </Card>
    )
}

export default RefreshTokenComponents;
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

interface ErrorProps {
    message: string
}

const ErrorCard = ({ message }: ErrorProps) => {
    return (
        <Card className="border-destructive">
            <CardContent className="pt-6">
                <p className="text-destructive">
                    Error loading delivery points: {message}
                </p>
            </CardContent>
        </Card>
    )
}

export default ErrorCard
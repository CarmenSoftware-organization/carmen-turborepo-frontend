'use client'

import React, { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ErrorProps = Readonly<{
    error: Error & { digest?: string }
    reset: () => void
}>

export default function ErrorPage({ error, reset }: ErrorProps) {

    useEffect(() => {
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6 shadow-sm">
                <div className="mb-4 text-5xl text-destructive">
                    <AlertCircle className="mx-auto h-16 w-16" />
                </div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight">Oops! Something went wrong</h2>
                <p className="mb-6 text-muted-foreground">
                    {error.message || "We couldn't load the requested data at this time."}
                </p>
                <Button
                    onClick={reset}
                    variant="default"
                    size="default"
                    aria-label="Try again"
                >
                    Try again
                </Button>
            </div>
        </div>
    )
} 
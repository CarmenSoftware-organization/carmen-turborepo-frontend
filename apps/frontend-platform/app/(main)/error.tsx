'use client'

import React from 'react'
import { useEffect } from 'react'

type ErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6 shadow-sm">
                <div className="mb-4 text-5xl text-destructive">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto h-16 w-16"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight">Oops! Something went wrong</h2>
                <p className="mb-6 text-muted-foreground">
                    {error.message || "We couldn't load the requested data at this time."}
                </p>
                <button
                    onClick={reset}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    tabIndex={0}
                    aria-label="Try again"
                >
                    Try again
                </button>
            </div>
        </div>
    )
} 
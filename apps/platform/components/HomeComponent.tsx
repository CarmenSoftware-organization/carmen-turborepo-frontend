import Link from 'next/link'
import React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from './ui/button'

const HomeComponent = () => {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Hero Section */}
            <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 pb-16 pt-24 text-center md:pb-24 md:pt-32">
                <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-6xl">
                    Enterprise Supply Chain
                    <br />
                    Platform Management
                </h1>
                <p className="mt-6 animate-fade-up text-center text-muted-foreground/80 md:text-xl">
                    Streamline your supply chain operations with our powerful platform.
                    <br className="hidden md:block" />
                    Manage clusters, business units, and reports in one place.
                </p>
                <div className="mt-8 flex animate-fade-up items-center justify-center gap-4">

                    <Button size="lg" asChild>
                        <Link href="/auth">
                            Get Started
                            <ArrowRight />
                        </Link>
                    </Button>
                    <Button size="lg" asChild variant={'secondary'}>
                        <Link href="/admin/dashboard">
                            Contact Sales
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Features Section */}
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-3 md:py-24">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">Cluster Management</h3>
                    <p className="mt-2 text-muted-foreground">
                        Efficiently manage multiple clusters and business units with our
                        hierarchical management system.
                    </p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">Report Distribution</h3>
                    <p className="mt-2 text-muted-foreground">
                        Streamline report creation and distribution across your organization
                        with customizable templates.
                    </p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">Access Control</h3>
                    <p className="mt-2 text-muted-foreground">
                        Secure and granular access control with role-based permissions at
                        every level.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="border-t bg-muted/50">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">100+</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Enterprise Customers
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">1000+</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Business Units
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">50M+</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Reports Generated
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">99.9%</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Platform Uptime
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t py-12">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            © 2024 Carmen Platform. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomeComponent
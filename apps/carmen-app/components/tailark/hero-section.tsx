"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, CirclePlay } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function HeroSection() {
    const t = useTranslations('HomePage');
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main id='#home' className="overflow-hidden">
            <section className="bg-linear-to-b to-muted from-background">
                <div className="relative py-36">
                    <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
                        <div className="md:w-1/2">
                            <div>
                                <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl"> {t('hero.title')}</h1>
                                <p className="text-muted-foreground my-8 max-w-2xl text-balance text-xl">
                                    {t('hero.description')}
                                </p>

                                <div className="flex items-center gap-3">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="pr-4.5">
                                        <Link href="#link">
                                            <span className="text-nowrap">
                                                {t('hero.requestDemo')}
                                            </span>
                                            <ChevronRight className="opacity-50" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="pl-5">
                                        <Link href="#link">
                                            <CirclePlay className="fill-primary/25 stroke-primary" />
                                            <span className="text-nowrap">Watch video</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-10">
                                <p className="text-muted-foreground">Trusted by hotel at :</p>
                                <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                                    <div className="flex">
                                        Dusit Thani
                                    </div>
                                    <div className="flex">
                                        Four Season
                                    </div>
                                    <div className="flex">
                                        Marriott
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                        <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                            <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                                {mounted && (
                                    <Image
                                        src={resolvedTheme === 'dark' ? '/images/hero-img-dark.png' : '/images/hero-img-light.png'}
                                        alt="app screen"
                                        width="2880"
                                        height="1842"
                                        className="object-top-left size-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
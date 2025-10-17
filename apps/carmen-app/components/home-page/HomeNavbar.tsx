"use client";

import { cn } from "@/lib/utils";
import { Hotel, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import { Button } from "../ui/button";
import { SwitchTheme } from "../SwitchTheme";

export default function HomeNavbar() {
    const t = useTranslations('HomePage');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        // Only handle anchor links (those starting with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (isMenuOpen) {
                    setIsMenuOpen(false);
                }
            }
        }
    };

    const navItems = [
        { name: t('navbar.home'), href: '#home' },
        { name: t('navbar.features'), href: '#features' },
        { name: t('navbar.testimonials'), href: '#testimonials' },
        { name: t('navbar.contact'), href: '#contact' },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <Link
                    href="#home"
                    className="flex items-center gap-2 text-foreground"
                    onClick={(e) => handleSmoothScroll(e, '#home')}
                >
                    <Hotel className="h-7 w-7 text-blue-600" />
                    <span className="text-xl font-medium tracking-tight">Carmen</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
                            onClick={(e) => handleSmoothScroll(e, item.href)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button asChild>
                        <Link href="/sign-in">
                            {t('navbar.signIn')}
                        </Link>
                    </Button>
                    <Link
                        href="#demo"
                        className="bg-primary text-primary-foreground px-5 py-2 rounded-md hover:bg-primary/90 transition-all duration-300 text-sm font-medium"
                        onClick={(e) => handleSmoothScroll(e, '#demo')}
                    >
                        {t('navbar.getDemo')}
                    </Link>
                    <LanguageSwitcher />
                    <SwitchTheme />
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-foreground focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md py-4 border-t border-border animate-fade-in">
                    <nav className="container mx-auto px-4 flex flex-col gap-4">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-foreground hover:text-primary py-2 transition-colors duration-200 text-sm font-medium"
                                onClick={(e) => handleSmoothScroll(e, item.href)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <a
                            href="#demo"
                            className="bg-primary text-primary-foreground px-5 py-2 rounded-md hover:bg-primary/90 transition-all duration-300 text-sm font-medium text-center mt-2"
                            onClick={(e) => handleSmoothScroll(e, '#demo')}
                        >
                            {t('navbar.getDemo')}
                        </a>
                    </nav>
                </div>
            )}
        </header>
    )
}

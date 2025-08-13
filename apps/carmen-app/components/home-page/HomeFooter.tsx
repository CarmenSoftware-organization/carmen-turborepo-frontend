import { Hotel, X as TwitterX, Linkedin, Instagram, Facebook, Github } from 'lucide-react';
import Link from 'next/link';

export default function HomeFooter() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Product",
            links: [
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#" },
                { name: "Case Studies", href: "#" },
                { name: "Reviews", href: "#testimonials" },
                { name: "Updates", href: "#" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "#" },
                { name: "Careers", href: "#" },
                { name: "Press", href: "#" },
                { name: "Partners", href: "#" },
                { name: "Contact", href: "#contact" }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: "Blog", href: "#" },
                { name: "Support", href: "#" },
                { name: "Documentation", href: "#" },
                { name: "API", href: "#" },
                { name: "Community", href: "#" }
            ]
        }
    ];


    return (
        <footer className="bg-muted text-foreground py-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Hotel className="h-7 w-7 text-primary-foreground" />
                            <span className="text-xl font-medium tracking-tight">Carmen</span>
                        </div>
                        <p className="text-primary-foreground/70 mb-6 max-w-md">
                            Elevating hotel management with intuitive, powerful tools designed for hoteliers who care about exceptional guest experiences.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Twitter">
                                <TwitterX className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Instagram">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Facebook">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="GitHub">
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-primary-foreground/60 text-sm mb-4 md:mb-0">
                        &copy; {currentYear} Carmen Hotel Management. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

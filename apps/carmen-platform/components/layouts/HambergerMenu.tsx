"use client"

import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { navigationItems } from "./menuItems";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "../ui/sheet";
import { Button } from "../ui/button";

export default function HambergerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const handleClose = () => {
        setIsOpen(false);
    };

    const isActivePath = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full">
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                    {navigationItems.map((item) => (
                        <SheetClose key={item.href} asChild>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isActivePath(item.href)
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                                onClick={handleClose}
                            >
                                {item.label}
                            </Link>
                        </SheetClose>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type DropdownContextType = {
    open: boolean;
    toggle: () => void;
    close: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

// Root component
interface DropdownRootProps {
    children: React.ReactNode;
    className?: string;
}

function DropdownRoot({ children, className }: DropdownRootProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggle = () => setOpen(!open);
    const close = () => setOpen(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                close();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <DropdownContext.Provider value={{ open, toggle, close }}>
            <div ref={ref} className={cn("relative inline-block text-left", className)}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

// Trigger component
interface DropdownTriggerProps {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
}

function DropdownTrigger({ children, className, asChild = false }: DropdownTriggerProps) {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error("DropdownTrigger must be used within a DropdownRoot");
    }

    const { toggle } = context;

    if (asChild && React.isValidElement(children)) {
        type ElementProps = {
            onClick?: (e: React.MouseEvent) => void;
            className?: string;
        };
        const childProps = children.props as ElementProps;

        return React.cloneElement(children, {
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                toggle();
                if (childProps.onClick) {
                    childProps.onClick(e);
                }
            },
            className: cn(childProps.className || '', className || '')
        } as React.HTMLAttributes<HTMLElement>);
    }

    return (
        <button
            type="button"
            onClick={toggle}
            className={cn(
                "cursor-pointer inline-flex justify-center items-center w-full p-2 text-xs font-medium",
                className
            )}
        >
            {children}
        </button>
    );
}

// Content component
interface DropdownContentProps {
    children: React.ReactNode;
    className?: string;
    align?: "start" | "end" | "center";
    sideOffset?: number;
}

function DropdownContent({
    children,
    className,
    align = "end",
    sideOffset = 4,
}: DropdownContentProps) {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error("DropdownContent must be used within a DropdownRoot");
    }

    const { open } = context;

    if (!open) return null;

    const alignmentClasses = {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
    };

    return (
        <div
            className={cn(
                "bg-background absolute z-10 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-zinc-700 origin-top-right",
                "transform transition-all duration-200 ease-out",
                "animate-in fade-in-0 zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                alignmentClasses[align],
                `top-[calc(100%+${sideOffset}px)]`,
                className
            )}
        >
            <div className="py-1">{children}</div>
        </div>
    );
}

// Item component
interface DropdownItemProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    destructive?: boolean;
}

function DropdownItem({
    children,
    className,
    onClick,
    disabled = false,
    destructive = false,
}: DropdownItemProps) {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error("DropdownItem must be used within a DropdownRoot");
    }

    const { close } = context;

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
        close();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (onClick) onClick();
            close();
        }
    };

    return (
        <div
            role="menuitem"
            tabIndex={disabled ? -1 : 0}
            className={cn(
                "w-full text-left px-4 py-2 text-sm cursor-pointer",
                disabled
                    ? "text-gray-400 dark:text-zinc-500 cursor-not-allowed"
                    : destructive
                        ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                        : "text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700",
                "focus:outline-none focus:bg-gray-100 dark:focus:bg-zinc-700 transition-colors",
                className
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-disabled={disabled}
        >
            {children}
        </div>
    );
}

// Separator component
interface DropdownSeparatorProps {
    className?: string;
}

function DropdownSeparator({ className }: DropdownSeparatorProps) {
    return <div className={cn("h-px my-1 bg-gray-200 dark:bg-zinc-700", className)} />;
}

// Label component
interface DropdownLabelProps {
    children: React.ReactNode;
    className?: string;
}

function DropdownLabel({ children, className }: DropdownLabelProps) {
    return (
        <div
            className={cn(
                "px-4 py-2 text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider",
                className
            )}
        >
            {children}
        </div>
    );
}

// Export all components as a named export
export const DropdownMenu = {
    Root: DropdownRoot,
    Trigger: DropdownTrigger,
    Content: DropdownContent,
    Item: DropdownItem,
    Separator: DropdownSeparator,
    Label: DropdownLabel,
}; 
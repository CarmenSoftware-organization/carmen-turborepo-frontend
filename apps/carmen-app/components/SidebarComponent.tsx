'use client';

import { useState, KeyboardEvent, useMemo, Suspense, Component, ReactNode } from 'react';
import { moduleItems } from "@/constants/modules-list";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import { AlertCircle, ChevronRight, PanelLeftClose } from "lucide-react";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { MotionDiv, AnimatePresence } from './framer-motion/MotionWrapper';
import { Skeleton } from './ui/skeleton';
import "@/styles/layout.css";

type MenuIcon = React.ComponentType<{ className?: string }>;

interface MenuItem {
    labelKey: string;
    href: string;
    children?: MenuItem[];
    icon?: MenuIcon;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Sidebar Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-div">
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm">Error loading menu</span>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const SidebarLoading = () => (
    <nav className="sidebar-wrapper">
        <div>
            <Skeleton className="h-8 rounded mb-2" />
            <Skeleton className="h-4 rounded w-3/4" />
        </div>

        <div className="p-4 border-b">
            <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 rounded w-1/2" />
            </div>
        </div>

        <div className="mt-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`loading-${i}`} className="h-8 rounded" />
            ))}
        </div>
    </nav>
);

const SidebarContent = () => {
    const t = useTranslations('Modules');
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
    const [isCollapsed, setIsCollapsed] = useState(false); // เริ่มต้นในสถานะปกติ (ไม่ย่อ)
    const [isHovered, setIsHovered] = useState(false);

    const pathWithoutLocale = useMemo(() => {
        return pathname.split('/').slice(2).join('/');
    }, [pathname]);

    const activeModuleData = useMemo(() => {
        return moduleItems.find(module =>
            ('/' + pathWithoutLocale).startsWith(module.href) && module.href !== "/"
        );
    }, [pathWithoutLocale]);

    const moduleKey = useMemo(() => {
        return activeModuleData?.labelKey.split('.').pop() ?? '';
    }, [activeModuleData?.labelKey]);

    const isPathActive = useMemo(() => {
        return (href: string) => {
            const fullItemPath = '/' + pathWithoutLocale;
            return fullItemPath === href || fullItemPath.startsWith(href + '/');
        };
    }, [pathWithoutLocale]);

    if (!activeModuleData) {
        return null;
    }

    const Icon = activeModuleData.icon;

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const isActuallyCollapsed = isCollapsed && !isHovered;

    const toggleMenu = (key: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleKeyDown = (
        event: KeyboardEvent<Element>,
        key: string,
        hasChildren: boolean
    ) => {
        if (hasChildren && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggleMenu(key);
        }
    };

    const renderSubMenu = (items: MenuItem[], level = 0) => {
        return items.map((item) => {
            const segments = item.labelKey.split('.');
            const section = segments[1];
            const subItem = segments.slice(2).join('.');

            const isActive = isPathActive(item.href);
            const hasChildren = Boolean(item.children && item.children.length > 0);

            return (
                <MotionDiv key={item.labelKey} className="relative">
                    {renderMenuItem(item, section, subItem, level, isActive, hasChildren)}

                    <AnimatePresence>
                        {hasChildren && openMenus[item.href] && !isActuallyCollapsed && (
                            <MotionDiv
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                {renderSubMenu(item.children!, level + 1)}
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </MotionDiv>
            );
        });
    };

    const renderMenuItem = (item: MenuItem, section: string, subItem: string, level: number, isActive: boolean, hasChildren: boolean) => {
        if (hasChildren) {
            return renderParentMenuItem(item, section, subItem, level, isActive);
        }
        return renderLeafMenuItem(item, section, subItem, level, isActive);
    };

    const renderParentMenuItem = (item: MenuItem, section: string, subItem: string, level: number, isActive: boolean) => (
        <MotionDiv
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <button
                type="button"
                aria-expanded={openMenus[item.href] || false}
                aria-haspopup={true}
                className={getMenuItemClassName(level, isActive, openMenus[item.href])}
                onClick={() => toggleMenu(item.href)}
                onKeyDown={(e) => handleKeyDown(e, item.href, true)}
                title={isActuallyCollapsed ? t(`${section}.${subItem}`) : undefined}
            >
                <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {!isActuallyCollapsed && <span className="font-medium text-muted-foreground">{t(`${section}.${subItem}`)}</span>}
                </div>
                {!isActuallyCollapsed && renderChevron(level, openMenus[item.href])}
            </button>
        </MotionDiv>
    );

    const renderLeafMenuItem = (item: MenuItem, section: string, subItem: string, level: number, isActive: boolean) => (
        <MotionDiv
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Link
                href={item.href}
                className={cn(
                    'fxb-c link-item',
                    !isActive && 'link-item-inactive',
                    isActive ? 'item-active' : 'item-hover',
                    level > 0 && !isActuallyCollapsed && `pl-${4 * (level + 1)}`,
                    isActuallyCollapsed && 'justify-center'
                )}
                title={isActuallyCollapsed ? t(`${section}.${subItem}`) : undefined}
            >
                <div
                    className={cn(
                        'flex items-center',
                        isActuallyCollapsed ? 'justify-center' : 'gap-2'
                    )}
                >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {!isActuallyCollapsed && (
                        <span className="font-medium">
                            {t(`${section}.${subItem}`)}
                        </span>
                    )}
                </div>
            </Link>
        </MotionDiv>
    );

    const renderChevron = (level: number, isOpen: boolean) => {
        if (level === 0) {
            return (
                <MotionDiv
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <ChevronRight
                        size={16}
                        aria-hidden="true"
                    />
                </MotionDiv>
            );
        }
        return null;
    };

    const getMenuItemClassName = (
        level: number,
        isActive: boolean,
        isOpen: boolean
    ) => {
        return cn(
            'fxb-c menu-item',
            isActive ? 'item-active' : 'menu-item-hover',
            level > 0 && !isActuallyCollapsed && `pl-${4 * (level + 1)}`,
            isOpen && !isActuallyCollapsed && 'bg-muted',
            isActuallyCollapsed && 'justify-center'
        );
    };

    return (
        <MotionDiv
            animate={{ width: isActuallyCollapsed ? 64 : 250 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                'motion-wrapper'
            )}
            aria-label="Sidebar Navigation"
        >
            {!isActuallyCollapsed && (
                <Button
                    variant={'ghost'}
                    onClick={handleToggleCollapse}
                    className={cn(
                        "sidebar-toggle-button",
                        !isActuallyCollapsed ? 'bg-muted' : 'bg-background'
                    )}
                    aria-label={isActuallyCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
                </Button>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <MotionDiv
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "sidebar-header",
                        isActuallyCollapsed && 'justify-center'
                    )}
                >
                    {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                    {!isActuallyCollapsed &&
                        <h2 className="module-name">{t(moduleKey)}</h2>
                    }


                </MotionDiv>
                {activeModuleData.children && renderSubMenu(activeModuleData.children)}
            </div>
        </MotionDiv>
    );
};

export default function SidebarComponent() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<SidebarLoading />}>
                <SidebarContent />
            </Suspense>
        </ErrorBoundary>
    );
}
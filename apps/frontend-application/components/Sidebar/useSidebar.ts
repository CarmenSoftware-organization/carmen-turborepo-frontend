import { useState, useEffect } from 'react';
import { usePathname } from '@/lib/i18n';
import useResponsive from '@/hooks/useResponsive';

export const useSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const pathname = usePathname();
    const { isDesktop } = useResponsive();

    useEffect(() => {
        if (isDesktop) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [isDesktop]);

    useEffect(() => {
        if (!isDesktop) {
            setIsSidebarOpen(false);
        }
    }, [pathname, isDesktop]);

    const toggleExpand = (title: string) => {
        setExpandedItems((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title]
        );
    };

    const toggleSubItem = (path: string) => {
        setExpandedItems((prev) =>
            prev.includes(path)
                ? prev.filter((item) => item !== path)
                : [...prev, path]
        );
    };

    return {
        isSidebarOpen,
        setIsSidebarOpen,
        expandedItems,
        setExpandedItems,
        isExpanded,
        setIsExpanded,
        isPinned,
        setIsPinned,
        pathname,
        toggleExpand,
        toggleSubItem
    };
};
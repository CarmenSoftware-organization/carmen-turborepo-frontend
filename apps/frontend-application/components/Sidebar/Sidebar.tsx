import React from 'react'
import { useSidebar } from './useSidebar';
import { menuItems } from '@/lib/util/menuItems';
import SidebarLogo from './SidebarLogo';
import { ScrollArea } from '../ui/scroll-area';
import SidebarMenuItem from './SidebarMenuItem';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';

const Sidebar = () => {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        expandedItems,
        isExpanded,
        setIsExpanded,
        isPinned,
        setIsPinned,
        pathname,
        toggleExpand,
        toggleSubItem
    } = useSidebar();

    const { isDesktop } = useResponsive();

    const handleMouseEnter = () => {
        if (!isPinned) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isPinned) {
            setIsExpanded(false);
        }
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
        setIsExpanded(!isPinned);
    };

    const onClose = () => {
        setIsSidebarOpen(false);
    };

    return (
			<div
				className="top-1 z-50 flex-col gap-4 relative bg-background"
				data-id="sidebar-container"
			>
				{isSidebarOpen && !isDesktop && (
					<div
						className="fixed md:sticky inset-0 z-40"
						onClick={onClose}
						data-id="sidebar-overlay"
					/>
				)}

				<aside
					className={cn(
						'fixed left-0 h-full z-50 bg-[var(--cm-sidebar)] border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out',
						isSidebarOpen || isDesktop
							? 'translate-x-0 md:sticky'
							: '-translate-x-full',
						isExpanded ? 'w-[280px]' : 'w-[70px]'
					)}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					data-id="sidebar-container"
				>
					<SidebarLogo
						isExpanded={isExpanded}
						isPinned={isPinned}
						togglePin={togglePin}
						data-id="sidebar-logo"
					/>

					<ScrollArea className="h-full" data-id="sidebar-scroll-area">
						<div
							className="space-y-1 py-4"
							data-id="sidebar-menu-items-container"
						>
							{menuItems.map((item) => (
								<SidebarMenuItem
									key={item.title}
									item={item}
									isExpanded={isExpanded}
									expandedItems={expandedItems}
									pathname={pathname}
									onToggleExpand={toggleExpand}
									onToggleSubItem={toggleSubItem}
									onClose={onClose}
									data-id="sidebar-menu-item"
								/>
							))}
						</div>
					</ScrollArea>
				</aside>
			</div>
		);
}

export default Sidebar
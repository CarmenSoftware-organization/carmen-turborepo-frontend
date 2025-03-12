import React from 'react'
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import SidebarSubItems from './SidebarSubItems';
import { MenuItem } from '@/lib/types';

interface Props {
    item: MenuItem;
    isExpanded: boolean;
    expandedItems: string[];
    pathname: string;
    onToggleExpand: (title: string, path?: string) => void;
    onToggleSubItem: (path: string) => void;
    onClose: () => void;
}

const SidebarMenuItem: React.FC<Props> = ({
    item,
    isExpanded,
    expandedItems,
    pathname,
    onToggleExpand,
    onToggleSubItem,
    onClose,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
    const isItemExpanded = expandedItems.includes(item.title);
    return (
			<div className="px-2" data-id="sidebar-menu-item-container">
				<Button
					variant="ghost"
					className="w-full flex justify-between font-semibold text-xs"
					onClick={() => onToggleExpand(item.title, item.path)}
					data-id="sidebar-menu-item-button"
				>
					<span
						className="flex items-center justify-between"
						data-id="sidebar-menu-item-title-container"
					>
						<IconComponent
							className="h-5 w-5"
							data-id="sidebar-menu-item-icon"
						/>
						{isExpanded && (
							<span className="ml-2" data-id="sidebar-menu-item-title">
								{item.title}
							</span>
						)}
					</span>
					{isExpanded &&
						item.subItems &&
						item.subItems.length > 0 &&
						(isItemExpanded ? (
							<LucideIcons.ChevronDown
								className="h-4 w-4"
								data-id="sidebar-menu-item-chevron-down"
							/>
						) : (
							<LucideIcons.ChevronRight
								className="h-4 w-4"
								data-id="sidebar-menu-item-chevron-right"
							/>
						))}
				</Button>

				{isExpanded &&
					item.subItems &&
					item.subItems.length > 0 &&
					isItemExpanded && (
						<SidebarSubItems
							data-id="sidebar-menu-item-sub-items"
							subItems={item.subItems}
							pathname={pathname}
							onClose={onClose}
							expandedItems={expandedItems}
							onToggleExpand={onToggleSubItem}
						/>
					)}
			</div>
		);
}

export default SidebarMenuItem
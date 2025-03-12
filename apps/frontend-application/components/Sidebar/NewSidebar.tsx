import React, { useEffect, useMemo, useState } from 'react';
import { useSidebar } from './useSidebar';
import { menuItems } from '@/lib/util/menuItems';
import SidebarLogo from './SidebarLogo';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';
import * as LucideIcons from 'lucide-react';
import { Link } from '@/lib/i18n';
import { Button } from '../ui/button';
import { Pin, Star } from 'lucide-react';
import { Separator } from '../ui/separator';
import { FavMenuItem } from '@/dtos/favorite-menu.dto';

export type LucideIconName = keyof typeof LucideIcons;
interface DynamicIconProps {
    iconName: LucideIconName;
}
interface SubItem {
    path: string;
    name: string;
}

interface MenuItem {
    path: string;
    title: string;
    icon: LucideIconName;
    subItems?: SubItem[];
}

const NewSidebar = () => {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        isExpanded,
        setIsExpanded,
        isPinned,
        setIsPinned,
        pathname,
    } = useSidebar();

    const { isDesktop } = useResponsive();
    const [favoriteMenu, setFavoriteMenu] = useState<FavMenuItem[]>([]);
    useEffect(() => {
        const fetchFavoriteMenu = async () => {
            try {
                const res = await fetch("/api/favorite-menu");
                const data = await res.json();
                setFavoriteMenu(data.data);
            } catch (error) {
                console.error("Failed to fetch favorite menu:", error);
            }
        };

        fetchFavoriteMenu();
    }, []);

    const activeMenuItem = useMemo(() => {
        return menuItems.find(item =>
            pathname.startsWith(item.path) ||
            item.subItems?.some(subItem => pathname.startsWith(subItem.path))
        );
    }, [pathname]);

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

    const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName }) => {
			const IconComponent = LucideIcons[
				iconName as LucideIconName
			] as React.ElementType;
			return IconComponent ? (
				<IconComponent className="ml-2 h-4 w-4 transition-all duration-300" />
			) : null;
		};

		const renderSubItems = (item: MenuItem) => {
			return item.subItems?.map((subItem: SubItem) => {
				const isActive = pathname === subItem.path;
				return (
					<div
						className={cn(
							'ml-2 text-xs rounded-lg whitespace-nowrap flex justify-between items-center overflow-hidden group'
						)}
						key={subItem.path}
					>
						<Link
							className={cn(
								'w-full rounded-lg',
								`${isExpanded ? 'p-2' : ''}`,
								isActive
									? 'font-medium bg-primary text-background'
									: 'hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]'
							)}
							href={subItem.path}
						>
							{subItem.name}
						</Link>
						<Button
							variant="ghost"
							size="sm"
							data-id="menu-item-pin-button"
							onClick={() => {
								alert(subItem.path);
							}}
							className="opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Pin menu item"
						>
							<Pin
								className="h-4 w-4 transition-all duration-300"
								data-id="pin-menu-item-icon"
							/>
						</Button>
					</div>
				);
			});
		};

		return (
			<div
				className="top-1 z-50 flex-col gap-4 relative bg-background"
				data-id="sidebar-container"
			>
				{isSidebarOpen && !isDesktop && (
					<div
						className="fixed md:sticky inset-0 z-40"
						onMouseDown={onClose}
						data-id="sidebar-overlay"
					/>
				)}

				<aside
					className={cn(
						'fixed left-0 h-full z-50 bg-[var(--cm-sidebar)] border-r transition-all duration-700 ease-in-out',
						isSidebarOpen || isDesktop
							? 'translate-x-0 md:sticky'
							: '-translate-x-full',
						isExpanded ? 'w-[220px]' : 'w-[40px]'
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
						className={isExpanded ? 'p-3' : ''}
					/>

					{activeMenuItem && (
						<div className="py-2 overflow-hidden">
							<div
								className={cn(
									'flex items-center transition-all duration-300',
									isExpanded ? 'justify-start' : 'justify-center'
								)}
							>
								<DynamicIcon iconName={activeMenuItem.icon} />
								<div
									className={cn(
										'ml-3 font-medium transition-all duration-300',
										isExpanded
											? 'opacity-100 delay-200'
											: 'opacity-0 pointer-events-none w-0'
									)}
								>
									{activeMenuItem.title}
								</div>
							</div>
							<div
								className={cn(
									'transition-all duration-300',
									isExpanded
										? 'opacity-100 delay-200'
										: 'opacity-0 pointer-events-none h-0'
								)}
							>
								{isExpanded && renderSubItems(activeMenuItem)}
							</div>
						</div>
					)}

					<Separator />

					<div className="mt-2">
						<div
							className={cn(
								'flex items-center transition-all duration-300',
								isExpanded ? 'justify-start' : 'justify-center'
							)}
						>
							<Star className="ml-2 h-4 w-4 transition-all duration-300" />
							<span
								className={cn(
									'ml-3 font-medium transition-all duration-300',
									isExpanded
										? 'opacity-100 delay-200'
										: 'opacity-0 pointer-events-none w-0'
								)}
							>
								Favorite Menu
							</span>
						</div>
						{favoriteMenu.length > 0 && (
							<div
								className={cn(
									'text-xs rounded-lg pt-2 transition-all duration-300',
									isExpanded
										? 'opacity-100 delay-200'
										: 'opacity-0 pointer-events-none h-0'
								)}
							>
								{favoriteMenu.map((item: FavMenuItem, index: number) => (
									<div
										className="text-xs rounded-lg whitespace-nowrap flex justify-between items-center overflow-hidden group"
										key={index}
									>
										<Link
											href={item.path}
											className={cn(
												'flex-1 rounded-lg',
												`${isExpanded ? 'p-2' : ''}`,
												`${isExpanded ? 'hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]' : ''}`
											)}
										>
											<span
												className={cn(
													'ml-2 text-xs transition-all duration-300',
													isExpanded
														? 'opacity-100 delay-200'
														: 'opacity-0 pointer-events-none w-0'
												)}
											>
												{item.title}
											</span>
										</Link>
										<Button
											variant="ghost"
											size="sm"
											data-id="favorite-menu-pin-button"
											className={cn(
												'transition-all duration-300',
												isExpanded
													? 'opacity-0 group-hover:opacity-100'
													: 'hidden'
											)}
											aria-label="favorite pin menu item"
										>
											<Pin
												className="h-4 w-4 transition-all duration-300"
												data-id="favorite-menu-item-icon"
											/>
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</aside>
			</div>
		);
}

export default NewSidebar;
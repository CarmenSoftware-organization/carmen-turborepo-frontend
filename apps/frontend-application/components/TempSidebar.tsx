'use client';

import React, { useEffect, useState } from 'react';
import { Link, usePathname, useRouter } from '@/lib/i18n';
import { menuItems } from '@/lib/util/menuItems';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as LucideIcons from 'lucide-react';

const Sidebar = () => {
	const router = useRouter();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLargeScreen, setIsLargeScreen] = useState(false);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isPinned, setIsPinned] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleResize = () => {
			const largeScreen = window.innerWidth >= 1024;
			setIsLargeScreen(largeScreen);
			setIsSidebarOpen(largeScreen);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!isLargeScreen) {
			setIsSidebarOpen(false);
		}
	}, [pathname, isLargeScreen]);

	const toggleExpand = (title: string, path?: string) => {
		const menuItem = menuItems.find((item) => item.title === title);
		if (!menuItem?.subItems || menuItem.subItems.length === 0) {
			router.push(path || '/');
		} else {
			setExpandedItems((prev) =>
				prev.includes(title)
					? prev.filter((item) => item !== title)
					: [...prev, title]
			);
		}
	};

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
		<>
			<div className="top-1 z-50 flex-col gap-4 relative bg-background">
				{isSidebarOpen && !isLargeScreen && (
					<div className="fixed md:sticky inset-0 z-40" onClick={onClose} />
				)}

				<aside
					className={cn(
						'fixed left-0 h-full z-50 bg-[var(--cm-sidebar)] border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out',
						isSidebarOpen || isLargeScreen
							? 'translate-x-0 md:sticky'
							: '-translate-x-full',
						isExpanded ? 'w-[280px]' : 'w-[64px]'
					)}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="px-4 pt-4 w-full flex items-center justify-between">
						<Link href="/" className="all-center">
							{isExpanded ? (
								<div className="ml-2">
									<span className="text-2xl font-bold block tracking-wide">
										CARMEN
									</span>
									<span className="text-sm block text-gray-500 dark:text-gray-200 tracking-wide">
										Hospitality Supply Chain
									</span>
								</div>
							) : (
								<div className="bg-blue-900 h-8 w-8 rounded-full all-center">
									{isExpanded && <span className="text-xl font-bold"></span>}
								</div>
							)}
						</Link>
						{isExpanded && (
							<Button variant="ghost" size="icon" onClick={togglePin}>
								<LucideIcons.Pin
									className={cn('h-5 w-5', isPinned && 'text-blue-500')}
								/>
							</Button>
						)}
					</div>

					<ScrollArea className="h-full">
						<div className="space-y-1 py-4">
							{menuItems.map((item) => {
								const IconComponent =
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(LucideIcons as any)[item.icon] || LucideIcons.Circle;
								return (
									<div key={item.title} className="px-2">
										<Button
											variant="ghost"
											className={cn(
												'w-full flex justify-between font-semibold text-gray-700 dark:text-gray-200 tracking-wide text-xs   '
											)}
											onClick={() => toggleExpand(item.title, item.path)}
										>
											<span className="flex items-center justify-between">
												<IconComponent className="h-5 w-5" />
												{isExpanded && (
													<span className="ml-2">{item.title}</span>
												)}
											</span>
											{isExpanded &&
												item.subItems &&
												item.subItems.length > 0 &&
												(expandedItems.includes(item.title) ? (
													<LucideIcons.ChevronDown className="h-4 w-4" />
												) : (
													<LucideIcons.ChevronRight className="h-4 w-4" />
												))}
										</Button>

										{isExpanded &&
											item.subItems &&
											item.subItems.length > 0 &&
											expandedItems.includes(item.title) && (
												<div className="mx-4 mt-2">
													{item.subItems.map((subItem) => (
														<Button
															key={subItem.name}
															variant="ghost"
															asChild
															className={cn(
																'w-full justify-start text-sm text-foreground dark:text-gray-100 tracking-wide',
																pathname === subItem.path
																	? 'bg-primary text-white '
																	: ''
															)}
															// className={cn("w-full justify-start font-thin")}
															onClick={() => !isLargeScreen && onClose()}
														>
															<Link
																href={subItem.path}
																className="text-blue-950 dark:text-gray-200 no-underline text-xs"
															>
																{subItem.name}
															</Link>
														</Button>
													))}
												</div>
											)}
									</div>
								);
							})}
						</div>
					</ScrollArea>
				</aside>
			</div>
		</>
	);
};

export default Sidebar;

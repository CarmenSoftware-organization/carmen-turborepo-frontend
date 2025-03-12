import React from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n';
import * as LucideIcons from "lucide-react";
import { SubMenuItem } from '@/lib/types';
import useResponsive from '@/hooks/useResponsive';
interface Props {
    subItems: SubMenuItem[];
    pathname: string;
    onClose: () => void;
    level?: number;
    expandedItems: string[];
    onToggleExpand: (path: string) => void;
}

const SidebarSubItems: React.FC<Props> = ({
    subItems,
    pathname,
    onClose,
    level = 0,
    expandedItems,
    onToggleExpand
}) => {
    const paddingLeft = `${(level + 1) * 1}rem`;
    const { isDesktop } = useResponsive();
    return (
			<div className="mt-2" data-id="sidebar-sub-items-container">
				{subItems.map((subItem) => {
					const hasNestedItems =
						subItem.subItems && subItem.subItems.length > 0;
					const isExpanded = expandedItems.includes(subItem.path);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const IconComponent = subItem.icon
						? // eslint-disable-next-line @typescript-eslint/no-explicit-any
							(LucideIcons as any)[subItem.icon]
						: null;

					return (
						<div
							key={subItem.path}
							className="px-3"
							data-id="sidebar-sub-item-container"
						>
							<Button
								variant="ghost"
								asChild={!hasNestedItems}
								className={cn(
									'w-full justify-start text-xs text-foreground tracking-wide h-8',
									pathname === subItem.path ? 'bg-primary text-white' : '',
									hasNestedItems ? 'flex justify-between' : ''
								)}
								onClick={() => {
									if (hasNestedItems) {
										onToggleExpand(subItem.path);
									} else if (!isDesktop) {
										onClose();
									}
								}}
								style={{ paddingLeft }}
								data-id="sidebar-sub-item-button"
							>
								{hasNestedItems ? (
									<div
										className="flex items-center justify-between w-full"
										data-id="sidebar-sub-item-button-nested-items"
									>
										<div
											className="flex items-center gap-2"
											data-id="sidebar-sub-item-button-nested-items-icon"
										>
											{IconComponent && (
												<IconComponent
													className="h-4 w-4"
													data-id="sidebar-sub-item-button-nested-items-icon-component"
												/>
											)}
											<span
												className="text-xs"
												data-id="sidebar-sub-item-button-nested-items-name"
											>
												{subItem.name}
											</span>
										</div>
										{isExpanded ? (
											<LucideIcons.ChevronDown
												className="h-4 w-4"
												data-id="sidebar-sub-item-button-nested-items-chevron-down"
											/>
										) : (
											<LucideIcons.ChevronRight
												className="h-4 w-4"
												data-id="sidebar-sub-item-button-nested-items-chevron-right"
											/>
										)}
									</div>
								) : (
									<Link
										href={subItem.path}
										className="no-underline text-xs flex items-center gap-2"
										data-id="sidebar-sub-item-button-nested-items-link"
									>
										{IconComponent && (
											<IconComponent
												className="h-4 w-4"
												data-id="sidebar-sub-item-button-nested-items-link-icon"
											/>
										)}
										{subItem.name}
									</Link>
								)}
							</Button>

							{subItem.subItems && hasNestedItems && isExpanded && (
								<SidebarSubItems
									subItems={subItem.subItems}
									pathname={pathname}
									onClose={onClose}
									level={level + 1}
									expandedItems={expandedItems}
									onToggleExpand={onToggleExpand}
									data-id="sidebar-sub-item-sub-items"
								/>
							)}
						</div>
					);
				})}
			</div>
		);
}

export default SidebarSubItems
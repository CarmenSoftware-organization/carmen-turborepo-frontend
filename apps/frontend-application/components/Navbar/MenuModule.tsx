import React, { useState } from 'react';
import {
	LayoutDashboard,
	ShoppingCart,
	Package,
	Users,
	MonitorCog,
	Store,
	CalendarClock,
	Factory,
	BarChart2,
	DollarSign,
	Settings,
	HelpCircle,
	LockKeyhole,
	Grip,
} from 'lucide-react';
import { menuItems } from '@/lib/util/menuItems';
import { Link } from '@/lib/i18n';
import { Card, CardContent } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
{
	LayoutDashboard,
	ShoppingCart,
	Package,
	Users,
	MonitorCog,
	Store,
	CalendarClock,
	Factory,
	BarChart2,
	DollarSign,
	Settings,
	HelpCircle,
};

const MenuModule = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleMenuClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Popover
			open={isOpen}
			onOpenChange={setIsOpen}
			data-id="menu-module-popover"
		>
			<PopoverTrigger asChild data-id="menu-module-popover-trigger">
				<Grip
					className="h-8 w-8 mr-2 cursor-pointer hover:bg-gray-100 p-1 rounded-md"
					role="button"
					aria-label="Open menu"
					tabIndex={0}
					onClick={handleMenuClick}
					data-id="menu-module-popover-trigger-grip"
				/>
			</PopoverTrigger>
			<PopoverContent
				className="overflow-y-auto w-[60vw] md:w-[400px] px-4 py-12 mx-8"
				data-id="menu-module-popover-content"
			>
				<div
					className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full"
					data-id="menu-module-popover-content-grid"
				>
					{menuItems.map((item, index) => {
						const IconComponent = iconMap[item.icon];
						return (
							<div key={index} className="relative">
								<Link
									href={item.path}
									onClick={handleMenuClick}
									data-id={`menu-module-popover-content-grid-item-${index}`}
								>
									<Card
										data-id="menu-module-card"
										className="w-14 md:w-20 aspect-square flex flex-col items-center justify-center hover:bg-slate-50 relative border rounded-md shadow-sm"
									>
										<div
											className="absolute top-0 right-1 flex gap-1"
											data-id="menu-module-card-lock-keyhole-and-shopping-cart-container"
										>
											<LockKeyhole className="w-2 md:w-4 h-2 md:h-4 text-gray-500 hover:text-gray-700" />
											<ShoppingCart className="w-2 md:w-4 h-2 md:h-4 text-gray-500 hover:text-gray-700" />
										</div>
										<CardContent
											className="flex flex-col items-center justify-center gap-2 p-2"
											data-id="menu-module-card-content"
										>
											{IconComponent && (
												<IconComponent
													className="w-8 h-8"
													data-id="menu-module-card-content-icon"
												/>
											)}
										</CardContent>
									</Card>
									<p
										className="mt-2 font-medium text-[8px] md:text-xs text-ellipsis overflow-clip"
										data-id="menu-module-card-title"
									>
										{item.title}
									</p>
								</Link>
							</div>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default MenuModule;

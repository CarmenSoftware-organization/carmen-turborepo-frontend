import React from 'react';
import { Button } from '../ui/button';
import { Bell, X } from 'lucide-react';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '../ui-custom/drawer';
import { useRouter } from '@/lib/i18n';

const Notifications = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const router = useRouter();

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
	};

	const onLinkClick = () => {
		setIsOpen(false);
		router.push('/notifications');
	};

	const notificationCount = 12;

	return (
		<Drawer
			open={isOpen}
			onOpenChange={handleOpenChange}
			direction="right"
			data-id="notifications-drawer"
		>
			<DrawerTrigger asChild data-id="notifications-drawer-trigger">
				<Button
					variant="ghost"
					size={'sm'}
					className="relative mr-2"
					aria-label="Open notifications"
					data-id="notifications-drawer-button"
				>
					<Bell size={20} data-id="notifications-drawer-button-bell" />
					{notificationCount > 0 && (
						<span
							className="absolute -top-1 -right-1 bg-red-500 text-white 
							rounded-full text-xs w-5 h-5 flex items-center 
							justify-center"
							data-id="notifications-drawer-button-notification-count"
						>
							{notificationCount > 9 ? '9+' : notificationCount}
						</span>
					)}
				</Button>
			</DrawerTrigger>
			<DrawerContent className="fixed right-0 h-full w-full md:w-1/2 lg:w-1/4">
				<DrawerHeader>
					<DrawerTitle
						className="flex items-center justify-between"
						data-id="notifications-drawer-title"
					>
						Notifications
						<X
							size={20}
							className="md:hidden cursor-pointer"
							onClick={() => handleOpenChange(false)}
							data-id="notifications-drawer-title-x"
						/>
					</DrawerTitle>
					<DrawerDescription data-id="notifications-drawer-description">
						Stay updated with your latest notifications
					</DrawerDescription>
				</DrawerHeader>

				<div
					className="p-4"
					data-id="notifications-drawer-no-new-notifications-container"
				>
					<p className="text-sm text-muted-foreground">No new notifications</p>
				</div>

				<DrawerFooter
					className="fixed bottom-0 right-0"
					data-id="notifications-drawer-footer"
				>
					<Button
						onClick={onLinkClick}
						data-id="notifications-drawer-view-all-notifications-button"
					>
						View all notifications
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default Notifications;

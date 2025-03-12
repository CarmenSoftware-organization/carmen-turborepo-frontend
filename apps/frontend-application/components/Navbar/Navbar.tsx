"use client";

import React, { useEffect, useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n';
import { useAuth } from '@/app/context/AuthContext';
import UserProfile from './UserProfile';
import Notifications from './Notifications';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '../ui-custom/drawer';
import MenuContent from './MenuContent';
import useResponsive from '@/hooks/useResponsive';
import MenuModule from './MenuModule';

const Navbar = () => {
	const { isAuthenticated } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isMobile } = useResponsive();

	useEffect(() => {
		if (!isMobile) {
			setIsMenuOpen(false);
		}
	}, [isMobile]);

	return (
		<header
			className="fixed top-0 left-0 right-0 border-b bg-background z-10"
			data-id="navbar"
		>
			<div className="px-4 py-2 sm:p-[8px]" data-id="navbar-container">
				<div className="flex justify-end h-12" data-id="navbar-content">
					<div className="flex items-center">
						<div className="md:hidden" data-id="navbar-menu-button-container">
							<Button
								variant="ghost"
								size="icon"
								aria-expanded={isMenuOpen}
								aria-controls="mobile-menu"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								data-id="navbar-menu-button"
							>
								<Menu size={20} data-id="navbar-menu-button-menu" />
							</Button>
						</div>

						<div
							className="hidden md:flex items-center"
							data-id="navbar-menu-content-container"
						>
							<MenuContent data-id="navbar-menu-content" />
						</div>
						<Notifications data-id="navbar-notifications" />
						<MenuModule data-id="navbar-menu-module" />
						{/* <MenuDialog /> */}
						{isAuthenticated ? (
							<UserProfile data-id="navbar-user-profile" />
						) : (
							<Button variant="ghost" asChild data-id="navbar-sign-in-button">
								<Link href="/sign-in" data-id="navbar-sign-in-button-link">
									<User data-id="navbar-sign-in-button-user" />
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<Drawer
					open={isMenuOpen}
					onOpenChange={setIsMenuOpen}
					direction="right"
					data-id="navbar-drawer"
				>
					<DrawerContent
						className="h-full w-full"
						aria-labelledby="drawer-title"
						aria-describedby="drawer-description"
						data-id="navbar-drawer-content"
					>
						<DrawerHeader>
							<DrawerTitle id="drawer-title" data-id="navbar-drawer-title">
								Menu
							</DrawerTitle>
							<DrawerDescription
								id="drawer-description"
								data-id="navbar-drawer-description"
							>
								Navigation and Settings
							</DrawerDescription>
						</DrawerHeader>

						<div
							className="flex flex-col md:flex-row gap-4 p-4"
							data-id="navbar-drawer-menu-content-container"
						>
							<MenuContent data-id="navbar-drawer-menu-content" />
						</div>

						<DrawerFooter>
							<Button
								onClick={() => setIsMenuOpen(false)}
								data-id="navbar-drawer-close-button"
							>
								Close
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</header>
	);
};

export default Navbar
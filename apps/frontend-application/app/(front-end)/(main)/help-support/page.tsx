'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const HelpSupportPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'procurement';

	return (
		<SubMenuList pathName={path} data-id="help-support-page-sub-menu-list" />
	);
};

export default HelpSupportPage;

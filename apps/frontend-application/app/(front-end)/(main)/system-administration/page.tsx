'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const SystemAdministrationPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'system-administration';

	return (
		<SubMenuList
			pathName={path}
			data-id="system-administration-page-sub-menu-list"
		/>
	);
};

export default SystemAdministrationPage;

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const InventoryManagementPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'inventory-management';

	return (
		<SubMenuList
			pathName={path}
			data-id="inventory-management-page-sub-menu-list"
		/>
	);
};

export default InventoryManagementPage;

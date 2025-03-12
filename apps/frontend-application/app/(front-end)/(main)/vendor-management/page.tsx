'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const VendorManagementPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'vendor-management';

	return (
		<SubMenuList
			pathName={path}
			data-id="vendor-management-page-sub-menu-list"
		/>
	);
};

export default VendorManagementPage;

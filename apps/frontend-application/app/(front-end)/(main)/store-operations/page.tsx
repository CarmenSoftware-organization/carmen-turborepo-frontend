'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const StoreOperationPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'store-operations';

	return (
		<SubMenuList
			pathName={path}
			data-id="store-operations-page-sub-menu-list"
		/>
	);
};

export default StoreOperationPage;

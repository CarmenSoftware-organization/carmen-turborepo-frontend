'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const OperationPlaningPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'operational-planning';

	return (
		<SubMenuList
			pathName={path}
			data-id="operational-planning-page-sub-menu-list"
		/>
	);
};

export default OperationPlaningPage;

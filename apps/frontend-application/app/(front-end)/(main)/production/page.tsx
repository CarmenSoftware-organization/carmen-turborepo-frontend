'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const ProductionPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'procurement';

	return (
		<SubMenuList pathName={path} data-id="production-page-sub-menu-list" />
	);
};

export default ProductionPage;

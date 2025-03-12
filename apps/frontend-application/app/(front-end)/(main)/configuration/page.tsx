'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const ConfigurationPage = () => {
    const pathname = usePathname();
    const menuItem = menuItems.find((item) => item.path === pathname);
    const path = menuItem?.title || 'configuration';

	return (
		<SubMenuList pathName={path} data-id="configuration-page-sub-menu-list" />
	);
};

export default ConfigurationPage;

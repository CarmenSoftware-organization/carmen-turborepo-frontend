'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '@/lib/util/menuItems';
import SubMenuList from '@/components/SubMenuList';

const ReportingAnalyticsPage = () => {
	const pathname = usePathname();
	const menuItem = menuItems.find((item) => item.path === pathname);
	const path = menuItem?.title || 'reporting-analytics';

	return (
		<SubMenuList
			pathName={path}
			data-id="reporting-analytics-page-sub-menu-list"
		/>
	);
};

export default ReportingAnalyticsPage;

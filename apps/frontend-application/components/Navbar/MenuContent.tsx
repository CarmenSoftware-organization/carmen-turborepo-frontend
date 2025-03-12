'use client';

import React, { memo } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { SwitchTheme } from './SwitchTheme';
import TenantList from './TenantList';
const MenuContent = () => {
	return (
		<>
			<TenantList data-id="menu-content-tenant-list" />
			<div
				className="flex items-center"
				data-id="menu-content-language-switcher-and-switch-theme-container"
			>
				<LanguageSwitcher data-id="menu-content-language-switcher" />
				<SwitchTheme data-id="menu-content-switch-theme" />
			</div>
		</>
	);
};

export default memo(MenuContent);

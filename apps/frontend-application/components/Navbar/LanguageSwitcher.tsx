'use client';

import { AvailableLanguageTag, availableLanguageTags } from '@/paraglide/runtime';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/lib/i18n';

import { Button } from '@/components/ui-custom/button';
import { Globe } from 'lucide-react';
import React from 'react';
import { Route } from 'next';

export default function LanguageSwitcher() {
	const pathname = usePathname() as Route;
	const router = useRouter();

	const labels: Record<AvailableLanguageTag, string> = {
		'en-us': 'English',
		'th-th': 'ไทย',
	};

	const setLanguage = (lang: AvailableLanguageTag) => {
		router.push(pathname, {
			locale: lang,
		});
	};

	return (
		<DropdownMenu data-id="language-switcher-dropdown-menu">
			<DropdownMenuTrigger
				asChild
				data-id="language-switcher-dropdown-menu-trigger"
			>
				<Button
					variant="ghost"
					size={'sm'}
					data-id="language-switcher-dropdown-menu-trigger-button"
				>
					<Globe
						size={20}
						data-id="language-switcher-dropdown-menu-trigger-button-globe"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				data-id="language-switcher-dropdown-menu-content"
			>
				{availableLanguageTags.map((lang) => (
					<DropdownMenuItem
						key={lang}
						onClick={() => setLanguage(lang)}
						className="cursor-pointer"
						data-id={`language-switcher-dropdown-menu-item-${lang}`}
					>
						{labels[lang]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

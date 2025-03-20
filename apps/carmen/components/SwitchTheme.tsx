"use client"

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function SwitchTheme() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, theme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleClick = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
	};

	if (!mounted) return null;

	return (
		<Button
			variant={'ghost'}
			onClick={handleClick}
			data-id="switch-theme-button"
			className="cursor-pointer"
		>
			{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
		</Button>
	);
}

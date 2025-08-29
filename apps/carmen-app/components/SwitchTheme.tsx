"use client"

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, MotionDiv } from './framer-motion/MotionWrapper';

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
			className="cursor-pointer w-8 h-8 mx-2 relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
		>
			<AnimatePresence mode="wait">
				{theme === 'dark' ? (
					<MotionDiv
						key="sun"
						initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
						animate={{ rotate: 0, opacity: 1, scale: 1 }}
						exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<Sun size={20} />
					</MotionDiv>
				) : (
					<MotionDiv
						key="moon"
						initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
						animate={{ rotate: 0, opacity: 1, scale: 1 }}
						exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="absolute inset-0 flex items-center justify-center"
					>
						<Moon size={20} />
					</MotionDiv>
				)}
			</AnimatePresence>
		</Button>
	);
}

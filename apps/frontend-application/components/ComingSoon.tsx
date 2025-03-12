import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { menuItems } from '@/lib/util/menuItems';
import { ChevronRight } from 'lucide-react';

export interface ComingSoonProps {
	title: string;
}

interface SubMenuItem {
	name: string;
	path: string;
	visible?: boolean;
	enabled?: boolean;
	subItems?: SubMenuItem[];
}

const SubMenuButton = ({
	subItem,
	depth = 0,
}: {
	subItem: SubMenuItem;
	depth?: number;
}) => {
	return (
		<>
			<Button
				key={subItem.path}
				variant="outline"
				asChild
				className="w-full justify-start"
			>
				<Link
					href={subItem.path}
					className="px-4 py-2 flex items-center gap-2"
					tabIndex={0}
					aria-label={`Navigate to ${subItem.name}`}
				>
					{depth > 0 && (
						<span style={{ marginLeft: `${depth * 16}px` }}>
							<ChevronRight className="h-4 w-4" />
						</span>
					)}
					{subItem.name}
				</Link>
			</Button>

			{subItem.subItems?.map((nestedItem) => (
				<SubMenuButton
					key={nestedItem.path}
					subItem={nestedItem}
					depth={depth + 1}
				/>
			))}
		</>
	);
};

export default function ComingSoon({ title }: ComingSoonProps) {
	const currentMenuItem = menuItems.find(
		(item) => item.title.toLowerCase() === title.toLowerCase()
	);

	return (
		<div className="flex flex-col items-center justify-center h-full space-y-8">
			{currentMenuItem?.subItems && currentMenuItem.subItems.length > 0 && (
				<div className="flex flex-col gap-2 w-full max-w-md">
					{currentMenuItem.subItems.map((subItem) => (
						<SubMenuButton key={subItem.path} subItem={subItem} />
					))}
				</div>
			)}
		</div>
	);
}

import { menuItems } from '@/lib/util/menuItems';
import React from 'react';
import { Button } from './ui/button';
import { Link } from '@/lib/i18n';
import { ChevronRight } from 'lucide-react';

interface SubMenuItem {
	name: string;
	path: string;
	visible?: boolean;
	enabled?: boolean;
	subItems?: SubMenuItem[];
}

interface SubMenuListProps {
	pathName: string;
}

const SubMenuButton = ({
	subItem,
	depth = 0,
}: {
	subItem: SubMenuItem;
	depth?: number;
}) => {
	return (
		<div>
			<Button
				key={subItem.path}
				variant="outline"
				asChild
				className={`w-full justify-start h-14 text-center ${depth > 0 ? 'ml-4' : ''
					}`}
			>
				<Link
					href={subItem.path}
					className="px-4 py-2 flex items-center gap-2"
					tabIndex={0}
					aria-label={`Navigate to ${subItem.name}`}
				>
					{depth > 0 && (
						<span style={{ marginLeft: `${depth * 8}px` }}>
							<ChevronRight className="h-4 w-4" />
						</span>
					)}
					{subItem.name}
				</Link>
			</Button>

			{/* Render nested sub-items */}
			{subItem.subItems?.map((nestedItem) => (
				<SubMenuButton
					key={nestedItem.path}
					subItem={nestedItem}
					depth={depth + 1}
				/>
			))}
		</div>
	);
};

const SubMenuList: React.FC<SubMenuListProps> = ({ pathName }) => {
	const currentMenuItem = menuItems.find(
		(item) => item.title.toLowerCase() === pathName.toLowerCase()
	);

	return (
		<div className="p-6 w-full">
			{currentMenuItem?.subItems && currentMenuItem.subItems.length > 0 && (
				<div className="grid gap-4 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{currentMenuItem.subItems.map((subItem) => (
						<div key={subItem.path}>
							{/* Render root-level items */}
							<SubMenuButton subItem={subItem} />

							{/* Nested sub-items are handled in SubMenuButton */}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SubMenuList;

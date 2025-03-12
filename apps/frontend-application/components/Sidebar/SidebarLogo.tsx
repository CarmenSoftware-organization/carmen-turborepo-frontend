import React from 'react'
import { Link } from '@/lib/i18n';
import { Button } from "@/components/ui/button";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {
	isExpanded: boolean;
	isPinned: boolean;
	togglePin: () => void;
	className?: string;
}

const SidebarLogo: React.FC<Props> = ({
	isExpanded,
	isPinned,
	togglePin,
	className,
}) => {
	return (
		<div
			className={cn('logo-container relative h-[60px]', className)}
			data-id="sidebar-logo-container"
		>
			<Link
				href="/"
				className="absolute inset-0 flex items-center justify-center"
				data-id="sidebar-logo-link"
			>
				<div
					className={cn(
						'absolute left-3 transition-all duration-300',
						isExpanded
							? 'opacity-100 delay-200'
							: 'opacity-0 pointer-events-none'
					)}
					data-id="sidebar-logo-text-container"
				>
					<span
						className="text-2xl font-bold block tracking-wide"
						data-id="sidebar-logo-text"
					>
						CARMEN
					</span>
					<span
						className="text-sm block text-gray-500 dark:text-gray-200 tracking-wide"
						data-id="sidebar-logo-text-sub"
					>
						Hospitality Supply Chain
					</span>
				</div>
				<Avatar
					data-id="sidebar-logo-avatar"
					className={cn(
						'transition-all duration-300',
						isExpanded
							? 'opacity-0 pointer-events-none'
							: 'opacity-100 delay-200'
					)}
				>
					<AvatarImage
						src="/images/carmen_pic.png"
						alt="@shadcn"
						className="h-10 w-10"
						data-id="sidebar-logo-avatar-image"
					/>
				</Avatar>
			</Link>
			<div
				className={cn(
					'absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300',
					isExpanded ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none'
				)}
			>
				{isExpanded && (
					<Button
						variant="ghost"
						size="icon"
						onClick={togglePin}
						data-id="sidebar-logo-pin-button"
					>
						<Pin
							className={cn('h-5 w-5', isPinned && 'text-blue-500')}
							data-id="sidebar-logo-pin-icon"
						/>
					</Button>
				)}
			</div>
		</div>
	);
};

export default SidebarLogo
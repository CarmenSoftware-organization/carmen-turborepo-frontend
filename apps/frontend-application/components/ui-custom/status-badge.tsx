import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeStatus } from './custom-status-badge';

interface Props {
	status: string;
	className?: string;
}

const BadgePr = ({ status, className }: Props) => {
	// Define default styling for unknown statuses
	const defaultStyle = {
		bg: 'bg-gray-100 dark:bg-gray-800',
		text: 'text-gray-800 dark:text-gray-300',
	};

	// Get status styles from the mapping or use default if not found
	const statusKey = Object.values(BadgeStatus).includes(status as BadgeStatus)
		? status
		: 'Pending';

	const statusStyles: Record<string, { bg: string; text: string }> = {
		// Success states
		Approved: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		Completed: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		Active: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		Accepted: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		Posted: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		Received: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		Normal: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},

		// Primary states (using corporate blue)
		Open: {
			bg: 'bg-primary/20 dark:bg-primary/30',
			text: 'text-primary dark:text-primary-foreground',
		},
		InProgress: {
			bg: 'bg-primary/20 dark:bg-primary/30',
			text: 'text-primary dark:text-primary-foreground',
		},
		Submitted: {
			bg: 'bg-primary/20 dark:bg-primary/30',
			text: 'text-primary dark:text-primary-foreground',
		},
		Sent: {
			bg: 'bg-primary/20 dark:bg-primary/30',
			text: 'text-primary dark:text-primary-foreground',
		},
		Committed: {
			bg: 'bg-primary/20 dark:bg-primary/30',
			text: 'text-primary dark:text-primary-foreground',
		},
		OverMax: {
			bg: 'bg-blue-100 dark:bg-blue-900/30',
			text: 'text-blue-800 dark:text-blue-300',
		},

		// Warning states
		Pending: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},
		OnHold: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},
		Review: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},
		Draft: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},
		Saved: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},
		Delayed: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},
		Reorder: {
			bg: 'bg-yellow-100 dark:bg-yellow-900/30',
			text: 'text-yellow-800 dark:text-yellow-300',
		},

		// Danger states
		Rejected: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},
		Cancelled: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},
		Deleted: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},
		Voided: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},
		BelowMin: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},
		SendBack: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},

		// Neutral states
		Closed: {
			bg: 'bg-gray-100 dark:bg-gray-800',
			text: 'text-gray-800 dark:text-gray-300',
		},
		Inactive: {
			bg: 'bg-gray-100 dark:bg-gray-800',
			text: 'text-gray-800 dark:text-gray-300',
		},

		// Special states
		Partial: {
			bg: 'bg-orange-100 dark:bg-orange-900/30',
			text: 'text-orange-800 dark:text-orange-300',
		},
		IN: {
			bg: 'bg-green-100 dark:bg-green-900/30',
			text: 'text-green-800 dark:text-green-300',
		},
		OUT: {
			bg: 'bg-red-100 dark:bg-red-900/30',
			text: 'text-red-800 dark:text-red-300',
		},
	};

	const style = statusStyles[statusKey] || defaultStyle;

	return (
		<span
			className={cn(
				'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
				style.bg,
				style.text,
				className
			)}
		>
			{status}
		</span>
	);
};

export default BadgePr;

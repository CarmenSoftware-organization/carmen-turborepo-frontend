import React, { ReactNode } from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
	title: string;
	description: string;
	icon?: ReactNode;
	actionButtons?: ReactNode;
	filters?: ReactNode;
	bulkActions?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	title,
	description,
	icon = <FileQuestion className="h-12 w-12 text-muted-foreground" />,
	actionButtons,
	filters,
	bulkActions,
}) => {
	return (
		<div className="flex flex-col p-6 justify-center items-center min-h-screen">
			<div className="sticky top-0 z-10 w-full">
				<div className="md:flex justify-between items-start">
					<h1 className="text-2xl font-semibold">{title}</h1>
					{actionButtons && <div className="mt-4 md:mt-0">{actionButtons}</div>}
				</div>
				{filters && <div className="mb-4">{filters}</div>}
				{bulkActions && <div className="mb-4">{bulkActions}</div>}
			</div>

			<div className="flex flex-col items-center justify-center flex-1">
				<div className="mb-4">{icon}</div>
				<div className="text-center">
					<p>{description}</p>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto bg-background max-h-[calc(100vh-200px)] rounded-lg"></div>
		</div>
	);
};

export default EmptyState;

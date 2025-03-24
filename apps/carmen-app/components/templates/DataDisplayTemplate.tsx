import React, { ReactNode } from 'react';
import SkeltonLoad from '../loading/SkeltonLoad';
interface Props {
	title: string;
	actionButtons?: ReactNode;
	filters?: ReactNode;
	content: ReactNode;
	bulkActions?: ReactNode;
	isLoading?: boolean;
}

const DataDisplayTemplate: React.FC<Props> = ({
	title,
	actionButtons,
	filters,
	content,
	bulkActions,
	isLoading,
}) => {
	return (
		<div
			className={`space-y-4 flex w-full flex-col justify-center transition-all duration-300 ease-in-out`}
		>
			<div className="sticky top-0 bg-background z-10 space-y-4">
				<div className="md:flex justify-between items-start">
					<h1 className="text-2xl font-semibold">{title}</h1>
					{actionButtons && <div className="mt-4 md:mt-0">{actionButtons}</div>}
				</div>
				{filters && <div>{filters}</div>}
				{bulkActions && <div className="mb-4">{bulkActions}</div>}
			</div>
			<div className="flex-1 overflow-y-auto bg-background rounded-lg">
				{isLoading ? <SkeltonLoad /> : content}
			</div>
		</div>
	);
};

export default DataDisplayTemplate;

import React, { ReactNode } from 'react';
import SkeltonLoad from '../loading/SkeltonLoad';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
	title: string;
	actionButtons?: ReactNode;
	filters?: ReactNode;
	content: ReactNode;
	bulkActions?: ReactNode;
	isLoading?: boolean;
}

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 20 },
	transition: { duration: 0.3 }
};

const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.2 }
};

const DataDisplayTemplate: React.FC<Props> = ({
	title,
	actionButtons,
	filters,
	content,
	bulkActions,
	isLoading,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={`space-y-4 flex w-full flex-col justify-center transition-all duration-300 ease-in-out`}
		>
			<motion.div
				className="sticky top-0 bg-background z-10 space-y-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<motion.div
					className="md:flex justify-between items-start"
					{...fadeIn}
				>
					<motion.h1
						className="text-2xl font-semibold"
						{...fadeInUp}
					>
						{title}
					</motion.h1>
					{actionButtons && (
						<motion.div
							className="mt-4 md:mt-0"
							{...fadeInUp}
						>
							{actionButtons}
						</motion.div>
					)}
				</motion.div>
				<AnimatePresence>
					{filters && (
						<motion.div {...fadeIn}>
							{filters}
						</motion.div>
					)}
					{bulkActions && (
						<motion.div
							className="mb-4"
							{...fadeIn}
						>
							{bulkActions}
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
			<motion.div
				className="flex-1 overflow-y-auto bg-background rounded-lg"
				{...fadeInUp}
			>
				<AnimatePresence mode="wait">
					{isLoading ? <SkeltonLoad /> : content}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
};

export default DataDisplayTemplate;

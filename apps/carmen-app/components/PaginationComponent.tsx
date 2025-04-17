import React from "react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	// PaginationNext,
	// PaginationPrevious,
} from "@/components/ui-custom/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	limit?: string;
	onLimitChange?: (newLimit: string) => void;
	position?: 'left' | 'right' | 'center';
}

const PaginationComponent = ({
	currentPage,
	totalPages,
	onPageChange,
	limit,
	onLimitChange,
	position = 'right',
}: PaginationProps) => {

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			onPageChange(newPage);
		}
	};

	if (totalPages <= 1) return null;

	const justifyPositions = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end'
	};

	return (
		<Pagination
			className={`flex ${justifyPositions[position]} items-center`}
			data-id="pagination-container"
		>
			{limit && onLimitChange && (
				<div className="flex items-center gap-2">
					<span className="text-sm">Items per page:</span>
					<Select value={limit} onValueChange={onLimitChange}>
						<SelectTrigger className="w-16 h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="25">25</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}
			<PaginationContent data-id="pagination-content">
				<PaginationItem data-id="pagination-item">
					<ChevronLeft
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(currentPage - 1);
						}}
						size={18}
						className={
							currentPage <= 1
								? 'pointer-events-none opacity-50 mr-2'
								: 'cursor-pointer'
						}
						data-id="pagination-chevron-left"
					/>
				</PaginationItem>

				<PaginationItem data-id="pagination-item">
					<PaginationLink
						href="#"
						isActive={currentPage === 1}
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(1);
						}}
						data-id="pagination-link"
					>
						1
					</PaginationLink>
				</PaginationItem>

				{currentPage > 3 && (
					<PaginationItem data-id="pagination-item">
						<PaginationEllipsis data-id="pagination-ellipsis" />
					</PaginationItem>
				)}

				{currentPage > 2 && (
					<PaginationItem data-id="pagination-item">
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(currentPage - 1);
							}}
							data-id="pagination-link"
						>
							{currentPage - 1}
						</PaginationLink>
					</PaginationItem>
				)}

				{currentPage !== 1 && currentPage !== totalPages && (
					<PaginationItem data-id="pagination-item">
						<PaginationLink
							href="#"
							isActive={true}
							data-id="pagination-link"
						>
							{currentPage}
						</PaginationLink>
					</PaginationItem>
				)}

				{currentPage < totalPages - 1 && (
					<PaginationItem data-id="pagination-item">
						<PaginationLink
							href="#"
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(currentPage + 1);
							}}
							data-id="pagination-link"
						>
							{currentPage + 1}
						</PaginationLink>
					</PaginationItem>
				)}

				{currentPage < totalPages - 2 && (
					<PaginationItem data-id="pagination-item">
						<PaginationEllipsis data-id="pagination-ellipsis" />
					</PaginationItem>
				)}

				{totalPages > 1 && (
					<PaginationItem data-id="pagination-item">
						<PaginationLink
							href="#"
							isActive={currentPage === totalPages}
							onClick={(e) => {
								e.preventDefault();
								handlePageChange(totalPages);
							}}
							data-id="pagination-link"
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem data-id="pagination-item">
					<ChevronRight
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(currentPage + 1);
						}}
						className={
							currentPage >= totalPages
								? 'pointer-events-none opacity-50 mr-2'
								: 'cursor-pointer'
						}
						size={18}
						data-id="pagination-chevron-right"
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PaginationComponent;
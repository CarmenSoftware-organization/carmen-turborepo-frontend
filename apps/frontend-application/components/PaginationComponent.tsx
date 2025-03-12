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

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const PaginationComponent = ({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) => {

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			onPageChange(newPage);
		}
	};

	if (totalPages <= 1) return null;

	return (
		<Pagination
			className="flex justify-end mt-4 items-center"
			data-id="pagination-container"
		>
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
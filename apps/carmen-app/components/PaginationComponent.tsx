import React, { useEffect, useState } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	// PaginationNext,
	// PaginationPrevious,
} from "@/components/ui-custom/pagination";
import { ChevronFirst, ChevronLastIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	position?: 'left' | 'right' | 'center';
	perpage: number;
	setPerpage?: (perpage: number) => void;
}

const PaginationComponent = ({
	currentPage,
	totalPages,
	onPageChange,
	position = 'right',
	perpage,
	setPerpage,
}: PaginationProps) => {
	const tCommon = useTranslations("Common");

	const [inputValue, setInputValue] = useState(currentPage.toString());

	useEffect(() => {
		setInputValue(currentPage.toString());
	}, [currentPage]);

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

	const handlePerPageChange = (newPerpage: string) => {
		if (setPerpage) {
			setPerpage(parseInt(newPerpage));
		}
	};

	const onGoToPage = (value: string) => {
		const page = parseInt(value);
		if (!isNaN(page)) {
			handlePageChange(page);
		}
	};

	return (
		<Pagination
			className={`flex ${justifyPositions[position]} items-center`}
			data-id="pagination-container"
		>
			<PaginationContent data-id="pagination-content">

				<PaginationItem data-id="first-item">
					<ChevronFirst
						size={18}
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(1);
						}}
						className={
							currentPage <= 1
								? 'pointer-events-none opacity-50 mr-2'
								: 'cursor-pointer'
						}
					/>
				</PaginationItem>
				<PaginationItem data-id="pagination-item">
					<ChevronLeft
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(currentPage - 1);
						}}
						size={18}
						className={cn(
							currentPage <= 1
								? 'pointer-events-none opacity-50 mr-2'
								: 'cursor-pointer',
						)}
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
						className="text-sm"
					>
						1
					</PaginationLink>
				</PaginationItem>

				{currentPage > 3 && (
					<PaginationItem data-id="pagination-item">
						<PaginationEllipsis data-id="pagination-ellipsis" className="text-sm" />
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
							className="text-sm"
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
							className="text-sm"
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
							className="text-sm"
						>
							{currentPage + 1}
						</PaginationLink>
					</PaginationItem>
				)}

				{currentPage < totalPages - 2 && (
					<PaginationItem data-id="pagination-item">
						<PaginationEllipsis data-id="pagination-ellipsis" className="text-sm" />
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
							className="text-sm"
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
						className={cn(
							currentPage >= totalPages
								? 'pointer-events-none opacity-50 mr-2'
								: 'cursor-pointer',
							'text-sm'
						)}
						size={18}
						data-id="pagination-chevron-right"
					/>
				</PaginationItem>
				<PaginationItem data-id="last-item">
					<ChevronLastIcon
						size={18}
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePageChange(totalPages);
						}}
						className={cn(
							currentPage >= totalPages
								? 'pointer-events-none opacity-50 mr-2'
								: 'cursor-pointer',
							'mr-2 text-sm'
						)}
					/>
				</PaginationItem>
				<PaginationItem data-id="select-perpage">
					<Select value={String(perpage || 10)} onValueChange={handlePerPageChange}>
						<SelectTrigger className="h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="text-sm">
							<SelectItem value="5">5 / {tCommon("perPage")}</SelectItem>
							<SelectItem value="10">10 / {tCommon("perPage")}</SelectItem>
							<SelectItem value="25">25 / {tCommon("perPage")}</SelectItem>
							<SelectItem value="50">50 / {tCommon("perPage")}</SelectItem>
						</SelectContent>
					</Select>
				</PaginationItem>
				<PaginationItem data-id="go-to-page">
					<div className="fxr-c gap-2 mx-1">
						<p className="text-sm">{tCommon("goTo")}</p>
						<Input
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onClick={() => onGoToPage(inputValue)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									onGoToPage(inputValue);
								}
							}}
							className="h-8 bg-background w-10 text-center"
						/>
						<p className="text-sm">{tCommon("page")}</p>
					</div>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PaginationComponent;
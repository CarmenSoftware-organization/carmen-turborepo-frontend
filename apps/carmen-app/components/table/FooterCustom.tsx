import PaginationComponent from "../PaginationComponent";
import { TableCell, TableFooter, TableRow } from "../ui/table";

interface Props {
    readonly totalPages: number;
    readonly totalItems?: number;
    readonly currentPage: number;
    readonly onPageChange: (page: number) => void;
    readonly colSpanItems: number;
    readonly colSpanPagination: number;
}

export default function FooterCustom({ totalPages, totalItems, currentPage, onPageChange, colSpanItems, colSpanPagination }: Props) {
    return (
        <TableFooter className="h-16">
            <TableRow>
                <TableCell colSpan={colSpanItems}>
                    <p className="text-sm text-muted-foreground">
                        {totalItems} items found
                    </p>
                </TableCell>
                {totalPages > 1 && (
                    <TableCell colSpan={colSpanPagination}>
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </TableCell>
                )}
            </TableRow>
        </TableFooter>
    )
}
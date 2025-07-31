import PaginationComponent from "../PaginationComponent";
import { TableCell, TableFooter, TableRow } from "../ui/table";

interface Props {
    readonly totalPages: number;
    readonly totalItems?: number;
    readonly currentPage: number;
    readonly onPageChange: (page: number) => void;
}

export default function FooterCustom({ totalPages, totalItems, currentPage, onPageChange }: Props) {
    return (
        <TableFooter className="h-16">
            <TableRow>
                <TableCell colSpan={8}>
                    <p className="text-sm text-muted-foreground">
                        {totalItems} items found
                    </p>
                </TableCell>
                {totalPages > 1 && (
                    <TableCell colSpan={2}>
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
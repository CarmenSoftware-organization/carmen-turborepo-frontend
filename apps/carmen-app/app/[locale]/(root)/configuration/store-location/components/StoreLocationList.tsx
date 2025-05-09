import { StoreLocationDto } from "@/dtos/config.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SquarePen, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import PaginationComponent from "@/components/PaginationComponent";
import { STORE_LOCATION_TYPE_COLOR } from "@/utils/badge-status-color";
import { SortConfig, getSortableColumnProps, renderSortIcon } from "@/utils/table-sort";

interface StoreLocationListProps {
    readonly isLoading: boolean;
    readonly storeLocations: StoreLocationDto[];
    readonly onEdit: (storeLocation: StoreLocationDto) => void;
    readonly onStatusChange: (storeLocation: StoreLocationDto) => void;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
}

export default function StoreLocationList({
    isLoading,
    storeLocations,
    onEdit,
    onStatusChange,
    currentPage,
    totalPages,
    onPageChange,
    sort,
    onSort,
}: StoreLocationListProps) {
    const t = useTranslations('TableHeader');
    const tCommon = useTranslations('Common');

    const renderTableContent = () => {
        if (isLoading) return <TableBodySkeleton columns={8} />;

        if (storeLocations.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-sm text-muted-foreground">No store locations found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        };

        return (
            <TableBody>
                {storeLocations.map((storeLocation, index) => (
                    <TableRow
                        key={storeLocation.id}
                    >
                        <TableCell className="w-10">{index + 1}</TableCell>
                        <TableCell>
                            <div>
                                <p className="text-xs font-bold">{storeLocation.name}</p>
                                <p className="text-xs text-muted-foreground">{storeLocation.description}</p>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Badge className={STORE_LOCATION_TYPE_COLOR(storeLocation.location_type)}>
                                {storeLocation.location_type.toUpperCase()}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {storeLocation.delivery_point?.name}
                        </TableCell>
                        <TableCell>
                            <Badge variant={storeLocation.is_active ? "active" : "inactive"}>
                                {storeLocation.is_active ? tCommon("active") : tCommon("inactive")}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(storeLocation)}
                                    aria-label="Edit store location"
                                    className="h-7 w-7"
                                >
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onStatusChange(storeLocation)}
                                    aria-label={`${storeLocation.is_active ? 'Deactivate' : 'Activate'} store location`}
                                    disabled={!storeLocation.is_active}
                                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Table className="border">
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead
                                {...getSortableColumnProps('name', sort, onSort)}
                            >
                                <div className="flex items-center">
                                    {t('name')}
                                    {renderSortIcon('name', sort)}
                                </div>
                            </TableHead>
                            <TableHead className="hidden md:table-cell">{t('type')}</TableHead>
                            <TableHead className="hidden md:table-cell">{t('delivery_point')}</TableHead>
                            <TableHead
                                {...getSortableColumnProps('is_active', sort, onSort)}
                            >
                                <div className="flex items-center">
                                    {t('status')}
                                    {renderSortIcon('is_active', sort)}
                                </div>
                            </TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        {renderTableContent()}
                    </Table>
                </ScrollArea>
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}


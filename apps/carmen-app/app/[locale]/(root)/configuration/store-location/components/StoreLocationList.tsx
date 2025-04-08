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
import { Pencil, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";

interface StoreLocationListProps {
    readonly isLoading?: boolean;
    readonly storeLocations: StoreLocationDto[];
    readonly onEdit: (storeLocation: StoreLocationDto) => void;
    readonly onStatusChange: (storeLocation: StoreLocationDto) => void;
}

export default function StoreLocationList({
    isLoading = false,
    storeLocations,
    onEdit,
    onStatusChange
}: StoreLocationListProps) {
    const t = useTranslations('TableHeader');
    console.log('storeLocations', storeLocations);

    return (
        <div className="space-y-4">
            <ScrollArea className="relative">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead className="md:w-56">{t('name')}</TableHead>
                            <TableHead className="hidden md:table-cell">{t('type')}</TableHead>
                            <TableHead className="hidden md:table-cell">{t('description')}</TableHead>
                            <TableHead className="">Delivery Point</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBodySkeleton columns={8} />
                    ) : (
                        <TableBody>
                            {storeLocations.map((storeLocation, index) => (
                                <TableRow
                                    key={storeLocation.id}
                                >
                                    <TableCell className="w-10">{index + 1}</TableCell>
                                    <TableCell className="md:w-56">{storeLocation.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{storeLocation.location_type}</TableCell>
                                    <TableCell className="hidden md:table-cell">{storeLocation.description}</TableCell>
                                    <TableCell>{storeLocation.delivery_point.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={storeLocation.is_active ? "default" : "destructive"}>
                                            {storeLocation.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(storeLocation)}
                                                aria-label="Edit store location"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onStatusChange(storeLocation)}
                                                className={storeLocation.is_active ? "hover:text-destructive" : "hover:text-primary"}
                                                aria-label={`${storeLocation.is_active ? 'Deactivate' : 'Activate'} store location`}
                                                disabled={!storeLocation.is_active}
                                            >
                                                <Trash className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </ScrollArea>
        </div>
    );
}


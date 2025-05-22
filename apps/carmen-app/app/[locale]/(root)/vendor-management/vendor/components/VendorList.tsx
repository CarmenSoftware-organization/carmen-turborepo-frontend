import { VendorGetDto } from "@/dtos/vendor-management";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaginationComponent from "@/components/PaginationComponent";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface VendorListProps {
    readonly vendors: VendorGetDto[];
    readonly onDeleteClick?: (vendor: VendorGetDto) => void;
    readonly isLoading?: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function VendorList({
    vendors,
    onDeleteClick,
    isLoading = false,
    currentPage,
    totalPages,
    onPageChange
}: VendorListProps) {

    const tHeader = useTranslations('TableHeader');

    const handleDeleteClick = (vendor: VendorGetDto) => {
        if (onDeleteClick) {
            onDeleteClick(vendor);
        }
    };

    return (
        <div className="space-y-4">
            <div className="hidden md:block relative">
                <Table className="border">
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead className="w-40 text-left">{tHeader('name')}</TableHead>
                            <TableHead className="w-60">{tHeader('description')}</TableHead>
                            <TableHead>{tHeader('business_type')}</TableHead>
                            <TableHead className="w-20 text-left">{tHeader('status')}</TableHead>
                            <TableHead className="text-right">{tHeader('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        {isLoading ? (
                            <TableBodySkeleton rows={5} />
                        ) : (
                            <TableBody>
                                {vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">No vendors found</TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor, index) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="text-center w-10">{index + 1}</TableCell>
                                            <TableCell className="w-40 text-left">{vendor.name}</TableCell>
                                            <TableCell className="w-60 text-left">{vendor.description}</TableCell>
                                            <TableCell>{vendor.business_type_name ?? "-"}</TableCell>
                                            <TableCell className="text-left w-20">
                                                <Badge variant={vendor.is_active ? "active" : "inactive"}>
                                                    {vendor.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                    <Link href={`/vendor-management/vendor/${vendor.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(vendor)}
                                                    className="h-7 w-7"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        )}
                    </Table>
                </ScrollArea>
            </div>

            <div className="grid gap-4 md:hidden">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <Card key={index} className="animate-pulse">
                                <CardHeader className="h-16 bg-muted" />
                                <CardContent className="space-y-4">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="text-center">No vendors found</div>
                ) : (
                    vendors.map((vendor) => (
                        <Card key={vendor.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{vendor.name}</p>
                                        <span className={`px-2 py-1 rounded-full text-xs ${vendor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {vendor.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                            <Link href={`/vendor-management/vendor/${vendor.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleDeleteClick(vendor)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="grid gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Description</p>
                                        <p className="text-sm font-medium">{vendor.description}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Business Type</p>
                                        <p className="text-sm font-medium">{vendor.business_type_name ?? "-"}</p>
                                    </div>
                                    {vendor.info.length > 0 && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground">Additional Information</p>
                                            <div className="grid gap-2">
                                                {vendor.info.map((item, index) => (
                                                    <div key={index} className="flex justify-between">
                                                        <p className="text-sm">{item.label}</p>
                                                        <p className="text-sm font-medium">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    )
} 
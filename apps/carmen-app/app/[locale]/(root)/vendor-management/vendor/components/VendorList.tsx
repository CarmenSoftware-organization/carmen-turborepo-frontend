import { VendorDto } from "@/dtos/vendor-management";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VendorListProps {
    readonly vendors: VendorDto[];
    readonly onEditClick?: (vendor: VendorDto) => void;
    readonly onDeleteClick?: (vendor: VendorDto) => void;
    readonly isLoading?: boolean;
}

export default function VendorList({ vendors, onEditClick, onDeleteClick, isLoading = false }: VendorListProps) {
    const handleEditClick = (vendor: VendorDto) => {
        if (onEditClick) {
            onEditClick(vendor);
        }
    };

    const handleDeleteClick = (vendor: VendorDto) => {
        if (onDeleteClick) {
            onDeleteClick(vendor);
        }
    };

    return (
        <div className="space-y-4">
            <div className="hidden md:block relative">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Info</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        {isLoading ? (
                            <TableBodySkeleton columns={6} />
                        ) : (
                            <TableBody>
                                {vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">No vendors found</TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor, index) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="text-center w-10">{index + 1}</TableCell>
                                            <TableCell className="font-medium">{vendor.name}</TableCell>
                                            <TableCell>{vendor.description}</TableCell>
                                            <TableCell>{vendor.info ? JSON.stringify(vendor.info) : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant={vendor.is_active ? "default" : "secondary"}>
                                                    {vendor.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditClick(vendor)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(vendor)}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash className="h-4 w-4" />
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
                                        <Badge>
                                            {vendor.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-accent"
                                            onClick={() => handleEditClick(vendor)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => handleDeleteClick(vendor)}
                                        >
                                            <Trash className="h-4 w-4" />
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
                                        <p className="text-sm text-muted-foreground">Info</p>
                                        <p className="text-sm font-medium">
                                            {vendor.info ? JSON.stringify(vendor.info) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
} 
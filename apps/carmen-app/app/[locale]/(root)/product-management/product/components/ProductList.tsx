"use client";

import { ProductGetDto } from "@/dtos/product.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Eye, Trash } from "lucide-react";
import { Link } from "@/lib/navigation";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import PaginationComponent from "@/components/PaginationComponent";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductListProps {
    readonly products: ProductGetDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function ProductList({
    products,
    isLoading,
    currentPage,
    totalPages,
    onPageChange
}: ProductListProps) {
    const t = useTranslations('TableHeader');

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === products.length) {
            setSelectedItems([]);
        } else {
            const allIds = products.map(pd => pd.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = products.length > 0 && selectedItems.length === products.length;

    const renderDesktopTableContent = () => {
        if (isLoading) return <TableBodySkeleton columns={7} />;

        if (products.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-sm text-muted-foreground">No products found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {products.map((pd) => (
                    <TableRow key={pd.id}>
                        <TableCell className="text-center w-10">
                            <Checkbox
                                id={`checkbox-${pd.id}`}
                                checked={selectedItems.includes(pd.id ?? '')}
                                onCheckedChange={() => handleSelectItem(pd.id ?? '')}
                                aria-label={`Select ${pd.name}`}
                            />
                        </TableCell>
                        <TableCell>{pd.code}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">
                                    {pd.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {pd.description}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>{pd.product_category.name}</TableCell>
                        <TableCell>{pd.product_sub_category.name}</TableCell>
                        <TableCell>{pd.product_item_group.name}</TableCell>
                        <TableCell>
                            <Badge variant={pd.product_status_type === "active" ? "default" : "destructive"}>
                                {pd.product_status_type === "active" ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-end">
                                <Button variant="ghost" size={'sm'} asChild>
                                    <Link href={`/product-management/product/${pd.id}`}>
                                        <Eye />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size={'sm'} className="text-destructive">
                                    <Trash />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    const renderMobileContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
                        <Card key={id} className="animate-pulse">
                            <CardHeader className="h-16 bg-muted" />
                            <CardContent className="space-y-4">
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-4 bg-muted rounded w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-muted-foreground">No products found</CardTitle>
                    </CardHeader>
                </Card>
            );
        }

        return products.map((pd) => (
            <Card key={pd.id}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{pd.name}</span>
                        <Badge variant={pd.product_status_type === "active" ? "default" : "destructive"}>
                            {pd.product_status_type === "active" ? "Active" : "Inactive"}
                        </Badge>
                    </CardTitle>
                    <CardDescription>{pd.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-end">
                        <Button variant="ghost" size={'sm'} asChild>
                            <Link href={`/product-management/product/${pd.id}`}>
                                <Eye />
                            </Link>
                        </Button>
                        <Button variant="ghost" size={'sm'} className="text-destructive">
                            <Trash />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ));
    };

    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all purchase requests"
                                />
                            </TableHead>
                            <TableHead>{t('code')}</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Sub Category</TableHead>
                            <TableHead>Item Group</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-20 text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    {renderDesktopTableContent()}
                </Table>
            </div>

            <div className="grid gap-4 md:hidden">
                {renderMobileContent()}
            </div>

            {totalPages > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

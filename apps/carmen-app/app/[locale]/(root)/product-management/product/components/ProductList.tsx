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
import { Eye } from "lucide-react";
import { Link } from "@/lib/navigation";
interface Props {
    readonly products: ProductGetDto[];
}

export default function ProductList({ products }: Props) {
    console.log('products', products);

    const t = useTranslations('TableHeader');
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            {/* <TableHead>{t('category')}</TableHead>
                            <TableHead>{t('sub_category')}</TableHead>
                            <TableHead>{t('item_group')}</TableHead> */}
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-20 text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">
                                            {product.name}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {product.description}
                                        </span>
                                    </div>
                                </TableCell>
                                {/* <TableCell>{product.category}</TableCell>
                                <TableCell>{product.sub_category}</TableCell>
                                <TableCell>{product.item_group}</TableCell> */}
                                <TableCell>
                                    <Badge variant={product.product_status_type ? "default" : "destructive"}>
                                        {product.product_status_type ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size={'sm'} asChild>
                                            <Link href={`/product-management/product/${product.id}`}>
                                                <Eye />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
            <div className="grid gap-4 md:hidden">
                {products.map((product) => (
                    <Card key={product.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{product.name}</span>
                                <Badge variant={product.product_status_type ? "default" : "destructive"}>
                                    {product.product_status_type ? "Active" : "Inactive"}
                                </Badge>
                            </CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {/* <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Category</span>
                                    <span className="text-sm font-medium">{product.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Sub Category</span>
                                    <span className="text-sm font-medium">{product.sub_category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Item Group</span>
                                    <span className="text-sm font-medium">{product.item_group}</span>
                                </div> */}
                                <div className="flex items-center justify-end">
                                    <Button variant="ghost" size={'sm'} asChild>
                                        <Link href={`/product-management/product/${product.id}`}>
                                            <Eye />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

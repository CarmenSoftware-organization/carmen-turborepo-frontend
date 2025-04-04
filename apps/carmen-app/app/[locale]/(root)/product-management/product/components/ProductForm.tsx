"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Leaf, Upload, ImageIcon, Tag } from "lucide-react";
import Image from "next/image";
import { ProductGetDto } from "@/dtos/product.dto";

interface ProductFormProps {
    readonly mode: formType;
    readonly product?: ProductGetDto;
}

export default function ProductForm({ mode, product }: ProductFormProps) {

    const [productImage, setProductImage] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false);

    console.log('mode', mode);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check file type
        if (!file.type.startsWith("image/")) {
            alert('invalid file type')
            return
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('file too large')
            return
        }

        setIsUploading(true)

        // Simulate upload delay
        setTimeout(() => {
            // Create a URL for the image
            const imageUrl = URL.createObjectURL(file)
            setProductImage(imageUrl)
            setIsUploading(false)
            alert('success')
        }, 1500)
    }

    return (
        <main className="container space-y-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product?.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Product Code: {product?.code}
                        </p>
                    </div>
                    <Badge
                        variant={product?.product_status_type === "active" ? "default" : "destructive"}
                    >
                        {product?.product_status_type === "active" ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Left Column - Image */}
                <div className="md:col-span-2 space-y-4">
                    <Card className="p-4">
                        <div className="grid space-y-2">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                                            <Tag className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Category</p>
                                            <p className="font-medium">N/A</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                                            <Tag className="h-4 w-4 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Sub Category</p>
                                            <p className="font-medium">N/A</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                                            <Tag className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Item Group</p>
                                            <p className="font-medium">N/A</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Description (English)</h3>
                                        <p>{product?.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Description (Local)</h3>
                                        <p>{product?.local_name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Base Unit</h3>
                                        <p>{product?.inventory_unit_name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Usage</h3>
                                        <p>{product?.tb_product_info?.is_ingredients ? "Can be used as ingredient" : "Cannot be used as ingredient"}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Attributes</h3>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 rounded-md border p-2">
                                                <Tag className="h-4 w-4 text-blue-500" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{product?.tb_product_info?.info?.label ?? "Info"}</p>
                                                    <p className="font-medium">{product?.tb_product_info?.info?.value ?? "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Pricing</h3>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            <div className="rounded-md border p-2">
                                                <p className="text-xs text-muted-foreground">Base Price</p>
                                                <p className="font-medium">${product?.tb_product_info?.price ?? "0.00"}</p>
                                            </div>
                                            <div className="rounded-md border p-2">
                                                <p className="text-xs text-muted-foreground">Tax Rate</p>
                                                <p className="font-medium">{product?.tb_product_info?.tax_rate ?? "0.00"}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Product Info */}
                <div className="md:col-span-1">
                    <Card>
                        {productImage ? (
                            <div className="relative overflow-hidden rounded-md border">
                                <Image
                                    src={productImage || "/placeholder.svg"}
                                    alt={product?.name ?? ""}
                                    width={400}
                                    height={400}
                                    className="h-full w-full object-cover"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                                <div className="mb-4 rounded-full bg-muted p-6">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="mb-1 text-lg font-medium">No image available</h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Upload a product image to enhance product visibility
                                </p>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image-upload">
                                        <Button variant="outline" className="w-full cursor-pointer" disabled={isUploading}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            {isUploading ? "Uploading..." : "Upload Image"}
                                        </Button>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            <Tabs defaultValue="order-units">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="order-units">Order Units</TabsTrigger>
                    <TabsTrigger value="ingredient-units">Ingredient Units</TabsTrigger>
                    <TabsTrigger value="stock-units">Stock Units</TabsTrigger>
                </TabsList>

                <TabsContent value="order-units">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Units
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Conversion Factor</TableHead>
                                        <TableHead>Default</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No order units available</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ingredient-units">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="h-5 w-5" />
                                Ingredient Units
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Conversion Factor</TableHead>
                                        <TableHead>Default</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No ingredient units available</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stock-units">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Stock Count Units
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Conversion Factor</TableHead>
                                        <TableHead>Default</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No stock units available</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}

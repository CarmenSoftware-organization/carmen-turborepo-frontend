"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Leaf, Upload, ImageIcon, Tag, Save, Pencil } from "lucide-react";
import Image from "next/image";
import { ProductGetDto, ProductFormDto } from "@/dtos/product.dto";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { createProductService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface ProductFormProps {
    readonly mode: formType;
    readonly product?: ProductGetDto;
}

// Create a schema for form validation
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    code: z.string().min(1, "Code is required"),
    local_name: z.string().optional(),
    description: z.string().optional(),
    inventory_unit_id: z.string().optional(),
    inventory_unit_name: z.string().min(1, "Inventory unit name is required"),
    product_status_type: z.literal("active"),
    product_info: z.object({
        product_item_group_id: z.string().optional(),
        is_ingredients: z.boolean().default(false),
        price: z.number().min(0, "Price must be 0 or higher"),
        tax_type: z.enum(["none", "included", "excluded"]),
        tax_rate: z.number().min(0, "Tax rate must be 0 or higher"),
        price_deviation_limit: z.number().min(0, "Price deviation limit must be 0 or higher"),
        info: z.object({
            label: z.string().optional(),
            value: z.string().optional(),
        }),
    }),
    locations: z.object({
        add: z.array(
            z.object({
                location_id: z.string().optional(),
            })
        ),
    }),
});

const initialProductState: ProductFormDto = {
    name: "",
    code: "",
    local_name: "",
    description: "",
    inventory_unit_id: "",
    inventory_unit_name: "",
    product_status_type: "active",
    product_info: {
        product_item_group_id: "",
        is_ingredients: false,
        price: 0,
        tax_type: "none",
        tax_rate: 0,
        price_deviation_limit: 0,
        info: {
            label: "",
            value: ""
        }
    },
    locations: {
        add: []
    }
};

export default function ProductForm({ mode, product }: ProductFormProps) {
    const isAddMode = mode === formType.ADD;
    const { token, tenantId } = useAuth();
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(isAddMode);
    const [productImage, setProductImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Initialize react-hook-form with current product data
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: product ? {
            ...initialProductState,
            name: product.name,
            code: product.code,
            local_name: product.local_name,
            description: product.description,
            inventory_unit_id: product.inventory_unit_id,
            inventory_unit_name: product.inventory_unit_name,
            product_status_type: product.product_status_type,
            product_info: {
                product_item_group_id: product.tb_product_info?.product_item_group_id || "",
                is_ingredients: product.tb_product_info?.is_ingredients || false,
                price: parseFloat(product.tb_product_info?.price || "0"),
                tax_type: (product.tb_product_info?.tax_type as "none" | "included" | "excluded") || "none",
                tax_rate: parseFloat(product.tb_product_info?.tax_rate || "0"),
                price_deviation_limit: parseFloat(product.tb_product_info?.price_deviation_limit || "0"),
                info: {
                    label: product.tb_product_info?.info?.label || "",
                    value: product.tb_product_info?.info?.value || ""
                }
            }
        } : initialProductState
    });

    const { control, formState: { isSubmitting } } = form;

    console.log('mode', mode);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith("image/")) {
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return;
        }

        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            // Create a URL for the image
            const imageUrl = URL.createObjectURL(file);
            setProductImage(imageUrl);
            setIsUploading(false);
        }, 1500);
    };

    const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
        try {
            // Ensure all required fields have values for ProductFormDto
            const formData: ProductFormDto = {
                ...data,
                local_name: data.local_name ?? "",
                description: data.description ?? "",
                inventory_unit_id: data.inventory_unit_id ?? "",
                product_info: {
                    ...data.product_info,
                    product_item_group_id: data.product_info.product_item_group_id ?? "",
                    info: {
                        label: data.product_info.info.label ?? "",
                        value: data.product_info.info.value ?? ""
                    }
                },
                locations: {
                    add: data.locations.add.map(location => ({
                        location_id: location.location_id ?? ""
                    }))
                }
            };

            await createProductService(token, tenantId, formData);
            router.push('/product-management/product');
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    const handleToggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    // Render the product form (common form for add and edit modes)
    const renderProductForm = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderBasicInfoCard()}
                {renderProductDetailsCard()}
                {renderProductImageCard()}
            </form>
        </Form>
    );

    // Render basic information card
    const renderBasicInfoCard = () => (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name (English)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="local_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name (Local)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter local product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="inventory_unit_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Unit</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., kg, liter, piece" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description"
                                        rows={3}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );

    // Render product details card
    const renderProductDetailsCard = () => (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {renderProductGroup()}
                {renderPricing()}
                {renderAdditionalInfo()}
                <FormField
                    control={control}
                    name="product_info.is_ingredients"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-0.5">
                                <FormLabel>Can be used as ingredient</FormLabel>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );

    // Render product group section
    const renderProductGroup = () => (
        <div>
            <h3 className="text-md font-semibold mb-3">Product Group</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="product_info.product_item_group_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Group</FormLabel>
                            <FormControl>
                                <Input placeholder="Select item group" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    // Render pricing section
    const renderPricing = () => (
        <div>
            <h3 className="text-md font-semibold mb-3">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="product_info.price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(parseFloat(value) || 0);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="product_info.tax_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tax type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="included">Included</SelectItem>
                                    <SelectItem value="excluded">Excluded</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="product_info.tax_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax Rate (%)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(parseFloat(value) || 0);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="product_info.price_deviation_limit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Deviation Limit (%)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(parseFloat(value) || 0);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    // Render additional info section
    const renderAdditionalInfo = () => (
        <div>
            <h3 className="text-md font-semibold mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="product_info.info.label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Info Label</FormLabel>
                            <FormControl>
                                <Input placeholder="Label" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="product_info.info.value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Info Value</FormLabel>
                            <FormControl>
                                <Input placeholder="Value" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );

    // Render product image card
    const renderProductImageCard = () => (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Product Image</CardTitle>
            </CardHeader>
            <CardContent>
                {productImage ? renderUploadedImage() : renderImageUploader()}
            </CardContent>
        </Card>
    );

    // Render uploaded image
    const renderUploadedImage = () => (
        <div className="relative overflow-hidden rounded-md border">
            <Image
                src={productImage || "/placeholder.svg"}
                alt="Product preview"
                width={400}
                height={400}
                className="h-full w-full object-cover"
                priority
            />
            <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setProductImage(null)}
            >
                Change
            </Button>
        </div>
    );

    // Render image uploader
    const renderImageUploader = () => (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No image uploaded</h3>
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
    );

    // Render view mode content
    const renderViewMode = () => (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Left Column - Product Info */}
                <div className="md:col-span-2 space-y-4">
                    <Card className="p-4">
                        <div className="grid space-y-2">
                            {renderCategoryInfo()}
                            {renderProductInfo()}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Product Image */}
                <div className="md:col-span-1">
                    <Card>
                        {productImage ? renderUploadedImage() : renderViewModeImagePlaceholder()}
                    </Card>
                </div>
            </div>
            {renderProductTabs()}
        </>
    );

    // Render category info section in view mode
    const renderCategoryInfo = () => (
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
    );

    // Render product info in view mode
    const renderProductInfo = () => (
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
    );

    // Render view mode image placeholder
    const renderViewModeImagePlaceholder = () => (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No image available</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                Upload a product image to enhance product visibility
            </p>
            <div className="flex flex-col gap-2">
                <label htmlFor="image-upload-view">
                    <Button variant="outline" className="w-full cursor-pointer" disabled={isUploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    <input
                        id="image-upload-view"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                    />
                </label>
            </div>
        </div>
    );

    // Render product tabs in view mode
    const renderProductTabs = () => (
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
    );

    // Render header with action buttons
    const renderHeader = () => (
        <div className="flex justify-between items-center">
            {isAddMode ? (
                <>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? "Saving..." : "Save Product"}
                    </Button>
                </>
            ) : (
                <>
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

                    {isEditMode ? (
                        <div className="flex gap-2">
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <Save className="h-4 w-4" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                                onClick={handleToggleEditMode}
                                className="flex items-center gap-2"
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleToggleEditMode}
                            className="flex items-center gap-2"
                            variant="outline"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit Product
                        </Button>
                    )}
                </>
            )}
        </div>
    );

    // Main render
    return (
        <main className="container space-y-6">
            {renderHeader()}
            {isAddMode || isEditMode ? renderProductForm() : renderViewMode()}
        </main>
    );
} 
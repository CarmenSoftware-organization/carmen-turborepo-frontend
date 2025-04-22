"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createProductService, updateProductService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import BasicInfo from "./BasicInfo";
import PriceInfo from "./PriceInfo";
import LocationInfo from "./LocationInfo";
import OrderUnit from "./OrderUnit";
import IngredientUnit from "./IngredientUnit";
import { ProductFormValues, productFormSchema } from "../../pd-schema";

interface Props {
    readonly mode: formType;
    readonly initialValues?: any;
}

export default function FormProduct({ mode, initialValues }: Props) {
    const { token, tenantId } = useAuth();

    // Transform initialValues to match form structure
    const transformInitialValues = () => {
        if (!initialValues) return undefined;

        return {
            id: initialValues.id,
            name: initialValues.name,
            code: initialValues.code,
            local_name: initialValues.local_name,
            description: initialValues.description,
            inventory_unit_id: initialValues.inventory_unit?.id,
            product_status_type: initialValues.product_status_type,
            product_info: {
                id: initialValues.product_info?.id,
                product_item_group_id: initialValues.product_item_group?.id,
                is_ingredients: initialValues.product_info?.is_ingredients ?? false,
                price: initialValues.product_info?.price ?? 0,
                tax_type: initialValues.product_info?.tax_type ?? "none",
                tax_rate: initialValues.product_info?.tax_rate ?? 0,
                price_deviation_limit: initialValues.product_info?.price_deviation_limit ?? 0,
                qty_deviation_limit: initialValues.product_info?.qty_deviation_limit ?? 0,
                info: initialValues.product_info?.info ?? []
            },
            locations: {
                data: initialValues.locations?.map((location: any) => ({
                    id: location.id,
                    location_id: location.location_id
                })) ?? [],
                add: [],
                remove: [],
            },
            order_units: {
                data: initialValues.order_units?.map((unit: any) => ({
                    id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty,
                })) ?? [],
                add: [],
                update: [],
                remove: []
            },
            ingredient_units: {
                data: initialValues.ingredient_units?.map((unit: any) => ({
                    id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty,
                })) ?? [],
                add: [],
                update: [],
                remove: []
            }
        };
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: transformInitialValues()
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            // Create a copy of the data and remove .data properties
            const { locations, order_units, ingredient_units, ...restData } = data;
            const submitData = {
                ...restData,
                locations: {
                    add: locations.add,
                    remove: locations.remove?.map(item => ({
                        product_location_id: item.id
                    }))
                },
                order_units: {
                    add: order_units.add,
                    update: order_units.update,
                    remove: order_units.remove
                },
                ingredient_units: {
                    add: ingredient_units.add,
                    update: ingredient_units.update,
                    remove: ingredient_units.remove
                }
            };

            console.log('>>> submitData', submitData);

            let response;
            if (mode === formType.ADD) {
                response = await createProductService(token, tenantId, submitData);
                console.log('>>> create res', response);
            } else {
                if (!submitData.id) {
                    throw new Error('Product ID is required for update');
                }
                response = await updateProductService(token, tenantId, submitData.id, submitData);
                console.log('>>> update res', response);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <BasicInfo control={form.control} currentMode={mode} />
                    <PriceInfo control={form.control} currentMode={mode} />
                    <LocationInfo control={form.control} currentMode={mode} />
                    <OrderUnit control={form.control} currentMode={mode} />
                    <IngredientUnit control={form.control} currentMode={mode} />

                    <Button type="submit" className="w-full">
                        {mode === formType.ADD ? "Create Product" : "Update Product"}
                    </Button>
                </form>
            </Form>

            {/* Debug View */}
            <div className="rounded-lg border p-4 mt-8">
                <h2 className="text-lg font-semibold mb-2">Form State (Debug)</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(form.watch(), null, 2)}
                </pre>
            </div>
        </div>
    );
} 
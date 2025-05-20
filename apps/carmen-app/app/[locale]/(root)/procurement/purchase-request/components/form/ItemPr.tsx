import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { Plus, Trash2, SquarePen } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FormField, FormItem } from "@/components/ui/form";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { PurchaseRequestPostDto } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";
import LocationLookup from "@/components/lookup/LocationLookup";
import { useStoreLocation } from "@/hooks/useStoreLocation";

// Create a type that includes the additional fields needed for display
type FormValues = PurchaseRequestPostDto & {
    purchase_request_detail: {
        add: Array<{
            location_name?: string;
            product_name?: string;
            vendor_name?: string;
            requested_unit_name?: string;
            approved_unit_name?: string;
            location_id: string;
            product_id: string;
            vendor_id: string;
            price_list_id: string;
            description: string;
            requested_qty: number;
            requested_unit_id: string;
            approved_qty: number;
            approved_unit_id: string;
            currency_id: string;
            exchange_rate: number;
            exchange_rate_date: string;
            price: number;
            total_price: number;
            foc: number;
            foc_unit_id: string;
            tax_type_inventory_id: string;
            tax_type: string;
            tax_rate: number;
            tax_amount: number;
            is_tax_adjustment: boolean;
            is_discount: boolean;
            discount_rate: number;
            discount_amount: number;
            is_discount_adjustment: boolean;
            is_active: boolean;
            note: string;
            info: {
                specifications: string;
            };
            dimension: {
                cost_center: string;
                project: string;
            };
        }>;
    };
};

interface ItemPrProps {
    readonly control: Control<FormValues>;
    readonly mode: formType;
}

export default function ItemPr({ mode, control }: ItemPrProps) {
    const { fields, append } = useFieldArray({
        control,
        name: "purchase_request_detail.add",
    });
    const { getCurrencyCode } = useCurrency();
    const { getLocationName } = useStoreLocation();
    const handleAddItem = () => {
        append({
            location_id: "",
            product_id: "",
            vendor_id: "",
            price_list_id: "",
            description: "",
            requested_qty: 0,
            requested_unit_id: "",
            approved_qty: 0,
            approved_unit_id: "",
            currency_id: "",
            exchange_rate: 1,
            exchange_rate_date: new Date().toISOString(),
            price: 0,
            total_price: 0,
            foc: 0,
            foc_unit_id: "",
            tax_type_inventory_id: "",
            tax_type: "",
            tax_rate: 0,
            tax_amount: 0,
            is_tax_adjustment: false,
            is_discount: false,
            discount_rate: 0,
            discount_amount: 0,
            is_discount_adjustment: false,
            is_active: true,
            note: "",
            info: {
                specifications: "",
            },
            dimension: {
                cost_center: "",
                project: "",
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold">Items</h1>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search"
                        className="w-64 h-8"
                    />
                    <Button
                        size={'sm'}
                        disabled={mode === formType.VIEW}
                        onClick={handleAddItem}
                    >
                        <Plus className="h-4 w-4" />
                        Add Item
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-28">Location</TableHead>
                        <TableHead className="w-36">Product Name</TableHead>
                        <TableHead className="w-36">Vendor Name</TableHead>
                        <TableHead className="w-40">Description</TableHead>
                        <TableHead className="w-32">
                            <div className="flex flex-col justify-center items-center">
                                <p>Request Order</p>
                                <p>Qty / Unit</p>
                            </div>
                        </TableHead>
                        <TableHead className="w-32">
                            <div className="flex flex-col justify-center items-center">
                                <p>Approved Order</p>
                                <p>Qty / Unit</p>
                            </div>
                        </TableHead>
                        <TableHead className="w-32">Base Currency</TableHead>
                        <TableHead className="w-32">Price</TableHead>
                        <TableHead className="w-28">Total Price</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.location_id`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            {mode === formType.VIEW ? (
                                                <span>{getLocationName(field.value)}</span>
                                            ) : (
                                                <LocationLookup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.product_id`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "-"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.vendor_id`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "-"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.description`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "-"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.requested_qty`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "0"} </span>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.requested_unit_name`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "-"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.approved_qty`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "0"} </span>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.approved_unit_name`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "-"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.currency_id`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-1">
                                            {mode === formType.VIEW ? (
                                                <span>{getCurrencyCode(field.value)}</span>
                                            ) : (
                                                <CurrencyLookup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.price`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "0"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`purchase_request_detail.add.${index}.total_price`}
                                    render={({ field }) => (
                                        <span>{field.value ?? "0"}</span>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    size={'sm'}
                                    disabled={mode === formType.VIEW}
                                    className="w-7 h-7"
                                    variant={'ghost'}
                                >
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                                <Button
                                    size={'sm'}
                                    disabled={mode === formType.VIEW}
                                    className="w-7 h-7"
                                    variant={'ghost'}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

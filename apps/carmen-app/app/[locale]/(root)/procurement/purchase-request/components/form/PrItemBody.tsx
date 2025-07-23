import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestCreateFormDto, PurchaseRequestDetail, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import {
    MapPin,
    Package,
    Trash2,
} from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import UnitLookup from "@/components/lookup/UnitLookup";
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import DateInput from "@/components/form-custom/DateInput";
import { useAuth } from "@/context/AuthContext";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";

interface PrItemBodyProps {
    readonly item: PurchaseRequestDetail;
    readonly mode: formType;
    readonly index: number;
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
    readonly onDelete?: (item: PurchaseRequestDetail, index: number) => void;
}

export default function PrItemBody({ item, mode, index, form, onDelete }: PrItemBodyProps) {
    const { getCurrencyCode } = useCurrency();
    const { currencyBase } = useAuth();


    const handleDelete = () => {
        if (onDelete) {
            onDelete(item, index);
        }
    };

    return (
        <TableRow key={item.id || index}>
            <TableCell>
                <Checkbox />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                {mode === formType.VIEW ? (
                    <>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-medium">{item.location_name || "-"}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {item.stages_status ? item.stages_status : ''}
                        </p>
                    </>
                ) : (
                    <FormField
                        control={form.control}
                        name={mode === formType.ADD
                            ? `purchase_request_detail.add.${index}.location_id`
                            : `purchase_request_detail.update.${index}.location_id`
                        }
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <LocationLookup
                                        value={field.value ? field.value : item.location_id}
                                        onValueChange={(value) => field.onChange(value)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}
            </TableCell>
            <TableCell>
                {mode === formType.VIEW ? (
                    <>
                        <div className="flex gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">{item.product_name || "-"}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name={mode === formType.ADD
                                ? `purchase_request_detail.add.${index}.product_id`
                                : `purchase_request_detail.update.${index}.product_id`
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ProductLookup
                                            value={field.value ? field.value : item.product_id}
                                            onValueChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={mode === formType.ADD
                                ? `purchase_request_detail.add.${index}.description`
                                : `purchase_request_detail.update.${index}.description`
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Description"
                                            value={field.value || item.description || ""}
                                            onChange={field.onChange}
                                            className="text-sm"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </>
                )}
            </TableCell>
            <TableCell className="text-right">
                {mode === formType.VIEW ? (
                    <>
                        <p className="text-sm text-right font-semibold">
                            {item.requested_qty} {item.requested_unit_name || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            (≈ {item.requested_base_qty} {item.inventory_unit_name || "-"})
                        </p>
                    </>
                ) : (
                    <div className="flex items-center gap-1">
                        <FormField
                            control={form.control}
                            name={mode === formType.ADD
                                ? `purchase_request_detail.add.${index}.requested_qty`
                                : `purchase_request_detail.update.${index}.requested_qty`
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <NumberInput
                                            value={field.value ? field.value : item.requested_qty}
                                            onChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={mode === formType.ADD
                                ? `purchase_request_detail.add.${index}.requested_unit_id`
                                : `purchase_request_detail.update.${index}.requested_unit_id`
                            }
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <UnitLookup
                                            value={field.value ? field.value : item.requested_unit_id}
                                            onValueChange={(value) => field.onChange(value)} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </TableCell>
            <TableCell className="w-[40px] text-right">
                {mode !== formType.EDIT ? (
                    <>
                        <p className="text-sm text-right font-semibold">
                            {item.approved_qty} {item.approved_unit_name || "-"}
                        </p>
                        <Separator />
                        <p className="text-xs font-semibold text-blue-500">
                            FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                        </p>
                    </>
                ) : (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.update.${index}.approved_qty`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <NumberInput
                                                value={field.value ? field.value : item.approved_qty}
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.update.${index}.approved_unit_id`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <UnitLookup
                                                value={field.value ? field.value : item.approved_unit_id}
                                                onValueChange={(value) => field.onChange(value)} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            FOC:
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.update.${index}.foc_qty`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <NumberInput
                                                value={field.value ? field.value : item.foc_qty}
                                                onChange={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.update.${index}.foc_unit_id`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <UnitLookup
                                                value={field.value ? field.value : item.foc_unit_id}
                                                onValueChange={(value) => field.onChange(value)} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}
            </TableCell>
            <TableCell className="text-right">
                {mode === formType.VIEW ? (
                    <>
                        <p className="text-sm text-right font-semibold">
                            {getCurrencyCode(item.currency_id)} {item.total_price}
                        </p>
                        <p className="text-xs font-semibold text-blue-500">
                            {currencyBase?.name} {item.base_total_price || 0}
                        </p>
                    </>
                ) : (
                    <div className="flex items-center gap-1">
                        <FormField
                            control={form.control}
                            name={`purchase_request_detail.update.${index}.currency_id`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <CurrencyLookup
                                            value={field.value ? field.value : item.currency_id}
                                            onValueChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`purchase_request_detail.update.${index}.total_price`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <NumberInput
                                            value={field.value ? field.value : item.total_price}
                                            onChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </TableCell>
            <TableCell className="text-right">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    type="button"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    )
}
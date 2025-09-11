import { formType } from "@/dtos/form.dto";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { GrnDetailItem } from "@/types/grn-api.types";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Edit,
    Trash2,
    Plus,
    Filter,
    CheckCircle,
    XCircle,
    FileText,
    Split,
} from "lucide-react";
import { useEffect, useState } from "react";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useTranslations } from "next-intl";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductQuery } from "@/hooks/useProductQuery";
import { useAuth } from "@/context/AuthContext";
import { useLocationQuery } from "@/hooks/use-location";
import { useUnitQuery } from "@/hooks/use-unit";

interface ItemGrnProps {
    readonly control: Control<CreateGRNDto>;
    readonly mode: formType;
    readonly grnItems: GrnDetailItem[];
}

export default function ItemGrn({ control, mode, grnItems }: ItemGrnProps) {
    const { token, buCode } = useAuth();
    const tCommon = useTranslations("Common");
    const [bulkAction, setBulkAction] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    const { getProductName } = useProductQuery({
        token,
        buCode,
    });

    const { getLocationName } = useLocationQuery(token, buCode);
    const { getUnitName } = useUnitQuery({
        token,
        buCode,
    });

    const handleSelectItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === grnItems.length) {
            setSelectedItems([]);
        } else {
            const allIds = grnItems.map((item) => item.id ?? "").filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    useEffect(() => {
        setBulkAction(selectedItems.length > 0);
    }, [selectedItems]);

    const isAllSelected = grnItems.length > 0 && selectedItems.length === grnItems.length;
    const isDisabled = mode === formType.VIEW;

    return (
        <div className="space-y-2">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                    <p className="text-base font-medium px-2">Items Details</p>
                    {bulkAction && (
                        <div className="flex flex-row items-center justify-between gap-1">
                            <Button size="sm">
                                <CheckCircle className="h-3 w-3" />
                                Approve
                            </Button>
                            <Button variant="outline" size="sm">
                                <XCircle className="h-3 w-3" />
                                Reject
                            </Button>
                            <Button variant="outline" size="sm">
                                <FileText className="h-3 w-3" />
                                Review
                            </Button>
                            <Button variant="outline" size="sm">
                                <Split className="h-3 w-3" />
                                Split
                            </Button>
                        </div>
                    )}
                </div>
                <div
                    className={`flex flex-row items-center ${bulkAction ? "justify-between" : "justify-end"}`}
                >
                    <div className="flex flex-row items-center gap-1">
                        <SearchInput
                            defaultValue={search}
                            onSearch={setSearch}
                            placeholder={tCommon("search")}
                            data-id="grn-item-search-input"
                            containerClassName="w-full"
                        />
                        <Button size="sm" type="button">
                            <Filter className="h-3 w-3" />
                        </Button>
                        {!isDisabled && (
                            <Button size="sm" type="button">
                                <Plus className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
                {/* <pre>{JSON.stringify(grnItems, null, 2)}</pre> */}
            </div>
            <Table>
                <TableHeader className="bg-muted/80">
                    <TableRow>
                        {!isDisabled && (
                            <TableHead className="w-10">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onClick={handleSelectAll}
                                    aria-label="Select all items"
                                />
                            </TableHead>
                        )}
                        <TableHead>Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Ordered</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">FOC</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Tax Amount</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        {/* <TableHead>Expired Date</TableHead> */}
                        {!isDisabled && (
                            <TableHead className="text-right">Actions</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {grnItems.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={isDisabled ? 9 : 10} className="text-center">No items found</TableCell>
                        </TableRow>
                    ) : (
                        grnItems.map((item: GrnDetailItem) => (
                            <TableRow key={item.id}>
                                {!isDisabled && (
                                    <TableCell
                                        className="w-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Checkbox
                                            id={`checkbox-${item.id}`}
                                            checked={selectedItems.includes(item.id ?? "")}
                                            onClick={() => item.id && handleSelectItem(item.id)}
                                            aria-label={`Select ${item.product_name}`}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>{item.location_name}</TableCell>
                                <TableCell>
                                    {item.product_name}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.order_qty || 0} {item.order_unit_name}
                                </TableCell>
                                <TableCell className="text-right">
                                    <p>{item.received_qty || 0} {item.received_unit_name}</p>
                                    <p className="text-[12px] text-muted-foreground">
                                        Base: {item.base_qty}
                                    </p>
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.foc_qty} {item.foc_unit_name}
                                </TableCell>
                                <TableCell className="text-right">{item.price || 0}</TableCell>
                                <TableCell className="text-right">{item.discount_amount || 0}</TableCell>
                                <TableCell className="text-right">{item.tax_amount || 0}</TableCell>
                                <TableCell className="text-right">{item.total_amount || 0}</TableCell>
                                {!isDisabled && (
                                    <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetailItemDto } from "@/dtos/pr.dto";
import {
  CheckCircle,
  Edit,
  FileText,
  Filter,
  Plus,
  Split,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProduct from "@/hooks/useProduct";
import { useUnit } from "@/hooks/useUnit";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";

interface ItemPrProps {
  readonly itemsPr: (PurchaseRequestDetailItemDto & { id: string })[];
  readonly mode: formType;
  readonly openDetail: (
    e: React.MouseEvent,
    data: PurchaseRequestDetailItemDto & { id?: string }
  ) => void;
  readonly onDeleteItem?: (itemId: string) => void;
}

export default function ItemPr({
  itemsPr,
  mode,
  openDetail,
  onDeleteItem,
}: ItemPrProps) {
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useURL("search");
  const isDisabled = mode === formType.VIEW;
  const { getProductName } = useProduct();
  const { getUnitName } = useUnit();
  const { getLocationName } = useStoreLocation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState(false);

  // Create empty item template for new items
  const handleAddNewItem = (e: React.MouseEvent) => {
    // Create empty item without ID - the reducer will generate UUID
    const emptyItem: Omit<PurchaseRequestDetailItemDto, "id"> = {
      location_id: "",
      product_id: "",
      vendor_id: "",
      price_list_id: "",
      description: "",
      requested_qty: 0,
      requested_unit_id: "",
      approved_qty: 0,
      approved_unit_id: "",
      approved_base_qty: 0,
      approved_base_unit_id: "",
      approved_conversion_rate: 0,
      requested_conversion_rate: 0,
      requested_base_qty: 0,
      requested_base_unit_id: "",
      currency_id: "",
      exchange_rate: 1.0,
      exchange_rate_date: new Date().toISOString(),
      price: 0.0,
      total_price: 0.0,
      foc: 0,
      foc_unit_id: "",
      tax_type: "include",
      tax_rate: 0.0,
      tax_amount: 0.0,
      is_tax_adjustment: false,
      is_discount: false,
      discount_rate: 0.0,
      discount_amount: 0.0,
      is_discount_adjustment: false,
      is_active: true,
      note: "",
      info: {
        specifications: "",
      },
      dimension: {
        project: "",
        cost_center: "",
      },
      delivery_date: new Date().toISOString(),
      delivery_point_id: "",
      delivery_point_name: "",
    };

    console.log("Creating new item without ID");
    openDetail(e, emptyItem as PurchaseRequestDetailItemDto & { id?: string });
  };

  const handleDeleteItem = (itemId: string) => {
    if (onDeleteItem) {
      onDeleteItem(itemId);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setBulkAction(true);
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckboxAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBulkAction(true);
    if (selectedItems.length === itemsPr.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemsPr.map((item) => item.id));
    }
  };

  const isAllSelected =
    itemsPr.length > 0 && selectedItems.length === itemsPr.length;

  useEffect(() => {
    if (selectedItems.length === 0) {
      setBulkAction(false);
    }
  }, [selectedItems]);

  return (
    <Card>
      <CardHeader className="p-4">
        <p className="text-sm font-medium px-2">Items Details</p>

        <div
          className={`flex flex-row items-center ${bulkAction ? "justify-between" : "justify-end"}`}
        >
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

          <div className="flex flex-row items-center gap-1">
            <SearchInput
              defaultValue={search}
              onSearch={setSearch}
              placeholder={tCommon("search")}
              data-id="purchase-request-item-search-input"
              containerClassName="w-full"
            />
            <Button size="sm">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            {!isDisabled && (
              <Button
                size="sm"
                onClick={handleAddNewItem}
              >
                <Plus className="h-3 w-3" />
                Add Item
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Table>
          <TableHeader className="bg-muted/80">
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onClick={(e) => handleCheckboxAll(e)}
                  aria-label="Select all purchase requests"
                />
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Requested</TableHead>
              <TableHead className="text-right">Approved</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {!isDisabled && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsPr.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No items added yet.
                </TableCell>
              </TableRow>
            ) : (
              itemsPr.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-10">
                    <Checkbox
                      id={`checkbox-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCheckboxChange(item.id);
                      }}
                      aria-label={`Select ${item.description}`}
                    />
                  </TableCell>
                  <TableCell>{getLocationName(item.location_id)}</TableCell>
                  <TableCell>
                    <p>{getProductName(item.product_id)}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p>
                        {item.requested_qty}{" "}
                        {getUnitName(item.requested_unit_id)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        {item.requested_base_qty}{" "}
                        {getUnitName(item.requested_base_unit_id)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p>
                        {item.approved_qty} {getUnitName(item.approved_unit_id)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        {item.approved_base_qty}{" "}
                        {getUnitName(item.approved_base_unit_id)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.price} {item.currency_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.total_price} {item.currency_name}
                  </TableCell>
                  {!isDisabled && (
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => openDetail(e, item)}
                          className="h-8 w-8"
                          disabled={isDisabled}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => item.id && handleDeleteItem(item.id)}
                          className="h-8 w-8"
                          disabled={!item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

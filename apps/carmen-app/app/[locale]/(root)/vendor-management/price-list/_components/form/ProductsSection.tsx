"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Trash2 } from "lucide-react";
import type { PriceListFormData, PriceListDetailItem } from "../../_schema/price-list.schema";
import LookupProduct from "@/components/lookup/LookupProduct";
import LookupUnit from "@/components/lookup/LookupUnit";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
import { useProductQuery } from "@/hooks/use-product-query";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ProductsSectionProps {
  form: UseFormReturn<PriceListFormData>;
  isViewMode: boolean;
}

export default function ProductsSection({ form, isViewMode }: ProductsSectionProps) {
  const { token, buCode } = useAuth();
  const { products: productList } = useProductQuery({ token, buCode });

  const { fields, prepend, remove, update } = useFieldArray({
    control: form.control,
    name: "pricelist_detail",
  });

  const handleAddProduct = () => {
    const newItem: PriceListDetailItem = {
      sequence_no: fields.length + 1,
      product_id: "",
      unit_id: "",
      tax_profile_id: "",
      tax_rate: 0,
      moq_qty: 1,
      _action: "add",
    };
    prepend(newItem);
  };

  const isExistingItem = (item: (typeof fields)[number]) => {
    return item._action === "none" || item._action === "update" || item._action === "remove";
  };

  const handleRemoveProduct = (index: number) => {
    const item = fields[index];
    if (isExistingItem(item)) {
      update(index, { ...item, _action: "remove" });
    } else {
      remove(index);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = productList?.data?.find((p: any) => p.id === productId);
    const currentItem = fields[index];

    const newAction = currentItem._action === "none" ? "update" : currentItem._action;

    update(index, {
      ...currentItem,
      product_id: productId,
      product_name: product?.name || "",
      product_code: product?.code || "",
      _action: newAction,
    });
  };

  const handleFieldChange = (index: number, field: keyof PriceListDetailItem, value: any) => {
    const currentItem = fields[index];
    const newAction = currentItem._action === "none" ? "update" : currentItem._action;
    update(index, {
      ...currentItem,
      [field]: value,
      _action: newAction,
    });
  };
  const handleMultipleFieldChange = (index: number, changes: Partial<PriceListDetailItem>) => {
    const currentItem = fields[index];
    const newAction = currentItem._action === "none" ? "update" : currentItem._action;

    update(index, {
      ...currentItem,
      ...changes,
      _action: newAction,
    });
  };

  const visibleCount = fields.filter((field) => field._action !== "remove").length;

  return (
    <div className="space-y-4">
      {!isViewMode && (
        <div className="flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        </div>
      )}

      {visibleCount > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="min-w-[200px]">Product</TableHead>
                <TableHead className="w-[120px]">Unit</TableHead>
                <TableHead className="w-[150px]">Tax Profile</TableHead>
                <TableHead className="w-[100px]">MOQ</TableHead>
                {!isViewMode && <TableHead className="w-[60px]" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                if (field._action === "remove") return null;

                return (
                  <TableRow
                    key={field.id}
                    className={cn(
                      field._action === "add" && "bg-green-50/50",
                      field._action === "update" && "bg-yellow-50/50"
                    )}
                  >
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      {isViewMode ? (
                        <span>
                          {field.product_code} - {field.product_name}
                        </span>
                      ) : (
                        <LookupProduct
                          value={field.product_id}
                          onValueChange={(val) => handleProductChange(index, val)}
                          placeholder="Select Product"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isViewMode ? (
                        <span>{field.unit_name || "-"}</span>
                      ) : (
                        <LookupUnit
                          value={field.unit_id || ""}
                          onValueChange={(val) => handleFieldChange(index, "unit_id", val)}
                          placeholder="Select Unit"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isViewMode ? (
                        <span>{field.tax_profile_name || "-"}</span>
                      ) : (
                        <LookupTaxProfile
                          value={field.tax_profile_id || ""}
                          onValueChange={(val) => handleFieldChange(index, "tax_profile_id", val)}
                          onSelectObject={(obj) => {
                            handleMultipleFieldChange(index, {
                              tax_profile_id: obj.id,
                              tax_rate: obj.tax_rate,
                            });
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isViewMode ? (
                        <span>{field.moq_qty || 0}</span>
                      ) : (
                        <Input
                          type="number"
                          value={field.moq_qty || 0}
                          onChange={(e) =>
                            handleFieldChange(index, "moq_qty", Number(e.target.value))
                          }
                          className="w-full"
                          min={0}
                        />
                      )}
                    </TableCell>
                    {!isViewMode && (
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
          <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-medium mb-1">No Products</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-4">
            Click the button below to add products to this price list.
          </p>
          {!isViewMode && (
            <Button type="button" variant="outline" size="sm" onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

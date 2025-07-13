"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { useCurrency } from "@/hooks/useCurrency";
import useProduct from "@/hooks/useProduct";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import { useUnit } from "@/hooks/useUnit";
import {
  BoxIcon,
  Building,
  Check,
  MapPin,
  MessageCircle,
  Plus,
  SquarePen,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItemPrProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly itemsPr: (any & { id: string })[];
  readonly mode: formType;
  readonly onEditItems: () => void;
}

export default function ItemPrDetails({ itemsPr, onEditItems }: ItemPrProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [displayItems, setDisplayItems] = useState(itemsPr);
  const [newRowData, setNewRowData] = useState({
    location: "",
    product: "",
    requested_qty: "",
    price: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editRowData, setEditRowData] = useState<any>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const { getProductName } = useProduct();
  const { getUnitName } = useUnit();
  const { getLocationName } = useStoreLocation();
  const { getCurrencyCode } = useCurrency();

  useEffect(() => {
    setDisplayItems(itemsPr);
  }, [itemsPr]);

  const handleAddItem = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewRowData({
      location: "",
      product: "",
      requested_qty: "",
      price: "",
    });
  };

  const handleConfirmAdd = () => {
    const newItem = {
      id: crypto.randomUUID(),
      _location_name: newRowData.location,
      _product_name: newRowData.product,
      _unit_name: "units",
      _currency_code: "THB",
      description: "Newly added item",
      requested_qty: newRowData.requested_qty || 0,
      approved_qty: 0,
      price: newRowData.price || 0,
      delivery_date: new Date(),
      delivery_point_name: "Default",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setDisplayItems((prevItems: any) => [...prevItems, newItem]);
    setIsAdding(false);
    setNewRowData({
      location: "",
      product: "",
      requested_qty: "",
      price: "",
    });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditRowData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRowData(null);
  };

  const handleConfirmEdit = () => {
    if (!editRowData) return;
    setDisplayItems(
      displayItems.map((item) => (item.id === editingId ? editRowData : item))
    );
    setEditingId(null);
    setEditRowData(null);
  };

  const handleEditInputChange = (field: string, value: string | number) => {
    if (!editRowData) return;

    // Create a new object for the updated data
    const updatedData = { ...editRowData };

    // Use temporary `_` prefixed properties for names to align with `add` functionality
    if (field === "location") {
      updatedData._location_name = value;
      // Optionally nullify id if name is manually edited
      // updatedData.location_id = null;
    } else if (field === "product") {
      updatedData._product_name = value;
      // updatedData.product_id = null;
    } else {
      updatedData[field] = value;
    }

    setEditRowData(updatedData);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId) return;
    setDisplayItems(displayItems.filter((item) => item.id !== deleteItemId));
    setDeleteItemId(null);
  };

  return (
    <>
      <div className="space-y-6 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Purchase Request Items</h2>
            <Badge variant="secondary" className="text-xs">
              {displayItems.length} items
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-items">Edit Mode</Label>
              <Checkbox id="edit-items" onCheckedChange={onEditItems} />
            </div>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <Plus />
              Add item
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead className="w-[250px]">Location & Status</TableHead>
              <TableHead className="w-[250px]">Product Details</TableHead>
              <TableHead className="text-right w-[100px]">Requested</TableHead>
              <TableHead className="text-right w-[100px]">Approved</TableHead>
              <TableHead className="text-right w-[100px]">More</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell>
                  <Input
                    placeholder="Location"
                    value={newRowData.location}
                    onChange={(e) =>
                      setNewRowData({ ...newRowData, location: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Product Details"
                    value={newRowData.product}
                    onChange={(e) =>
                      setNewRowData({ ...newRowData, product: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    placeholder="Requested Qty"
                    className="text-right"
                    value={newRowData.requested_qty}
                    onChange={(e) =>
                      setNewRowData({
                        ...newRowData,
                        requested_qty: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell />
                <TableCell className="text-right">
                  <Input
                    placeholder="Price"
                    className="text-right"
                    value={newRowData.price}
                    onChange={(e) =>
                      setNewRowData({ ...newRowData, price: e.target.value })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleConfirmAdd}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {displayItems.map((item, index) => {
              const isEditing = editingId === item.id;

              return isEditing ? (
                <TableRow key={`editing-${item.id}`}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      value={
                        editRowData?._location_name ??
                        getLocationName(editRowData?.location_id)
                      }
                      onChange={(e) =>
                        handleEditInputChange("location", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={
                        editRowData?._product_name ??
                        getProductName(editRowData?.product_id)
                      }
                      onChange={(e) =>
                        handleEditInputChange("product", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      className="text-right"
                      value={editRowData?.requested_qty}
                      onChange={(e) =>
                        handleEditInputChange("requested_qty", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <p>{item.approved_qty}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      className="text-right"
                      value={editRowData?.price}
                      onChange={(e) =>
                        handleEditInputChange("price", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleConfirmEdit}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <React.Fragment key={item.id}>
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" />
                          <p className="text-sm font-semibold">
                            {item._location_name ||
                              getLocationName(item.location_id)}
                          </p>
                        </div>
                        <Badge
                          variant={"secondary"}
                          className="w-28 flex items-center gap-2"
                        >
                          <Timer className="w-3 h-3" />
                          ไอเทม status
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" />
                          <p className="text-sm font-semibold">
                            {item._product_name ||
                              getProductName(item.product_id)}
                          </p>
                        </div>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p>
                        {item.requested_qty}{" "}
                        {item._unit_name || getUnitName(item.requested_unit_id)}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p>
                        {item.approved_qty}{" "}
                        {item._unit_name || getUnitName(item.approved_unit_id)}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p>
                        {item.price}{" "}
                        {item._currency_code ||
                          getCurrencyCode(item.currency_id)}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <SquarePen />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteItemId(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <tr>
                    <td colSpan={8} className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${item.id}`}>
                          <div className="flex justify-between items-start w-full px-2 py-4">
                            <div className="flex gap-4 items-start w-1/2">
                              <AccordionTrigger
                                iconPosition="left"
                                className="p-0 h-5"
                              />
                              <div className="space-y-1">
                                <p className="text-sm">Comment</p>
                                <div className="flex items-center gap-2 border-l-2 border-blue-500 pl-2">
                                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                                  <p className="text-sm text-blue-500">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                  On Hand
                                </p>
                                <Input
                                  value={"10 gram"}
                                  className="h-6 bg-green-100 text-green-700 font-semibold text-right"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                  On Order
                                </p>
                                <Input
                                  value={"12 gram"}
                                  className="h-6 bg-blue-100 text-blue-700 font-semibold text-right"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                  Date Required
                                </p>
                                <p className="font-semibold text-xs">
                                  {format(item.delivery_date, "dd/MM/yyyy")}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground">
                                  Delivery Point
                                </p>
                                <p className="font-semibold text-xs">
                                  {item.delivery_point_name}
                                </p>
                              </div>
                            </div>
                          </div>
                          <AccordionContent className="p-4 space-y-4 bg-muted">
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <BoxIcon className="text-green-500" />
                                  Inventory Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-4 gap-4">
                                <Card className="flex items-center justify-center h-20 bg-blue-50 border border-blue-200">
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-bold text-blue-700">
                                      12 Gram
                                    </p>
                                    <p className="text-xs font-medium text-blue-600">
                                      On Hand
                                    </p>
                                  </div>
                                </Card>
                                <Card className="flex items-center justify-center h-20 bg-orange-50 border border-orange-200">
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-bold text-orange-700">
                                      12 Gram
                                    </p>
                                    <p className="text-xs font-medium text-orange-600">
                                      On Order
                                    </p>
                                  </div>
                                </Card>
                                <Card className="flex items-center justify-center h-20 bg-yellow-50 border border-yellow-200">
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-bold text-yellow-700">
                                      12 Gram
                                    </p>
                                    <p className="text-xs font-medium text-yellow-600">
                                      Reorder Level
                                    </p>
                                  </div>
                                </Card>
                                <Card className="flex items-center justify-center h-20 bg-purple-50 border border-purple-200">
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="text-lg font-bold text-purple-700">
                                      12 Gram
                                    </p>
                                    <p className="text-xs font-medium text-purple-600">
                                      Restock Level
                                    </p>
                                  </div>
                                </Card>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Building className="text-purple-500" />
                                  Business Dimensions
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Job number</Label>
                                  <p>FB-2024-INTL-001</p>
                                </div>
                                <div>
                                  <Label>Event</Label>
                                  <p>WORLD-FOOD-FESTIVAL</p>
                                </div>
                                <div>
                                  <Label>Project</Label>
                                  <p>PROJ007</p>
                                </div>
                                <div>
                                  <Label>Market Segment</Label>
                                  <p>HOSPITALITY</p>
                                </div>
                              </CardContent>
                            </Card>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
        {/* <JsonViewer data={displayItems} /> */}
      </div>
      <AlertDialog
        open={deleteItemId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItemId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

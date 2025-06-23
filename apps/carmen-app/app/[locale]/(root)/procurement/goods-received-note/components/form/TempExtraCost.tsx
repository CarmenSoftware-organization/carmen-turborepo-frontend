"use client";

import { Control, useFieldArray, useForm } from "react-hook-form";
import {
  CreateGRNDto,
  ExtraCostDetailItemDto,
  extraCostSchema,
} from "@/dtos/grn.dto";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formType } from "@/dtos/form.dto";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import TaxTypeLookup from "@/components/lookup/TaxTypeLookup";
import { ALLOCATE_EXTRA_COST_TYPE, TaxType } from "@/constants/enum";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

interface ExtraCostProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
}

interface ExtraCostDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (data: ExtraCostDetailItemDto) => void;
  readonly initialData?: Partial<ExtraCostDetailItemDto>;
}

function ExtraCostDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
}: ExtraCostDialogProps) {
  const form = useForm<ExtraCostDetailItemDto>({
    resolver: zodResolver(extraCostSchema),
    defaultValues: initialData || {
      extra_cost_detail: {
        add: [
          {
            id: undefined,
            extra_cost_type_id: undefined,
            amount: undefined,
            tax_type_inventory_id: undefined,
            tax_type: undefined,
            tax_rate: undefined,
            tax_amount: undefined,
            is_tax_adjustment: false,
            note: undefined,
          },
        ],
        update: [],
        delete: [],
      },
      name: "",
      allocate_extra_cost_type: ALLOCATE_EXTRA_COST_TYPE.MANUAL,
      note: "",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset(initialData);
    }
  }, [form, initialData, open]);

  const onSubmit = (data: ExtraCostDetailItemDto) => {
    onSave(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b pb-2 flex-shrink-0">
          <DialogTitle className="text-lg font-medium">
            {initialData ? "Edit Extra Cost" : "Add Extra Cost"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-4 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Extra Cost Name</Label>
                        <FormControl>
                          <Input placeholder="Extra Cost Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allocate_extra_cost_type"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Allocation Type</Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select allocation type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={ALLOCATE_EXTRA_COST_TYPE.MANUAL}
                              >
                                Manual
                              </SelectItem>
                              <SelectItem
                                value={ALLOCATE_EXTRA_COST_TYPE.BY_VALUE}
                              >
                                By Value
                              </SelectItem>
                              <SelectItem
                                value={ALLOCATE_EXTRA_COST_TYPE.BY_QTY}
                              >
                                By Qty
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Note</Label>
                      <FormControl>
                        <Input placeholder="Note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="extra_cost_detail.add.0.extra_cost_type_id"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Extra Cost Type ID</Label>
                        <FormControl>
                          <Input placeholder="Extra Cost Type ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="extra_cost_detail.add.0.amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Amount</Label>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="extra_cost_detail.add.0.tax_type_inventory_id"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Tax Type Inventory ID</Label>
                        <FormControl>
                          <TaxTypeLookup
                            onValueChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="extra_cost_detail.add.0.tax_type"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Tax Type</Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tax type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={TaxType.NONE}>
                                ไม่มีภาษี
                              </SelectItem>
                              <SelectItem value={TaxType.INCLUDED}>
                                รวมภาษี
                              </SelectItem>
                              <SelectItem value={TaxType.ADD}>
                                เพิ่มภาษี
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="extra_cost_detail.add.0.tax_rate"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Tax Rate (%)</Label>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="extra_cost_detail.add.0.tax_amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Tax Amount</Label>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="extra_cost_detail.add.0.is_tax_adjustment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Tax Adjustment</Label>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extra_cost_detail.add.0.note"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Note</Label>
                      <FormControl>
                        <Input placeholder="Note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {initialData ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ExtraCostDetail({
  control,
  mode,
}: {
  control: Control<CreateGRNDto>;
  mode: formType;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "extra_cost.extra_cost_detail.add" as const,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<
    Partial<ExtraCostDetailItemDto> | undefined
  >(undefined);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const item = fields[index];
    setEditingData({
      extra_cost_detail: {
        add: [item],
        update: [],
        delete: [],
      },
      name: "",
      allocate_extra_cost_type: ALLOCATE_EXTRA_COST_TYPE.MANUAL,
      note: "",
    });
    setDialogOpen(true);
  };

  const handleAddExtraCost = (data: ExtraCostDetailItemDto) => {
    if (editingIndex !== null) {
      // Update existing item
      const updatedFields = [...fields];
      updatedFields[editingIndex] = {
        ...updatedFields[editingIndex],
        ...data.extra_cost_detail.add[0],
      };
      remove(editingIndex);
      append(updatedFields[editingIndex]);
      setEditingIndex(null);
      setEditingData(undefined);
    } else {
      // Add new item
      append({
        ...data.extra_cost_detail.add[0],
        id: uuidv4(), // Add unique ID for each item
      });
    }
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingIndex(null);
    setEditingData(undefined);
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setEditingData({
      extra_cost_detail: {
        add: [
          {
            id: undefined,
            extra_cost_type_id: undefined,
            amount: undefined,
            tax_type_inventory_id: undefined,
            tax_type: undefined,
            tax_rate: undefined,
            tax_amount: undefined,
            is_tax_adjustment: false,
            note: undefined,
          },
        ],
        update: [],
        delete: [],
      },
      name: "",
      allocate_extra_cost_type: ALLOCATE_EXTRA_COST_TYPE.MANUAL,
      note: "",
    });
    setDialogOpen(true);
  };

  const handleEditClick = (index: number) => {
    handleEdit(index);
  };

  const handleDeleteClick = (index: number) => {
    handleDelete(index);
  };

  const renderActionButtons = (index: number) => {
    if (mode === formType.VIEW) {
      return null;
    }

    return (
      <TableCell className="text-right space-x-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => handleEditClick(index)}
        >
          Edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteClick(index)}
          className="text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    );
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className="text-left">Extra Cost Type ID</TableHead>
        <TableHead className="text-left">Amount</TableHead>
        <TableHead className="text-left">Tax Type Inventory ID</TableHead>
        <TableHead className="text-left">Tax Type</TableHead>
        <TableHead className="text-right">Tax Rate</TableHead>
        <TableHead className="text-right">Tax Amount</TableHead>
        <TableHead className="text-center">Tax Adjustment</TableHead>
        <TableHead className="text-left">Note</TableHead>
        {mode !== formType.VIEW && (
          <TableHead className="text-right">Action</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );

  const renderTableBody = () => (
    <TableBody>
      {fields.length === 0 ? (
        <TableRow>
          <TableCell colSpan={10} className="text-center">
            No extra cost details added
          </TableCell>
        </TableRow>
      ) : (
        fields.map((field, index) => (
          <TableRow key={field.id}>
            <TableCell className="text-left">
              {field.extra_cost_type_id}
            </TableCell>
            <TableCell className="text-left">{field.amount}</TableCell>
            <TableCell className="text-left">
              {field.tax_type_inventory_id}
            </TableCell>
            <TableCell className="text-left">{field.tax_type}</TableCell>
            <TableCell className="text-right">{field.tax_rate}%</TableCell>
            <TableCell className="text-right">{field.tax_amount}</TableCell>
            <TableCell className="text-center">
              {field.is_tax_adjustment ? "Yes" : "No"}
            </TableCell>
            <TableCell className="text-left">{field.note}</TableCell>
            {renderActionButtons(index)}
          </TableRow>
        ))
      )}
    </TableBody>
  );

  const renderAddButton = () => (
    <div className="flex justify-between items-center p-2">
      <p className="text-base font-medium">Extra Cost Details</p>
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={handleAddNew}
        disabled={mode === formType.VIEW}
      >
        <Plus />
        Add Detail
      </Button>
    </div>
  );

  const renderDialog = () => (
    <ExtraCostDialog
      open={dialogOpen}
      onOpenChange={handleCloseDialog}
      onSave={handleAddExtraCost}
      initialData={editingData}
    />
  );

  const renderTable = () => (
    <Table>
      {renderTableHeader()}
      {renderTableBody()}
    </Table>
  );

  const renderContent = () => (
    <div className="p-2 space-y-2">
      {renderAddButton()}
      {renderTable()}
      {renderDialog()}
    </div>
  );

  return renderContent();
}

export default function ExtraCost({ control, mode }: ExtraCostProps) {
  return (
    <div className="p-2 space-y-2">
      <div className="flex justify-between items-center p-2">
        <p className="text-base font-medium">Extra Costs</p>
      </div>
      <div className="border rounded-lg p-4 space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-4 p-2">
          <FormField
            control={control}
            name="extra_cost.name"
            render={({ field: { value, ...fieldProps } }) => (
              <FormItem>
                <Label>Extra Cost Name</Label>
                <FormControl>
                  {mode === formType.VIEW ? (
                    <p className="text-xs">{value}</p>
                  ) : (
                    <Input
                      placeholder="Extra Cost Name"
                      value={value?.toString() || ""}
                      {...fieldProps}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="extra_cost.allocate_extra_cost_type"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <Label>Allocation Type</Label>
                <FormControl>
                  {mode === formType.VIEW ? (
                    <p className="text-xs">{value}</p>
                  ) : (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allocation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.MANUAL}>
                          Manual
                        </SelectItem>
                        <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.BY_VALUE}>
                          By Value
                        </SelectItem>
                        <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.BY_QTY}>
                          By Qty
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="p-2">
          <FormField
            control={control}
            name="extra_cost.note"
            render={({ field: { value, ...fieldProps } }) => (
              <FormItem>
                <Label>Extra Cost Note</Label>
                <FormControl>
                  {mode === formType.VIEW ? (
                    <p className="text-xs">{value}</p>
                  ) : (
                    <Input
                      placeholder="Extra Cost Note"
                      value={value?.toString() || ""}
                      {...fieldProps}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <ExtraCostDetail control={control} mode={mode} />
      </div>
    </div>
  );
}

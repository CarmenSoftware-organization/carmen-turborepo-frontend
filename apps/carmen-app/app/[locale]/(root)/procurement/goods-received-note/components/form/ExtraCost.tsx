import { Control, useFieldArray } from "react-hook-form";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { formType } from "@/dtos/form.dto";
import { ALLOCATE_EXTRA_COST_TYPE, TaxType } from "@/constants/enum";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ExtraCostProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
}

interface ExtraCostDetailProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
}

function ExtraCostDetail({ control, mode }: ExtraCostDetailProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "extra_cost.extra_cost_detail.add",
  });

  const handleAddNewDetail = () => {
    append({
      extra_cost_type_id: "59628ab6-55d8-41b4-ac8c-0491ac84a538",
      amount: 0,
      tax_type_inventory_id: "5f1cded9-e1fe-474a-bbbf-f5dfb26308e9",
      tax_type: TaxType.NONE,
      tax_rate: 0,
      tax_amount: 0,
      is_tax_adjustment: false,
      note: "",
    });
  };

  const handleRemoveDetail = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Extra Cost Detail</h3>
        {mode !== formType.VIEW && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddNewDetail();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Extra Cost Detail
          </Button>
        )}
      </div>

      {fields.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extra Cost Type ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax Type Inventory ID</TableHead>
                <TableHead>Tax Type</TableHead>
                <TableHead>Tax Rate (%)</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Is Tax Adjustment</TableHead>
                <TableHead>Note</TableHead>
                {mode !== formType.VIEW && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.extra_cost_type_id`}
                      render={({ field: inputField }) => (
                        <Input
                          {...inputField}
                          placeholder="Extra Cost Type ID"
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.amount`}
                      render={({ field: inputField }) => (
                        <Input
                          {...inputField}
                          type="number"
                          placeholder="0.00"
                          onChange={(e) =>
                            inputField.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_type_inventory_id`}
                      render={({ field: inputField }) => (
                        <Input
                          {...inputField}
                          placeholder="Tax Type Inventory ID"
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_type`}
                      render={({ field: inputField }) => (
                        <Select
                          onValueChange={inputField.onChange}
                          value={inputField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภทภาษี" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaxType.NONE}>None</SelectItem>
                            <SelectItem value={TaxType.INCLUDED}>
                              Included
                            </SelectItem>
                            <SelectItem value={TaxType.ADD}>Add</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_rate`}
                      render={({ field: inputField }) => (
                        <Input
                          {...inputField}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            inputField.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_amount`}
                      render={({ field: inputField }) => (
                        <Input
                          {...inputField}
                          type="number"
                          placeholder="0.00"
                          onChange={(e) =>
                            inputField.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.is_tax_adjustment`}
                      render={({ field: inputField }) => (
                        <Checkbox
                          checked={inputField.value}
                          onCheckedChange={inputField.onChange}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.note`}
                      render={({ field: inputField }) => (
                        <Input {...inputField} placeholder="หมายเหตุ" />
                      )}
                    />
                  </TableCell>
                  {mode !== formType.VIEW && (
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveDetail(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {fields.length === 0 && (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p>No extra cost detail</p>
          {mode !== formType.VIEW && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddNewDetail();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Extra Cost Detail
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExtraCost({ control, mode }: ExtraCostProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="extra_cost.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Cost Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Extra Cost Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="extra_cost.allocate_extra_cost_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocate Extra Cost Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Allocate Extra Cost Type" />
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="extra_cost.note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Note</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter Note" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ExtraCostDetail control={control} mode={mode} />
    </div>
  );
}

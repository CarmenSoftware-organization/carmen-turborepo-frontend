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
import NumberInput from "@/components/form-custom/NumberInput";
import ExtraCostTypeLookup from "@/components/lookup/ExtraCostTypeLookup";
import TaxTypeLookup from "@/components/lookup/TaxTypeLookup";

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
      extra_cost_type_id: "",
      amount: 0,
      tax_type_inventory_id: "",
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
        <h3 className="text-lg font-medium">รายละเอียดค่าใช้จ่ายเพิ่มเติม</h3>
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
            เพิ่มรายละเอียดค่าใช้จ่าย
          </Button>
        )}
      </div>

      {fields.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ประเภทค่าใช้จ่าย</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>ประเภทภาษี</TableHead>
                <TableHead>ประเภทภาษีสินค้า</TableHead>
                <TableHead>อัตราภาษี (%)</TableHead>
                <TableHead>จำนวนภาษี</TableHead>
                <TableHead>ปรับปรุงภาษี</TableHead>
                <TableHead>หมายเหตุ</TableHead>
                {mode !== formType.VIEW && <TableHead>จัดการ</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.extra_cost_type_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ExtraCostTypeLookup
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Extra Cost Type"
                              disabled={mode === formType.VIEW}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumberInput
                              {...field}
                              onChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value ?? 0}
                              disabled={mode === formType.VIEW}
                              placeholder="จำนวนเงิน"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={mode === formType.VIEW}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกประเภทภาษี" />
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
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_type_inventory_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                          <TaxTypeLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumberInput
                              {...field}
                              onChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value ?? 0}
                              disabled={mode === formType.VIEW}
                              placeholder="อัตราภาษี"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.tax_amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <NumberInput
                              {...field}
                              onChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value ?? 0}
                              disabled={mode === formType.VIEW}
                              placeholder="จำนวนภาษี"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.is_tax_adjustment`}
                      render={({ field: inputField }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={inputField.value}
                              onCheckedChange={inputField.onChange}
                              disabled={mode === formType.VIEW}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={control}
                      name={`extra_cost.extra_cost_detail.add.${index}.note`}
                      render={({ field: inputField }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...inputField}
                              placeholder="หมายเหตุ"
                              disabled={mode === formType.VIEW}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  {mode !== formType.VIEW && (
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        className="hover:text-destructive"
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
          <p>ไม่มีรายละเอียดค่าใช้จ่ายเพิ่มเติม</p>
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
              เพิ่มรายละเอียดค่าใช้จ่ายแรก
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
              <FormLabel>ชื่อค่าใช้จ่ายเพิ่มเติม</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ระบุชื่อค่าใช้จ่ายเพิ่มเติม"
                  disabled={mode === formType.VIEW}
                />
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
              <FormLabel>ประเภทการปันส่วนค่าใช้จ่าย</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={mode === formType.VIEW}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทการปันส่วน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.MANUAL}>
                      ด้วยตนเอง
                    </SelectItem>
                    <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.BY_VALUE}>
                      ตามมูลค่า
                    </SelectItem>
                    <SelectItem value={ALLOCATE_EXTRA_COST_TYPE.BY_QTY}>
                      ตามปริมาณ
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
            <FormLabel>หมายเหตุ</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="ระบุหมายเหตุ"
                disabled={mode === formType.VIEW}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ExtraCostDetail control={control} mode={mode} />
    </div>
  );
}

# Form Array CRUD Pattern

Pattern สำหรับจัดการ array ใน form (เพิ่ม/ลบ/แก้ไข) ด้วย react-hook-form + useFieldArray

## Setup

```tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    items: [],
  },
});

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "items",
});
```

## Inline Editing State

ใช้ `Set<string>` เก็บ `field.id` ของ rows ที่กำลัง edit (ไม่ใช้ index เพราะไม่ต้อง recalculate เมื่อลบ):

```tsx
const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
```

## Handlers

### เพิ่ม Item (พร้อมเปิด edit mode)

```tsx
// ใช้ ref เพื่อ track ว่าเพิ่งกด add (ป้องกันเปิด edit mode เมื่อ load data จาก API)
const isAddingRef = useRef(false);

const handleAdd = useCallback(() => {
  isAddingRef.current = true;
  append({ name: "", age: 0 });
}, [append]);

// เปิด edit mode หลัง append เสร็จ (เฉพาะเมื่อกด add เท่านั้น)
useEffect(() => {
  if (isAddingRef.current && fields.length > 0) {
    const lastField = fields[fields.length - 1];
    setEditingRows((prev) => new Set(prev).add(lastField.id));
    isAddingRef.current = false;
  }
}, [fields.length]);
```

### Toggle Edit Mode (พร้อม Validation)

```tsx
const handleToggleEdit = useCallback(
  async (fieldId: string, index: number) => {
    // ถ้ากำลัง edit อยู่ → validate ก่อนปิด
    if (editingRows.has(fieldId)) {
      const isValid = await form.trigger(`items.${index}`);
      if (!isValid) return; // ไม่ปิด edit mode ถ้า validate ไม่ผ่าน
    }

    setEditingRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  },
  [editingRows, form]
);
```

### ลบ Item

```tsx
const handleRemove = useCallback(
  (fieldId: string, index: number) => {
    remove(index);
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fieldId);
      return newSet;
    });
  },
  [remove]
);
```

### Reset Form

```tsx
const handleReset = useCallback(() => {
  form.reset();
  setEditingRows(new Set());
}, [form]);
```

## Row Component Pattern

แยก Row เป็น component เพื่อลด complexity:

```tsx
interface RowProps {
  fieldId: string;
  index: number;
  form: UseFormReturn<FormData>;
  isEditing: boolean;
  onToggleEdit: (fieldId: string, index: number) => void;
  onRemove: (fieldId: string, index: number) => void;
}

function ItemRow({ fieldId, index, form, isEditing, onToggleEdit, onRemove }: RowProps) {
  return (
    <TableRow>
      <TableCell>
        <FormField
          control={form.control}
          name={`items.${index}.name`}
          render={({ field }) => (
            <FormItem>
              {isEditing ? (
                <FormControl>
                  <Input {...field} />
                </FormControl>
              ) : (
                <div>{field.value || "ยังไม่ได้กรอก"}</div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <Button type="button" onClick={() => onToggleEdit(fieldId, index)}>
          {isEditing ? "บันทึก" : "แก้ไข"}
        </Button>
        <Button type="button" variant="destructive" onClick={() => onRemove(fieldId, index)}>
          ลบ
        </Button>
      </TableCell>
    </TableRow>
  );
}
```

## Usage ใน Parent

```tsx
{
  fields.map((field, index) => (
    <ItemRow
      key={field.id}
      fieldId={field.id}
      index={index}
      form={form}
      isEditing={editingRows.has(field.id)}
      onToggleEdit={handleToggleEdit}
      onRemove={handleRemove}
    />
  ));
}
```

## Empty State

```tsx
{
  fields.length === 0 ? (
    <p className="text-gray-500 text-center py-4">ยังไม่มีรายการ กดปุ่มเพิ่มเพื่อเริ่มต้น</p>
  ) : (
    <Table aria-label="รายการ">{/* ... */}</Table>
  );
}
```

## Key Points

1. **ใช้ `type="button"`** - ป้องกัน form submit โดยไม่ตั้งใจ
2. **ใช้ `useCallback`** - สำหรับ handlers ที่ส่งเข้า child components
3. **ใช้ `field.id` เป็น key และ editing state** - ไม่ใช้ index เพื่อไม่ต้อง recalculate เมื่อลบ
4. **Validate ก่อนปิด edit mode** - ใช้ `form.trigger()` ตรวจสอบก่อนบันทึก
5. **แยก Row component** - ลด complexity และง่ายต่อการ maintain

---

## Dynamic Schema

Pattern นี้รองรับ dynamic schema สำหรับกรณีที่ต้องการ item หลายประเภทหรือ validation ที่เปลี่ยนตามเงื่อนไข

### Discriminated Union Schema

รองรับ item หลายประเภทใน array เดียวกัน:

```tsx
import { z } from "zod";

// กำหนด schema สำหรับแต่ละประเภท
const personSchema = z.object({
  type: z.literal("person"),
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  age: z.number().min(0, "อายุต้องมากกว่า 0"),
});

const companySchema = z.object({
  type: z.literal("company"),
  companyName: z.string().min(1, "กรุณากรอกชื่อบริษัท"),
  taxId: z.string().min(13, "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก"),
});

// รวมเป็น discriminated union
const itemSchema = z.discriminatedUnion("type", [personSchema, companySchema]);

// Schema หลัก
const formSchema = z.object({
  items: z.array(itemSchema),
});

type FormData = z.infer<typeof formSchema>;
```

### Conditional Validation

Validation ที่เปลี่ยนตาม field อื่น:

```tsx
const addressSchema = z
  .object({
    hasAddress: z.boolean(),
    address: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
  })
  .refine((data) => !data.hasAddress || (data.address && data.address.length > 0), {
    message: "กรุณากรอกที่อยู่",
    path: ["address"],
  })
  .refine((data) => !data.hasAddress || (data.province && data.province.length > 0), {
    message: "กรุณาเลือกจังหวัด",
    path: ["province"],
  });
```

### Dynamic Field Rendering

Render field ต่างกันตาม type:

```tsx
interface DynamicRowProps {
  fieldId: string;
  index: number;
  form: UseFormReturn<FormData>;
  isEditing: boolean;
  onToggleEdit: (fieldId: string, index: number) => void;
  onRemove: (fieldId: string, index: number) => void;
}

function DynamicItemRow({ fieldId, index, form, isEditing, onToggleEdit, onRemove }: DynamicRowProps) {
  const itemType = form.watch(`items.${index}.type`);

  return (
    <TableRow>
      {/* Type Selector */}
      <TableCell>
        <FormField
          control={form.control}
          name={`items.${index}.type`}
          render={({ field }) => (
            <FormItem>
              {isEditing ? (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person">บุคคล</SelectItem>
                    <SelectItem value="company">นิติบุคคล</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div>{field.value === "person" ? "บุคคล" : "นิติบุคคล"}</div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      {/* Dynamic Fields based on type */}
      <TableCell>
        {itemType === "person" ? (
          <PersonFields index={index} form={form} isEditing={isEditing} />
        ) : (
          <CompanyFields index={index} form={form} isEditing={isEditing} />
        )}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <Button type="button" onClick={() => onToggleEdit(fieldId, index)}>
          {isEditing ? "บันทึก" : "แก้ไข"}
        </Button>
        <Button type="button" variant="destructive" onClick={() => onRemove(fieldId, index)}>
          ลบ
        </Button>
      </TableCell>
    </TableRow>
  );
}
```

### Field Components แยกตาม Type

```tsx
interface FieldProps {
  index: number;
  form: UseFormReturn<FormData>;
  isEditing: boolean;
}

function PersonFields({ index, form, isEditing }: FieldProps) {
  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name={`items.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ชื่อ</FormLabel>
            {isEditing ? (
              <FormControl>
                <Input {...field} placeholder="ชื่อ-นามสกุล" />
              </FormControl>
            ) : (
              <div>{field.value || "-"}</div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`items.${index}.age`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>อายุ</FormLabel>
            {isEditing ? (
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            ) : (
              <div>{field.value || "-"}</div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function CompanyFields({ index, form, isEditing }: FieldProps) {
  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name={`items.${index}.companyName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>ชื่อบริษัท</FormLabel>
            {isEditing ? (
              <FormControl>
                <Input {...field} placeholder="ชื่อบริษัท" />
              </FormControl>
            ) : (
              <div>{field.value || "-"}</div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`items.${index}.taxId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>เลขประจำตัวผู้เสียภาษี</FormLabel>
            {isEditing ? (
              <FormControl>
                <Input {...field} placeholder="0000000000000" maxLength={13} />
              </FormControl>
            ) : (
              <div>{field.value || "-"}</div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

### Handler สำหรับ Dynamic Type

```tsx
// ใช้ ref เพื่อ track ว่าเพิ่งกด add (ป้องกันเปิด edit mode เมื่อ load data จาก API)
const isAddingRef = useRef(false);

const handleAddPerson = useCallback(() => {
  isAddingRef.current = true;
  append({ type: "person", name: "", age: 0 });
}, [append]);

const handleAddCompany = useCallback(() => {
  isAddingRef.current = true;
  append({ type: "company", companyName: "", taxId: "" });
}, [append]);

// เปิด edit mode หลัง append เสร็จ (เฉพาะเมื่อกด add เท่านั้น)
useEffect(() => {
  if (isAddingRef.current && fields.length > 0) {
    const lastField = fields[fields.length - 1];
    setEditingRows((prev) => new Set(prev).add(lastField.id));
    isAddingRef.current = false;
  }
}, [fields.length]);
```

### Usage ใน Parent (Dynamic)

```tsx
{
  fields.map((field, index) => (
    <DynamicItemRow
      key={field.id}
      fieldId={field.id}
      index={index}
      form={form}
      isEditing={editingRows.has(field.id)}
      onToggleEdit={handleToggleEdit}
      onRemove={handleRemove}
    />
  ));
}
```

### Dynamic Schema Key Points

1. **ใช้ `discriminatedUnion`** - ให้ Zod รู้ว่า item แต่ละตัวเป็นประเภทไหนจาก field `type`
2. **ใช้ `form.watch`** - เพื่อ re-render เมื่อ type เปลี่ยน
3. **แยก Field Components** - ตาม type เพื่อลด complexity
4. **Type-safe** - TypeScript จะ infer type ของ fields ตาม discriminated union

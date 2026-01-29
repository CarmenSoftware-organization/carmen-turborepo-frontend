# Form Array CRUD Pattern

Pattern สำหรับจัดการ array ใน form (เพิ่ม/ลบ/แก้ไข) ด้วย react-hook-form + useFieldArray

## Setup

```tsx
import { useState, useCallback } from "react";
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

ใช้ `Set<number>` เก็บ index ของ rows ที่กำลัง edit:

```tsx
const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
```

## Handlers

### เพิ่ม Item (พร้อมเปิด edit mode)

```tsx
const handleAdd = useCallback(() => {
  const newIndex = fields.length;
  append({ name: "", age: 0 });
  setEditingRows((prev) => new Set(prev).add(newIndex));
}, [fields.length, append]);
```

### Toggle Edit Mode

```tsx
const handleToggleEdit = useCallback((index: number) => {
  setEditingRows((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    return newSet;
  });
}, []);
```

### ลบ Item (พร้อม update indices)

```tsx
const handleRemove = useCallback(
  (index: number) => {
    remove(index);
    setEditingRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Update indices สำหรับ items ที่อยู่หลัง item ที่ถูกลบ
      const updatedSet = new Set<number>();
      newSet.forEach((idx) => {
        if (idx > index) {
          updatedSet.add(idx - 1);
        } else {
          updatedSet.add(idx);
        }
      });
      return updatedSet;
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
  index: number;
  form: UseFormReturn<FormData>;
  isEditing: boolean;
  onToggleEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

function ItemRow({ index, form, isEditing, onToggleEdit, onRemove }: RowProps) {
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
        <Button type="button" onClick={() => onToggleEdit(index)}>
          {isEditing ? "บันทึก" : "แก้ไข"}
        </Button>
        <Button type="button" variant="destructive" onClick={() => onRemove(index)}>
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
      key={field.id} // ใช้ field.id จาก useFieldArray
      index={index}
      form={form}
      isEditing={editingRows.has(index)}
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
3. **ใช้ `field.id` เป็น key** - ไม่ใช้ index เพื่อป้องกันปัญหา re-render
4. **Update indices เมื่อลบ** - ต้อง adjust index ของ items ที่อยู่หลัง item ที่ถูกลบ
5. **แยก Row component** - ลด complexity และง่ายต่อการ maintain

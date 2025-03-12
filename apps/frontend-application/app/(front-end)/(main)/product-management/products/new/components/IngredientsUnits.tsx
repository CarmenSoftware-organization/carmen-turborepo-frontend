import React, { useRef, useCallback } from 'react';
import * as Form from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { ProductFormType } from '@/dtos/product.dto';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useUnit } from '@/hooks/useUnit';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';

interface IngredientsUnitsProps {
    control: Control<ProductFormType>;
    selectedUnit: { id: string; name: string } | null;
}

const IngredientsUnits = ({ control, selectedUnit }: IngredientsUnitsProps) => {
    const { units } = useUnit();

    // ใช้ useRef เพื่อเก็บค่า selectedUnit ล่าสุดและป้องกัน infinite loop
    const prevSelectedUnitRef = useRef<string | null>(null);
    const processingUpdateRef = useRef<boolean>(false);

    // Watch the ingredientsUnits field to ensure we re-render when it changes
    const ingredientsUnitsValues = useWatch({
        control,
        name: 'ingredientsUnits.add',
        defaultValue: []
    });

    const { fields, append, remove } = useFieldArray({
        name: 'ingredientsUnits.add',
        control: control,
    });

    // Ensure the component re-renders when ingredientsUnits changes
    React.useEffect(() => {
        // This empty effect will cause a re-render when ingredientsUnitsValues changes
        // which helps ensure the UI updates when the form state changes
    }, [ingredientsUnitsValues]);

    // ฟังก์ชันที่ใช้สำหรับอัพเดทค่า unit_id ที่ทำงานเพียงครั้งเดียวต่อการเปลี่ยนแปลง selectedUnit
    const updateUnitIds = useCallback(() => {
        if (processingUpdateRef.current) return;

        if (selectedUnit?.id && fields.length > 0 && prevSelectedUnitRef.current !== selectedUnit.id) {
            processingUpdateRef.current = true;
            prevSelectedUnitRef.current = selectedUnit.id;

            // อัพเดทค่า unit_id ในทุก row เป็นค่าที่เลือกใน primary_unit_id
            const updatedValues = (ingredientsUnitsValues as Record<string, unknown>[]).map(item => ({
                ...item,
                unit_id: selectedUnit.id
            }));

            // ใช้ fields.forEach แทน setValue
            if (updatedValues.length > 0) {
                updatedValues.forEach((item, index) => {
                    if (fields[index]) {
                        // ตรวจสอบว่าค่า unit_id เปลี่ยนไปจริงๆ หรือไม่ก่อนที่จะส่ง event
                        const currentValue = ingredientsUnitsValues[index]?.unit_id;
                        if (currentValue !== item.unit_id) {
                            // ส่ง event เพื่อให้ ProductForm จัดการอัพเดทค่า
                            const event = new CustomEvent('update-ingredient-unit', {
                                detail: { index, item }
                            });
                            window.dispatchEvent(event);
                        }
                    }
                });
            }

            // รีเซ็ต flag สำหรับครั้งถัดไป
            setTimeout(() => {
                processingUpdateRef.current = false;
            }, 100);
        }
    }, [selectedUnit, fields, ingredientsUnitsValues]);

    // เรียกใช้ฟังก์ชัน updateUnitIds เมื่อ selectedUnit เปลี่ยน
    React.useEffect(() => {
        if (selectedUnit?.id !== prevSelectedUnitRef.current) {
            updateUnitIds();
        }
    }, [selectedUnit, updateUnitIds]);

    const handleAddUnit = () => {
        append({
            unit_id: selectedUnit?.id || '',
            unit_quantity: 1,
            to_unit_id: '',
            to_unit_quantity: 0,
        });
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ingredients Units</CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddUnit}
                    className="flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Ingredient Unit
                </Button>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={3} className="text-center border-r">From</TableHead>
                                <TableHead colSpan={2} className="text-center">To</TableHead>
                                <TableHead rowSpan={2} className="align-middle"></TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead></TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <Form.FormField
                                            control={control}
                                            name={`ingredientsUnits.add.${index}.unit_quantity`}
                                            render={({ field }) => (
                                                <Form.FormItem>
                                                    <Form.FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                                                field.onChange(value);
                                                            }}
                                                            onBlur={field.onBlur}
                                                            className="w-full"
                                                        />
                                                    </Form.FormControl>
                                                </Form.FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Form.FormField
                                            control={control}
                                            name={`ingredientsUnits.add.${index}.unit_id`}
                                            render={({ field }) => (
                                                <Form.FormItem>
                                                    <Form.FormControl>
                                                        <SearchableDropdown
                                                            data={units}
                                                            value={field.value ? (units.find(unit => unit.id === field.value) || null) : (selectedUnit && units.some(u => u.id === selectedUnit.id) ? selectedUnit : null)}
                                                            onChange={(selectedUnit) => {
                                                                field.onChange(selectedUnit?.id || '');
                                                            }}
                                                            displayValue={(unit) => unit?.name || ''}
                                                            getItemText={(unit) => unit?.name || ''}
                                                            getItemId={(unit) => unit?.id || ''}
                                                            searchFields={['name']}
                                                            placeholder="Select a unit"
                                                            searchPlaceholder="Search units..."
                                                            noResultsText="No matching units found"
                                                            noDataText="No units available"
                                                            className="w-full"
                                                            key={`${field.value}-${ingredientsUnitsValues.length}`}
                                                            readOnly={true}
                                                        />
                                                    </Form.FormControl>
                                                </Form.FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center w-[5px]">
                                        =
                                    </TableCell>
                                    <TableCell>
                                        <Form.FormField
                                            control={control}
                                            name={`ingredientsUnits.add.${index}.to_unit_quantity`}
                                            render={({ field }) => (
                                                <Form.FormItem>
                                                    <Form.FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            value={field.value}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                                                field.onChange(value);
                                                            }}
                                                            onBlur={field.onBlur}
                                                            className="w-full"
                                                        />
                                                    </Form.FormControl>
                                                </Form.FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Form.FormField
                                            control={control}
                                            name={`ingredientsUnits.add.${index}.to_unit_id`}
                                            render={({ field }) => (
                                                <Form.FormItem>
                                                    <Form.FormControl>
                                                        <SearchableDropdown
                                                            data={units}
                                                            value={units.find(unit => unit.id === field.value) || null}
                                                            onChange={(selectedUnit) => {
                                                                field.onChange(selectedUnit?.id || '');
                                                            }}
                                                            displayValue={(unit) => unit?.name || ''}
                                                            getItemText={(unit) => unit?.name || ''}
                                                            getItemId={(unit) => unit?.id || ''}
                                                            searchFields={['name']}
                                                            placeholder="Select a use unit"
                                                            searchPlaceholder="Search units..."
                                                            noResultsText="No matching units found"
                                                            noDataText="No units available"
                                                            className="w-full"
                                                            key={`${field.value}-${ingredientsUnitsValues.length}`}
                                                        />
                                                    </Form.FormControl>
                                                </Form.FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            aria-label="Remove ingredient unit"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {fields.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        No ingredient units added. Click &quot;Add Ingredient Unit&quot; to add an ingredient unit.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default IngredientsUnits; 
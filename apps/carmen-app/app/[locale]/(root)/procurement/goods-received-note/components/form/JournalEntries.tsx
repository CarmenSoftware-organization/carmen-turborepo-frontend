"use client";

import { GrnFormValues } from "../../type.dto";
import { Control, useFieldArray } from "react-hook-form";
import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface JournalEntriesProps {
    readonly control: Control<GrnFormValues>;
    readonly readOnly?: boolean;
}

export default function JournalEntries({ control, readOnly = false }: JournalEntriesProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "journal_entries.lists",
    });

    const handleAddEntry = () => {
        append({
            id: crypto.randomUUID(),
            name: "",
            amount: 0,
            department: { id: "", name: "" },
            description: "",
            debit: 0,
            credit: 0,
            base_debit: 0,
            base_credit: 0,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Journal Entry</CardTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <FormField
                        control={control}
                        name="journal_entries.type"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Type" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="journal_entries.code"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Code" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="journal_entries.transaction_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="date"
                                        placeholder="Transaction Date"
                                        {...field}
                                        disabled={readOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="journal_entries.ref_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Reference No" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mt-2">
                    <FormField
                        control={control}
                        name="journal_entries.description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Description" {...field} disabled={readOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Account</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                                <TableHead className="text-right">Base Debit</TableHead>
                                <TableHead className="text-right">Base Credit</TableHead>
                                {!readOnly && <TableHead className="w-[80px]">Action</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={readOnly ? 7 : 8} className="text-center">
                                        No entries
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.department.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} disabled={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} disabled={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} disabled={readOnly} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.debit`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className="text-right"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                value={field.value}
                                                                disabled={readOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.credit`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className="text-right"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                value={field.value}
                                                                disabled={readOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.base_debit`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className="text-right"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                value={field.value}
                                                                disabled={readOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <FormField
                                                control={control}
                                                name={`journal_entries.lists.${index}.base_credit`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className="text-right"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                value={field.value}
                                                                disabled={readOnly}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        {!readOnly && (
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {!readOnly && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddEntry}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Entry
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

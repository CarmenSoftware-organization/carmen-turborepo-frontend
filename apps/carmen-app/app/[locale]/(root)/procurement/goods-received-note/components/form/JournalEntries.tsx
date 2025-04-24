"use client";

import { GrnFormValues } from "../../type.dto";
import { Control, useFieldArray } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { Calculator, Plus, Trash } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { Textarea } from "@/components/ui/textarea";
interface JournalEntriesProps {
    readonly control: Control<GrnFormValues>;
    readonly mode: formType;
}

export default function JournalEntries({ control, mode }: JournalEntriesProps) {
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
        <div className="p-2 space-y-2">
            <div className="flex justify-between items-center p-2">
                <p className="text-base font-medium">Journal Entry</p>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddEntry}
                    >
                        <Calculator />
                        Recalculate
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddEntry}
                        disabled={mode === formType.VIEW}
                    >
                        <Plus />
                        Add Entry
                    </Button>
                </div>
            </div>

            <div className={`px-4 pt-2 pb-6 ${mode === formType.VIEW ? "bg-muted rounded-md" : ""}`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <FormField
                        control={control}
                        name="journal_entries.type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="Type" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="journal_entries.code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document No.</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="Code" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="journal_entries.transaction_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transaction Date</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input
                                            type="date"
                                            placeholder="Transaction Date"
                                            {...field}

                                        />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="journal_entries.ref_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reference No.</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="Reference No" {...field} />
                                    </FormControl>
                                )}
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
                                <FormLabel>Description</FormLabel>
                                {mode === formType.VIEW ? (
                                    <p className="text-xs">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Textarea placeholder="Description" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
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
                        {mode !== formType.VIEW && (
                            <TableHead className="w-[80px]">Action</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell className="text-center">
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                )}
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}

                                                        />
                                                    </FormControl>
                                                )}
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
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
                                                {mode === formType.VIEW ? (
                                                    <p className="text-xs">{field.value}</p>
                                                ) : (
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            className="text-right"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            value={field.value}
                                                        />
                                                    </FormControl>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                {mode !== formType.VIEW && (
                                    <TableCell>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="text-destructive"
                                            variant="ghost"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

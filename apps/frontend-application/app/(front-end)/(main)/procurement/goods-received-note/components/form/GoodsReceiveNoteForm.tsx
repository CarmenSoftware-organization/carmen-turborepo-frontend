import React from "react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2, Save, X, Printer, CheckSquare } from "lucide-react";

interface GoodsReceiveNoteFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    onBack: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSaveClick: (data: any) => void;
    isSubmitting: boolean;
    isEditable: boolean;
    handleEdit: () => void;
    handleCancel: () => void;
    error: string | null;
}

const GoodsReceiveNoteForm: React.FC<GoodsReceiveNoteFormProps> = ({
    form,
    onBack,
    handleSaveClick,
    isSubmitting,
    isEditable,
    handleEdit,
    handleCancel,
    error,
}) => {
    return (
        <form onSubmit={form.handleSubmit(handleSaveClick)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-semibold">Goods Receive Note</h1>
                </div>
                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                    {!isEditable ? (
                        <>
                            <Button type="button" variant="default" size="sm" onClick={handleEdit}>
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button type="button" variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                disabled={!form.formState.isValid || isSubmitting}
                            >
                                <Save className="h-4 w-4" />
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </>
                    )}
                    <Button type="button" variant="outline" size="sm" disabled={isSubmitting}>
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button type="button" variant="outline" size="sm" disabled={isSubmitting}>
                        <CheckSquare className="h-4 w-4" />
                        Commit
                    </Button>
                </div>
            </div>
            <div className="px-2">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                    <FormField
                        control={form.control}
                        name="ref"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-xs">GRN #</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={!isEditable || isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-xs">Date</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full text-left h-7"
                                            >
                                                {field.value
                                                    ? format(field.value, "dd/MM/yyyy")
                                                    : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Calendar
                                                selected={field.value}
                                                onSelect={(date) => field.onChange(date)}
                                                mode="single"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="vendor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-xs">Vendor</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={!isEditable || isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-xs">Invoice #</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={!isEditable || isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </form>
    );
};

export default GoodsReceiveNoteForm;

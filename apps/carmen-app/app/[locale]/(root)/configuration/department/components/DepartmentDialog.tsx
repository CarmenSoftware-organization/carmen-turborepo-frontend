"use client";

import { formType } from "@/dtos/form.dto";
import { DepartmentDto, departmentSchema } from "@/dtos/config.dto";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface DepartmentDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly department?: DepartmentDto;
    readonly onSubmit: (data: DepartmentDto) => void;
    readonly isLoading?: boolean;
}

export default function DepartmentDialog({
    open,
    onOpenChange,
    mode,
    department,
    onSubmit,
    isLoading = false
}: DepartmentDialogProps) {

    const defaultDepartmentValues = useMemo(() => ({
        name: '',
        description: '',
        is_active: true,
    }), []);

    const form = useForm<DepartmentDto>({
        resolver: zodResolver(departmentSchema),
        defaultValues: mode === formType.EDIT && department
            ? { ...department }
            : defaultDepartmentValues,
    });

    useEffect(() => {
        if (mode === formType.EDIT && department) {
            form.reset({ ...department });
        } else {
            form.reset({ ...defaultDepartmentValues });
        }
    }, [mode, department, form, defaultDepartmentValues]);

    const handleSubmit = async (data: DepartmentDto) => {
        try {
            const validatedData = departmentSchema.parse(data);
            onSubmit(validatedData)
            form.reset(defaultDepartmentValues);
            onOpenChange(false);
        } catch (error) {
            console.error('Validation Error:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? "Add Department" : "Edit Department"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD
                            ? "Add a new department with name and status"
                            : "Edit existing department details including name and status"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Status
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </FormControl>
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
                            <Button
                                type="submit"
                                disabled={isLoading || form.formState.isSubmitting}
                            >
                                {mode === formType.ADD ? "Add" : "Edit"}
                                {(isLoading || form.formState.isSubmitting) && (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitDto, unitSchema } from "@/dtos/unit.dto";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useMemo } from "react";
import { formType } from "@/dtos/form.dto";

interface UnitDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly unit?: UnitDto;
    readonly onSubmit: (data: UnitDto) => void;
}

export default function UnitDialog({
    open,
    onOpenChange,
    mode,
    unit,
    onSubmit,
}: UnitDialogProps) {
    const defaultUnitValues = useMemo(() => ({
        id: '',
        name: '',
        code: '',
        status: true,
    }), []);

    const form = useForm<UnitDto>({
        resolver: zodResolver(unitSchema),
        defaultValues: mode === formType.EDIT && unit
            ? { ...unit }
            : defaultUnitValues,
    });

    useEffect(() => {
        if (mode === formType.EDIT && unit) {
            form.reset({ ...unit });
        } else {
            form.reset({ ...defaultUnitValues });
        }
    }, [mode, unit, form, defaultUnitValues]);

    const handleSubmit = (data: UnitDto) => {
        onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? "Add Unit" : "Edit Unit"}
                    </DialogTitle>
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
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
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
                            <Button type="button" variant="outline" onClick={() => {
                                form.reset();
                                onOpenChange(false);
                            }}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {mode === formType.ADD ? "Add" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 
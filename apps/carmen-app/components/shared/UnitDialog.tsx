"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitSchema, UnitDto, CreateUnitDto } from "@/dtos/unit.dto";
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
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { formType } from "@/dtos/form.dto";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import FormBoolean from "../form-custom/form-boolean";

interface UnitDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly unit?: UnitDto;
    readonly onSubmit: (data: CreateUnitDto) => void;
}

export default function UnitDialog({
    open,
    onOpenChange,
    mode,
    unit,
    onSubmit,
}: UnitDialogProps) {
    const tCommon = useTranslations('Common');
    const tUnit = useTranslations('Unit');

    const defaultUnitValues = useMemo(() => ({
        name: '',
        description: '',
        is_active: true,
    }), []);

    const form = useForm<CreateUnitDto>({
        resolver: zodResolver(unitSchema),
        defaultValues: mode === formType.EDIT && unit
            ? { name: unit.name, description: unit.description, is_active: unit.is_active }
            : defaultUnitValues,
    });

    useEffect(() => {
        if (open) {
            if (mode === formType.EDIT && unit) {
                form.reset({ ...unit });
            } else {
                form.reset(defaultUnitValues);
            }
        }
    }, [open, mode, unit, form, defaultUnitValues]);

    const handleSubmit = (data: CreateUnitDto) => {
        onSubmit(data);
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? tCommon('add') : tCommon('edit')}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD
                            ? tUnit('add_description')
                            : tUnit('edit_description')
                        }
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon('name')}</FormLabel>
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
                                    <FormLabel>{tCommon('description')}</FormLabel>
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
                                <FormItem>
                                    <FormBoolean
                                        value={field.value}
                                        onChange={field.onChange}
                                        label={tCommon('status')}
                                    />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => {
                                form.reset();
                                onOpenChange(false);
                            }}>
                                {tCommon('cancel')}
                            </Button>
                            <Button type="submit">
                                {mode === formType.ADD ? tCommon('add') : tCommon('save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 
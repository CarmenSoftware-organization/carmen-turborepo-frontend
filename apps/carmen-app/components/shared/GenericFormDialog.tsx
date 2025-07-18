"use client";

import { useForm, FieldValues, Path, DefaultValues, DeepPartial } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, ReactNode } from "react";
import { ZodSchema } from "zod";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formType } from "@/dtos/form.dto";
import FormBoolean from "../form-custom/form-boolean";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import NumberInput from "../form-custom/NumberInput";
import { FORM_FIELD_TYPE } from "@/constants/enum";
import DateInput from "../form-custom/DateInput";

export interface FieldConfig<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type?: FORM_FIELD_TYPE;
    component?: (field: any) => ReactNode;
    className?: string;
    placeholder?: string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    accept?: string; // สำหรับ file input
    multiple?: boolean; // สำหรับ file input
    disabled?: boolean;
    readOnly?: boolean;
    options?: Array<{ value: string | number; label: string }>; // สำหรับ select
}

// Generic dialog props
export interface GenericFormDialogProps<T extends FieldValues> {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly data?: DeepPartial<T>;
    readonly onSubmit: (data: T) => void;
    readonly isLoading?: boolean;
    readonly schema: ZodSchema<T>;
    readonly defaultValues: DefaultValues<T>;
    readonly fields: FieldConfig<T>[];
    readonly title: {
        add: string;
        edit: string;
    };
    readonly description: {
        add: string;
        edit: string;
    };
}

export default function GenericFormDialog<T extends FieldValues>({
    open,
    onOpenChange,
    mode,
    data,
    onSubmit,
    isLoading = false,
    schema,
    defaultValues,
    fields,
    title,
    description,
}: GenericFormDialogProps<T>) {
    const tCommon = useTranslations('Common');

    const getFormDefaultValues = (): DefaultValues<T> => {
        if (mode === formType.EDIT && data) {
            return { ...defaultValues, ...data } as DefaultValues<T>;
        }
        return defaultValues;
    };

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: getFormDefaultValues(),
    });

    useEffect(() => {
        const newDefaultValues = getFormDefaultValues();
        form.reset(newDefaultValues);
    }, [mode, data, open]);

    const handleSubmit = async (formData: T) => {
        try {
            const validatedData = schema.parse(formData);
            onSubmit(validatedData);
            form.reset(defaultValues);
            onOpenChange(false);
        } catch (error) {
            console.error('Validation Error:', error);
        }
    };

    const handleCancel = useCallback(() => {
        form.reset(getFormDefaultValues());
        onOpenChange(false);
    }, [form, mode, data, defaultValues, onOpenChange]);

    const renderFieldComponent = (field: any, type: string, component: any, label: string) => {
        if (component) {
            return component(field);
        }
        if (type === 'textarea') {
            return <Textarea {...field} />;
        }
        if (type === 'switch') {
            return (
                <FormBoolean
                    value={field.value}
                    onChange={field.onChange}
                    label={label}
                    type="switch"
                />
            );
        }
        if (type === 'checkbox') {
            return (
                <FormBoolean
                    value={field.value}
                    onChange={field.onChange}
                    label={label}
                    type="checkbox"
                />
            );
        }

        if (type === 'date') {
            return (
                <DateInput field={field} />
            )
        }
        if (type === 'number') {
            return (
                <NumberInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={label}
                />
            )
        }
        return <Input {...field} />;
    };

    const renderField = (fieldConfig: FieldConfig<T>) => {
        const { name, label, type = 'text', component, className } = fieldConfig;

        return (
            <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        {type !== 'checkbox' && type !== 'switch' && <FormLabel>{label}</FormLabel>}
                        <FormControl>
                            {renderFieldComponent(field, type, component, label)}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? title.add : title.edit}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD ? description.add : description.edit}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {fields.map(renderField)}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                {tCommon('cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || form.formState.isSubmitting}
                            >
                                {mode === formType.ADD
                                    ? tCommon('add')
                                    : tCommon('save')
                                }
                                {(isLoading || form.formState.isSubmitting) && (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
"use client";

import { formType } from "@/dtos/form.dto";
import { useCallback, useEffect, useMemo } from "react";
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
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    DeliveryPointCreateDto,
    DeliveryPointUpdateDto,
    DeliveryPointGetDto,
    deliveryPointCreateSchema,
    deliveryPointUpdateSchema
} from "@/dtos/delivery-point.dto";
import FormBoolean from "@/components/form-custom/form-boolean";

interface DeliveryPointDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly deliveryPoint?: DeliveryPointGetDto;
    readonly onSubmit: (data: DeliveryPointCreateDto | DeliveryPointUpdateDto) => void;
    readonly isLoading?: boolean;
}

export default function DeliveryPointDialog({
    open,
    onOpenChange,
    mode,
    deliveryPoint,
    onSubmit,
    isLoading = false
}: DeliveryPointDialogProps) {
    const tCommon = useTranslations('Common');
    const tDeliveryPoint = useTranslations('DeliveryPoint');

    const defaultDeliveryPointValues = useMemo(() => ({
        name: '',
        is_active: true,
    }), []);

    const schema = mode === formType.EDIT ? deliveryPointUpdateSchema : deliveryPointCreateSchema;

    const form = useForm<DeliveryPointCreateDto | DeliveryPointUpdateDto>({
        resolver: zodResolver(schema),
        defaultValues: mode === formType.EDIT && deliveryPoint
            ? { ...deliveryPoint }
            : defaultDeliveryPointValues,
    });

    useEffect(() => {
        if (mode === formType.EDIT && deliveryPoint) {
            form.reset({ ...deliveryPoint });
        } else {
            form.reset({ ...defaultDeliveryPointValues });
        }
    }, [mode, deliveryPoint, form, defaultDeliveryPointValues]);

    const handleSubmit = async (data: DeliveryPointCreateDto | DeliveryPointUpdateDto) => {
        try {
            const validatedData = schema.parse(data);
            onSubmit(validatedData);
            form.reset(defaultDeliveryPointValues);
            onOpenChange(false);
        } catch (error) {
            console.error('Validation Error:', error);
        }
    };

    const handleCancel = useCallback(() => {
        form.reset(mode === formType.EDIT && deliveryPoint
            ? { ...deliveryPoint }
            : defaultDeliveryPointValues
        );
        onOpenChange(false);
    }, [form, mode, deliveryPoint, defaultDeliveryPointValues, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? tDeliveryPoint("add_delivery_point") : tDeliveryPoint("edit_delivery_point")}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD
                            ? tDeliveryPoint("add_delivery_point_description")
                            : tDeliveryPoint("edit_delivery_point_description")}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            required
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon("name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            required
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FormBoolean
                                            value={field.value}
                                            onChange={field.onChange}
                                            label={tCommon("status")}
                                            type="checkbox"
                                            required
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
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
                                {mode === formType.ADD ? tCommon('save') : tCommon('edit')}
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
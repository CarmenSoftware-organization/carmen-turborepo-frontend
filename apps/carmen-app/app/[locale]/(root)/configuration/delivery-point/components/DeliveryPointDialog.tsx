"use client";

import { formType } from "@/dtos/form.dto";
import { DeliveryPointDto, deliveryPointSchema } from "@/dtos/config.dto";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeliveryPointDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly deliveryPoint?: DeliveryPointDto;
    readonly onSubmit: (data: DeliveryPointDto) => void;
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

    const form = useForm<DeliveryPointDto>({
        resolver: zodResolver(deliveryPointSchema),
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

    const handleSubmit = async (data: DeliveryPointDto) => {
        try {
            const validatedData = deliveryPointSchema.parse(data);
            onSubmit(validatedData)
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
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            {tCommon("status")}
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
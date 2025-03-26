"use client";

import { formType } from "@/dtos/form.dto";
import { DeliveryPointDto, deliveryPointSchema } from "@/dtos/config.dto";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? "Add Delivery Point" : "Edit Delivery Point"}
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
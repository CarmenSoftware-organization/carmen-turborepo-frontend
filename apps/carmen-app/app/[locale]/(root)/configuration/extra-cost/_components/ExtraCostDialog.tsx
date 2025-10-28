"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/form-custom/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import FormBoolean from "@/components/form-custom/form-boolean";
import {
    createExtraCostFormSchema,
    createExtraCostUpdateSchema,
} from "../_schemas/extra-cost-form.schema";

interface ExtraCostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: formType;
    extraCost?: ExtraCostTypeDto;
    onSubmit: (data: ExtraCostTypeDto) => void;
    isLoading?: boolean;
}

export default function ExtraCostDialog({
    open,
    onOpenChange,
    mode,
    extraCost,
    onSubmit,
    isLoading = false,
}: ExtraCostDialogProps) {
    const tExtraCost = useTranslations("ExtraCost");
    const tCommon = useTranslations("Common");

    // Create schema with i18n messages
    const schema = useMemo(() => {
        const messages = {
            nameRequired: tExtraCost("name_required"),
        };
        return mode === formType.EDIT
            ? createExtraCostUpdateSchema(messages)
            : createExtraCostFormSchema(messages);
    }, [mode, tExtraCost]);

    type FormData = Omit<ExtraCostTypeDto, 'id' | 'doc_version'>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            note: "",
            is_active: true,
            info: "",
            dimension: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (mode === formType.EDIT && extraCost) {
                form.reset({
                    ...extraCost,
                    description: extraCost.description || "",
                    note: extraCost.note || "",
                    info: extraCost.info || "",
                    dimension: extraCost.dimension || "",
                });
            } else if (mode === formType.ADD) {
                form.reset({
                    name: "",
                    description: "",
                    note: "",
                    is_active: true,
                    info: "",
                    dimension: "",
                });
            }
        }
    }, [open, mode, extraCost, form]);

    const handleFormSubmit = (data: FormData) => {
        const submitData: ExtraCostTypeDto = {
            ...data,
            id: mode === formType.EDIT && extraCost ? extraCost.id : "",
        };
        onSubmit(submitData);
    };

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD
                            ? tExtraCost("add_extra_cost")
                            : tExtraCost("edit_extra_cost")}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tExtraCost("name")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={tExtraCost("name_placeholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={tCommon("description")}
                                            maxLength={200}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon("note")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={tCommon("note")}
                                            maxLength={200}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="info"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon("info")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={tCommon("info")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dimension"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon("dimension")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={tCommon("dimension")} {...field} />
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
                                    <FormControl>
                                        <FormBoolean
                                            value={field.value}
                                            onChange={field.onChange}
                                            label={tCommon("active")}
                                            type="checkbox"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outlinePrimary"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                {tCommon("cancel")}
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {(() => {
                                    if (isLoading) return tCommon("saving");
                                    if (mode === formType.ADD) return tCommon("add");
                                    return tCommon("edit");
                                })()}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

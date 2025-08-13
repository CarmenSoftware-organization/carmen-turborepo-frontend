"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { formType } from "@/dtos/form.dto";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";

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

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ExtraCostTypeDto>({
        defaultValues: {
            name: "",
            description: "",
            note: "",
            is_active: true,
            info: "",
            dimension: "",
        },
    });

    const watchedIsActive = watch("is_active");

    useEffect(() => {
        if (open) {
            if (mode === formType.EDIT && extraCost) {
                setValue("name", extraCost.name);
                setValue("description", extraCost.description || "");
                setValue("note", extraCost.note || "");
                setValue("is_active", extraCost.is_active);
                setValue("info", extraCost.info || "");
                setValue("dimension", extraCost.dimension || "");
            } else if (mode === formType.ADD) {
                reset({
                    name: "",
                    description: "",
                    note: "",
                    is_active: true,
                    info: "",
                    dimension: "",
                });
            }
        }
    }, [open, mode, extraCost, setValue, reset]);

    const handleFormSubmit = (data: ExtraCostTypeDto) => {
        const submitData = {
            ...data,
            id: mode === formType.EDIT && extraCost ? extraCost.id : "",
        };
        onSubmit(submitData);
    };

    const handleClose = () => {
        reset({
            name: "",
            description: "",
            note: "",
            is_active: true,
            info: "",
            dimension: "",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? tExtraCost("add_extra_cost") : tExtraCost("edit_extra_cost")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{tExtraCost("name")} <span className="text-destructive">*</span></Label>
                        <Input
                            id="name"
                            {...register("name", { required: tCommon("name") })}
                            placeholder={tExtraCost("name_placeholder")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{tCommon("description")}</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder={tCommon("description")}
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">{tCommon("note")}</Label>
                        <Textarea
                            id="note"
                            {...register("note")}
                            placeholder={tCommon("note")}
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="info">{tCommon("info")}</Label>
                        <Input
                            id="info"
                            {...register("info")}
                            placeholder={tCommon("info")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dimension">{tCommon("dimension")}</Label>
                        <Input
                            id="dimension"
                            {...register("dimension")}
                            placeholder={tCommon("dimension")}
                        />
                    </div>

                    <div className="fxr-c space-x-2">
                        <Checkbox
                            id="is_active"
                            checked={watchedIsActive}
                            onCheckedChange={(checked) => {
                                setValue("is_active", checked as boolean)
                            }}
                        />
                        <Label htmlFor="is_active">{tCommon("status")}</Label>
                    </div>

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
            </DialogContent>
        </Dialog>
    );
}
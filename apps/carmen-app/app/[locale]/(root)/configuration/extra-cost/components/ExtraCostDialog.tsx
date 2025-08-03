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
import { Switch } from "@/components/ui/switch";
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { formType } from "@/dtos/form.dto";

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
    }, [mode, extraCost, setValue, reset]);

    const handleFormSubmit = (data: ExtraCostTypeDto) => {
        const submitData = {
            ...data,
            id: mode === formType.EDIT && extraCost ? extraCost.id : "",
        };
        onSubmit(submitData);
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? "Add Extra Cost" : "Edit Extra Cost"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Enter extra cost name"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Enter description"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            {...register("note")}
                            placeholder="Enter note"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="info">Info</Label>
                        <Input
                            id="info"
                            {...register("info")}
                            placeholder="Enter additional info"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dimension">Dimension</Label>
                        <Input
                            id="dimension"
                            {...register("dimension")}
                            placeholder="Enter dimension"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={watchedIsActive}
                            onCheckedChange={(checked) => setValue("is_active", checked)}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : (mode === formType.ADD ? "Add" : "Update")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
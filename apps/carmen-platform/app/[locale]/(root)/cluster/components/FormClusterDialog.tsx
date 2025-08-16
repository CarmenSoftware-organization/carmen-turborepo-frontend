"use client";

import { Plus, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GetClusterDto } from "@/dto/cluster.dto";
import { useCreateCluster, useUpdateCluster } from "@/app/hooks/useCluster";

const clusterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    code: z.string().min(1, "Code is required"),
    is_active: z.boolean(),
});

type ClusterFormData = z.infer<typeof clusterSchema>;

interface FormClusterDialogProps {
    mode?: 'add' | 'edit';
    clusterData?: GetClusterDto;
    trigger?: React.ReactNode;
}

export default function FormClusterDialog({
    mode = 'add',
    clusterData,
    trigger
}: FormClusterDialogProps) {
    const [open, setOpen] = useState(false);
    const mutation = useCreateCluster();
    const updateMutation = useUpdateCluster();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<ClusterFormData>({
        resolver: zodResolver(clusterSchema),
        defaultValues: {
            name: "",
            code: "",
            is_active: true,
        },
    });

    const isActive = watch("is_active");

    useEffect(() => {
        if (mode === 'edit' && clusterData && open) {
            setValue("name", clusterData.name);
            setValue("code", clusterData.code);
            setValue("is_active", clusterData.is_active);
        }
    }, [mode, clusterData, open, setValue]);

    const onSubmit = async (data: ClusterFormData) => {
        try {
            if (mode === 'edit' && clusterData) {
                await updateMutation.mutateAsync({ id: clusterData.id, payload: data });
            } else {
                await mutation.mutateAsync(data);
            }
            reset();
            setOpen(false);
        } catch (error) {
            console.error("Error saving cluster:", error);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setValue("is_active", checked);
    };

    const defaultTrigger = mode === 'add' ? (
        <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
        </Button>
    ) : (
        <Button variant="ghost" size="sm" className="hover:bg-transparent hover:text-primary">
            <Edit className="w-4 h-4" />
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add Cluster' : 'Edit Cluster'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Cluster Name</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Enter Cluster Name"
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            {...register("code")}
                            placeholder="Enter Cluster Code"
                            className={errors.code ? "border-destructive" : ""}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-500">{errors.code.message}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            checked={isActive}
                            onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="is_active">Status</Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : mode === 'add' ? "Save" : "Update"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
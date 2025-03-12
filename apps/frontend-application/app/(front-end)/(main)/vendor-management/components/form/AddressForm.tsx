'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui-custom/FormCustom';
import { Switch } from '@/components/ui/switch';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { AddressProps } from '../sections/AddressesSection';
import { z } from 'zod';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    mode: 'add' | 'edit';
    defaultValues?: Partial<AddressProps>;
    onSuccess: (values: AddressProps) => void;
}

const AddressSchema = z.object({
    id: z.string().optional(),
    addressType: z.enum(["MAIN", "BILLING", "SHIPPING", "BRANCH"]),
    addressLine: z.string().min(1),
    isPrimary: z.boolean(),
});

const AddressForm: React.FC<Props> = ({ mode, defaultValues, onSuccess }) => {
    const [open, setOpen] = useState(false);

    const form = useForm<AddressProps>({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            id: defaultValues?.id || '',
            addressType: defaultValues?.addressType || 'MAIN',
            addressLine: defaultValues?.addressLine || '',
            isPrimary: defaultValues?.isPrimary && true,
        },
    });

    const onSubmit = async (values: AddressProps) => {
        onSuccess(values);
        setOpen(false);
        form.reset();
    };

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={mode === 'add' ? 'default' : 'ghost'}
                    size={'sm'}
                >
                    {mode === 'add' ? (
                        <>
                            <PlusIcon className="h-4 w-4" />
                            Add Address
                        </>
                    ) : (
                        <PencilIcon className="w-4 h-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'Add' : 'Edit'} Address
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="addressLine"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Line</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Enter address line"
                                            error={!!form.formState.errors.addressLine}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="addressType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Address Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MAIN">Main</SelectItem>
                                                <SelectItem value="BILLING">Billing</SelectItem>
                                                <SelectItem value="SHIPPING">Shipping</SelectItem>
                                                <SelectItem value="BRANCH">Branch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPrimary"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Primary</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <div className="flex-end gap-2">
                                <Button type="button" variant="outline" onClick={handleClose} size={'sm'}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size={'sm'}
                                >
                                    {mode === 'add' ? 'Add' : 'Save'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddressForm;

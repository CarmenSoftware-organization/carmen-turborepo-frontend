'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CertificationProps } from '../sections/CertificationsSection';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui-custom/FormCustom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CertificateSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    issuer: z.string().min(1),
    validUntil: z.string().min(1),
    status: z.enum(['active', 'expired', 'pending'])
});

interface Props {
    mode: 'add' | 'edit';
    defaultValues?: Partial<CertificationProps>;
    onSuccess: (values: CertificationProps) => void;
}
const CertificateForm: React.FC<Props> = ({
    mode,
    defaultValues,
    onSuccess
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<CertificationProps>({
        resolver: zodResolver(CertificateSchema),
        defaultValues: {
            id: defaultValues?.id || '',
            name: defaultValues?.name || '',
            issuer: defaultValues?.issuer || '',
            validUntil: defaultValues?.validUntil || '',
            status: defaultValues?.status || 'active'
        }
    });

    const onSubmit = async (values: CertificationProps) => {
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
                            Add Certificate
                        </>
                    ) : (
                        <PencilIcon className="w-4 h-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'Add' : 'Edit'} Certificate
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address Line</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Enter address line"
                                            error={!!form.formState.errors.name}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issuer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issuer</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Enter issuer"
                                            error={!!form.formState.errors.issuer}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="validUntil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valid Until</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder="Enter valid until"
                                            error={!!form.formState.errors.validUntil}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full text-xs">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className='text-xs'>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="expired">Billing</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
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
    )
}

export default CertificateForm
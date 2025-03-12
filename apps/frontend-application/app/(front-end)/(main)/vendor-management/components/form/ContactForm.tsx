import React, { useState } from 'react'
import { ContactProps } from '../sections/ContactsSection';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui-custom/FormCustom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { Switch } from '@/components/ui/switch';

interface Props {
    mode: 'add' | 'edit';
    defaultValues?: Partial<ContactProps>;
    onSuccess: (values: ContactProps) => void;
}

const ContactSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    position: z.string().min(1),
    phone: z.string().min(1),
    department: z.string().min(1),
    email: z.string().min(1),
    isPrimary: z.boolean(),
});

const ContactForm: React.FC<Props> = ({
    mode,
    defaultValues,
    onSuccess
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<ContactProps>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            id: defaultValues?.id || '',
            name: defaultValues?.name || '',
            position: defaultValues?.position || '',
            phone: defaultValues?.phone || '',
            department: defaultValues?.department || '',
            email: defaultValues?.email || '',
            isPrimary: defaultValues?.isPrimary && true
        }
    });

    const onSubmit = async (values: ContactProps) => {
        onSuccess(values);
        setOpen(false);
        form.reset();
    }

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
                            Add Contact
                        </>
                    ) : (
                        <PencilIcon className="w-4 h-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'add' ? 'Add' : 'Edit'} Conta
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <InputCustom
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position</FormLabel>
                                        <FormControl>
                                            <InputCustom
                                                placeholder="Position"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <InputCustom
                                                placeholder="Phone"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <InputCustom
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <InputCustom
                                                placeholder="Department"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        </div>
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

export default ContactForm

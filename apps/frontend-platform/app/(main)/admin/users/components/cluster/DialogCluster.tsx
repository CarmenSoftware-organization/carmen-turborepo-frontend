"use client";

import React, { useEffect, useState } from 'react'
import { userPlatformFormSchema, UserPlatformFormValues, UserPlatformType } from '@/types/form/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultUserPlatformValues } from '@/types/form/default-value';
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MODULE_OPTION, ROLE_OPTION } from '@/types/option';
import { Switch } from '@/components/ui/switch';

interface Props {
    setClusterUsers: React.Dispatch<React.SetStateAction<UserPlatformType[]>>;
}
const DialogCluster = ({ setClusterUsers }: Props) => {

    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<Array<{ name: string; status: boolean }>>([]);
    const [selectedModules, setSelectedModules] = useState<Array<{ name: string; status: boolean }>>([]);

    const form = useForm<UserPlatformFormValues>({
        resolver: zodResolver(userPlatformFormSchema),
        defaultValues: defaultUserPlatformValues
    });

    useEffect(() => {
        if (!open) {
            form.reset();
            setSelectedRoles([]);
            setSelectedModules([]);
        }
    }, [open, form]);


    // Handle adding a role
    const handleAddRole = (value: string) => {
        if (!selectedRoles.some(r => r.name === value)) {
            const newRole = { name: value, status: true };
            const newRoles = [...selectedRoles, newRole];
            setSelectedRoles(newRoles);
            form.setValue('role', newRoles);
        }
    };

    // Handle removing a role
    const handleRemoveRole = (role: string) => {
        const newRoles = selectedRoles.filter(r => r.name !== role);
        setSelectedRoles(newRoles);
        form.setValue('role', newRoles);
    };

    const handleAddModule = (value: string) => {
        if (!selectedModules.some(m => m.name === value)) {
            const newModule = { name: value, status: true };
            const newModules = [...selectedModules, newModule];
            setSelectedModules(newModules);
            form.setValue('modules', newModules);
        }
    };

    // Handle removing a module
    const handleRemoveModule = (module: string) => {
        const newModules = selectedModules.filter(m => m.name !== module);
        setSelectedModules(newModules);
        form.setValue('modules', newModules);
    };

    const handleSubmit = async (data: UserPlatformFormValues) => {
        const transformedData: UserPlatformType = {
            name: data.name,
            email: data.email,
            roles: data.role.map(r => ({ ...r, status: true })),
            business_units: data.business_unit,
            status: data.status,
            hotelGroup: data.hotel_group || '',
            modules: data.modules,
            department: '',
            lastActive: new Date().toISOString(),
            hotel: '',
        };

        setClusterUsers((prevUsers: UserPlatformType[]) => [...prevUsers, transformedData]);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'}>
                    <PlusCircle className="w-4 h-4" />
                    Add Cluster User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Cluster User</DialogTitle>
                    <DialogDescription>
                        Fill in the user details to create a new cluster user.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <Form {...form}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter name" {...field} />
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
                                            <Input placeholder="Enter email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hotel_group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel Group</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Hotel Group" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <FormLabel>Roles</FormLabel>
                                <Select onValueChange={handleAddRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(ROLE_OPTION).map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedRoles.map((role) => (
                                        <Badge key={role.name} variant="secondary" className="flex items-center gap-1">
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => handleRemoveRole(role.name)}
                                            >
                                                <X className="h-3 w-3" />
                                                <span className="sr-only">Remove {role.name}</span>
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Modules</FormLabel>
                                <Select onValueChange={handleAddModule}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MODULE_OPTION.map((module) => (
                                            <SelectItem key={module.key} value={module.key}>
                                                {module.value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedModules.map((module) => (
                                        <Badge key={module.name} variant="secondary" className="flex items-center gap-1">
                                            {module.name.charAt(0).toUpperCase() + module.name.slice(1)}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => handleRemoveModule(module.name)}
                                            >
                                                <X className="h-3 w-3" />
                                                <span className="sr-only">Remove {module.name}</span>
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <div className="mb-2">
                                                <FormLabel className="text-base font-semibold">Account Status</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Toggle to enable or disable user access to the platform
                                                </p>
                                            </div>
                                            <FormControl>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked);
                                                        }}
                                                    />
                                                    <span className={`text-sm ${field.value ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}`}>
                                                        {field.value ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Submit</Button>
                    </Form>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DialogCluster;
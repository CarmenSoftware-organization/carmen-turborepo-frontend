'use client';

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userPlatformFormSchema, UserPlatformFormValues, UserPlatformType } from "@/types/form/form";
import { defaultUserPlatformValues } from "@/types/form/default-value";
import { DialogFooter, DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormLabel, FormMessage, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X } from "lucide-react";
import { postUserPlatform } from "@/services/user/platform";

interface RoleItem {
    name: string;
    id?: string;
    status: boolean;
}

interface DialogPlatformProps {
    setUserPlatform: (users: UserPlatformType[]) => void;
    userPlatform: UserPlatformType[];
}

const DialogPlatform: React.FC<DialogPlatformProps> = ({ setUserPlatform, userPlatform }) => {
    const [open, setOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<RoleItem[]>([]);
    const [selectedBusinessUnits, setSelectedBusinessUnits] = useState<RoleItem[]>([]);

    const form = useForm<UserPlatformFormValues>({
        resolver: zodResolver(userPlatformFormSchema),
        defaultValues: defaultUserPlatformValues
    });

    useEffect(() => {
        if (!open) {
            form.reset();
            setSelectedRoles([]);
            setSelectedBusinessUnits([]);
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

    // Handle adding a business unit
    const handleAddBusinessUnit = (value: string) => {
        if (!selectedBusinessUnits.some(bu => bu.name === value)) {
            const newBU = { name: value, status: true };
            const newBUs = [...selectedBusinessUnits, newBU];
            setSelectedBusinessUnits(newBUs);
            form.setValue('business_unit', newBUs);
        }
    };

    // Handle removing a business unit
    const handleRemoveBusinessUnit = (bu: string) => {
        const newBUs = selectedBusinessUnits.filter(b => b.name !== bu);
        setSelectedBusinessUnits(newBUs);
        form.setValue('business_unit', newBUs);
    };

    const handleSubmit = async (data: UserPlatformFormValues) => {
        const formData: UserPlatformFormValues = {
            name: data.name,
            email: data.email,
            role: data.role,
            business_unit: data.business_unit,
            modules: data.modules,
            status: data.status,
            last_active: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Then transform it to UserPlatformType for the UI state
        const newUser: UserPlatformType = {
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            roles: data.role.map(r => ({
                name: r.name,
                status: data.status,
                id: r.id
            })),
            business_units: data.business_unit.map(bu => ({
                name: bu.name,
                status: data.status,
                id: bu.id
            })),
            status: data.status,
            hotelGroup: 'default',
            modules: [],
            department: 'default',
            lastActive: new Date().toISOString(),
            hotel: 'default'
        };

        // Update UI state with transformed data
        setUserPlatform([...userPlatform, newUser]);

        try {
            // Send the form data to API
            const response = await postUserPlatform(formData);
            if (response) {

                setOpen(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'}>
                    <PlusCircle className="w-4 h-4" />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Fill in the user details to create a new platform user.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid gap-4 py-4">

                            {/* Name field */}
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
                            {/* Email field */}
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

                            {/* Role multi-select */}
                            <div className="space-y-2">
                                <FormLabel>Roles</FormLabel>
                                <Select onValueChange={handleAddRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="member">Member</SelectItem>
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

                            {/* Business Unit multi-select */}
                            <div className="space-y-2">
                                <FormLabel>Business Units</FormLabel>
                                <Select onValueChange={handleAddBusinessUnit}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Add business unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bu-1">BU-1</SelectItem>
                                        <SelectItem value="bu-2">BU-2</SelectItem>
                                        <SelectItem value="bu-3">BU-3</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedBusinessUnits.map((bu) => (
                                        <Badge key={bu.name} variant="secondary" className="flex items-center gap-1">
                                            {bu.name.toUpperCase()}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => handleRemoveBusinessUnit(bu.name)}
                                            >
                                                <X className="h-3 w-3" />
                                                <span className="sr-only">Remove {bu.name}</span>
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Status toggle */}
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
                        <DialogFooter>
                            <Button type="submit" size={'sm'}>Add User</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogPlatform;
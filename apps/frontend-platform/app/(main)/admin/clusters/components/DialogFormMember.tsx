"use client"

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clusterMemberFormSchema, ClusterMemberFormValues } from "@/types/form/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { postMember } from "@/services/cluster/member";
import { defaultClusterMemberValues } from "@/types/form/default-value";

const DialogFormMember = () => {
    const [open, setOpen] = useState(false);

    const form = useForm<ClusterMemberFormValues>({
        resolver: zodResolver(clusterMemberFormSchema),
        defaultValues: defaultClusterMemberValues
    });

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);

    const handleSubmit = async (data: ClusterMemberFormValues) => {
        const response = await postMember(data);
        if (response.success) {
            console.log("success");
        } else {
            console.log("error");
        }
        setOpen(false);
    };

    const handleAddBusinessUnit = () => {
        const currentUnits = form.getValues("business_unit");
        form.setValue("business_unit", [
            ...currentUnits,
            { name: "", role: "", department: "" }
        ]);
    };

    const handleRemoveBusinessUnit = (index: number) => {
        const currentUnits = form.getValues("business_unit");
        form.setValue(
            "business_unit",
            currentUnits.filter((_, i) => i !== index)
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Add Member</Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>Add Cluster Member</DialogTitle>
                    <DialogDescription>
                        Add a new member to the cluster
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <Input placeholder="Enter email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="platform"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select platform" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="web">Web</SelectItem>
                                                <SelectItem value="mobile">Mobile</SelectItem>
                                                <SelectItem value="desktop">Desktop</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="member">Member</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Business Units</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddBusinessUnit}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add Business Unit
                                </Button>
                            </div>

                            <div className="border rounded-md">
                                <div className="w-full">
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[30%]">Business Unit Name</TableHead>
                                                <TableHead className="w-[30%]">Role</TableHead>
                                                <TableHead className="w-[30%]">Department</TableHead>
                                                <TableHead className="w-[10%]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </div>
                                <ScrollArea className="h-[200px]">
                                    <Table className="w-full">
                                        <TableBody>
                                            {form.watch("business_unit").map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="w-[30%]">
                                                        <FormField
                                                            control={form.control}
                                                            name={`business_unit.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem className="mb-0">
                                                                    <FormControl>
                                                                        <Input placeholder="Enter name" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="w-[30%]">
                                                        <FormField
                                                            control={form.control}
                                                            name={`business_unit.${index}.role`}
                                                            render={({ field }) => (
                                                                <FormItem className="mb-0">
                                                                    <FormControl>
                                                                        <Input placeholder="Enter role" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="w-[30%]">
                                                        <FormField
                                                            control={form.control}
                                                            name={`business_unit.${index}.department`}
                                                            render={({ field }) => (
                                                                <FormItem className="mb-0">
                                                                    <FormControl>
                                                                        <Input placeholder="Enter department" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="w-[10%] text-right">
                                                        {index > 0 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handleRemoveBusinessUnit(index)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                            {form.formState.errors.business_unit?.message && (
                                <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.business_unit.message}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    form.reset();
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Add Member</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default DialogFormMember;
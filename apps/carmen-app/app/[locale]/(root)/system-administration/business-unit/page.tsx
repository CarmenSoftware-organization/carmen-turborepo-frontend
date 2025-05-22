"use client";

import { useAuth } from "@/context/AuthContext";
import { useCreateSystemUnitBuMutation, useSystemUnitBuQuery } from "@/hooks/useSystemConfig";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GetAllSystemUnitBuDto, SystemBuFormValue, systemUnitBuSchema } from "@/dtos/system.dto";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import ClusterLookup from "@/components/lookup/ClusterLookup";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";



export default function BusinessUnitPage() {
    const { token } = useAuth();
    const { data } = useSystemUnitBuQuery(token);
    const { mutate: createSystemUnitBu, isPending, isSuccess } = useCreateSystemUnitBuMutation(token);

    const form = useForm<SystemBuFormValue>({
        resolver: zodResolver(systemUnitBuSchema),
        defaultValues: {
            cluster_id: "",
            code: "",
            name: "",
            is_hq: false,
            is_active: true,
        },
    });

    useEffect(() => {
        if (isSuccess) {
            form.reset();
        }
    }, [isSuccess, form]);

    const isValid = form.watch(['cluster_id', 'code', 'name']).every(Boolean);

    const onSubmit = (values: SystemBuFormValue) => {
        try {
            // Explicitly validate with the schema
            const validatedData = systemUnitBuSchema.parse(values);
            createSystemUnitBu(validatedData);
        } catch (error) {
            console.error("Validation error:", error);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <Card className="p-4">
                    <p className="text-base font-semibold">Create a new business unit to the system</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="cluster_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cluster</FormLabel>
                                            <FormControl>
                                                <ClusterLookup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder="Select cluster"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter cluster code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter cluster name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_hq"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex flex-col gap-4 mt-2">
                                                <FormLabel>HQ</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </div>

                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex flex-col gap-4 mt-2">
                                                <FormLabel>Active Status</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </div>

                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={isPending || !isValid} size="sm">
                                {isPending ? "Creating..." : "Create Business Unit"}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </div>

            <div>
                <h1 className="text-2xl font-bold">Business Unit</h1>
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>HQ</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data.map((item: GetAllSystemUnitBuDto, i: number) => (
                            <TableRow key={item.id}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Badge variant={item.is_hq ? "default" : "secondary"}>
                                        {item.is_hq ? "Yes" : "No"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.is_active ? "active" : "inactive"}>
                                        {item.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

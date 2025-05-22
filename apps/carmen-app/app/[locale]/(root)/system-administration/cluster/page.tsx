"use client";

import { useAuth } from "@/context/AuthContext";
import { ClusterPostDto } from "@/dtos/cluster.dto";
import { useClusterMutation, useClusterQuery } from "@/hooks/useCluster";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define schema for form validation
const clusterSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    is_active: z.boolean().default(true),
});

export default function ClusterPage() {
    const { token } = useAuth();
    const { data: clusters, isLoading, isError, error } = useClusterQuery(token);
    const { mutate: createCluster, isPending } = useClusterMutation(token);

    // Initialize react-hook-form
    const form = useForm<z.infer<typeof clusterSchema>>({
        resolver: zodResolver(clusterSchema),
        defaultValues: {
            code: "",
            name: "",
            is_active: true,
        },
    });

    const isValid = form.watch(['code', 'name']).every(Boolean);

    const onSubmit = (values: z.infer<typeof clusterSchema>) => {
        const clusterData: ClusterPostDto = {
            code: values.code,
            name: values.name,
            is_active: values.is_active,
        };
        createCluster(clusterData);
        form.reset();
    };

    if (isLoading) {
        return <div className="p-4">Loading clusters...</div>;
    }

    if (isError) {
        return <div className="p-4 text-red-500">Error loading clusters: {error?.message}</div>;
    }


    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Cluster Management</h1>
            <Card className="p-4">
                <p className="text-base font-semibold">Create a new cluster to the system</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <div className="grid grid-cols-3 gap-4">
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
                            {isPending ? "Creating..." : "Create Cluster"}
                        </Button>
                    </form>
                </Form>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Clusters</CardTitle>
                    <CardDescription>List of all clusters in the system</CardDescription>
                </CardHeader>
                <CardContent>
                    {clusters.data && clusters.data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clusters.data.map((cluster: any) => (
                                    <TableRow key={cluster.id}>
                                        <TableCell className="font-medium">{cluster.code}</TableCell>
                                        <TableCell>{cluster.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={cluster.is_active ? "active" : "inactive"}>
                                                {cluster.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground">No clusters found.</p>
                    )}
                </CardContent>
            </Card>


        </div>
    );
}
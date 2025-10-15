"use client";

import { useAuth } from "@/context/AuthContext";
import { ClusterGetDto, ClusterPostDto } from "@/dtos/cluster.dto";
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
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Edit, Trash2, Layers } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useTranslations } from "next-intl";

const clusterSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    is_active: z.boolean().default(true),
});

export default function ClusterComponent() {
    const { token } = useAuth();
    const tCommon = useTranslations('Common');
    const { data: clusters, isLoading, isError, error } = useClusterQuery(token);
    const { mutate: createCluster, isPending } = useClusterMutation(token);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState<ClusterGetDto | null>(null);

    // Form for Create
    const createForm = useForm<z.infer<typeof clusterSchema>>({
        resolver: zodResolver(clusterSchema),
        defaultValues: {
            code: "",
            name: "",
            is_active: true,
        },
    });

    // Form for Edit
    const editForm = useForm<z.infer<typeof clusterSchema>>({
        resolver: zodResolver(clusterSchema),
        defaultValues: {
            code: "",
            name: "",
            is_active: true,
        },
    });

    const isValid = createForm.watch(['code', 'name']).every(Boolean);

    const onSubmit = (values: z.infer<typeof clusterSchema>) => {
        const clusterData: ClusterPostDto = {
            code: values.code,
            name: values.name,
            is_active: values.is_active,
        };

        createCluster(clusterData, {
            onSuccess: () => {
                toastSuccess({ message: 'Create Success' });
                createForm.reset();
            },
            onError: (error) => {
                toastError({ message: `${error}` });
            },
        });
    };

    const handleEdit = (cluster: ClusterGetDto) => {
        setSelectedCluster(cluster);
        editForm.setValue("code", cluster.code);
        editForm.setValue("name", cluster.name);
        editForm.setValue("is_active", cluster.is_active);
        setEditDialogOpen(true);
    };

    const handleDelete = (cluster: ClusterGetDto) => {
        setSelectedCluster(cluster);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCluster) {
            toastSuccess({ message: 'Cluster deleted successfully' });
            setDeleteDialogOpen(false);
            setSelectedCluster(null);
        }
    };

    const confirmEdit = () => {
        if (selectedCluster) {
            toastSuccess({ message: 'Cluster updated successfully' });
            setEditDialogOpen(false);
            setSelectedCluster(null);
            editForm.reset();
        }
    };

    const columns = useMemo<ColumnDef<ClusterGetDto>[]>(
        () => [
            {
                accessorKey: "code",
                id: "code",
                header: ({ column }) => (
                    <DataGridColumnHeader column={column} title="Code" />
                ),
                cell: ({ row }) => (
                    <div className="font-medium text-foreground">{row.original.code}</div>
                ),
                size: 150,
                enableSorting: true,
            },
            {
                accessorKey: "name",
                id: "name",
                header: ({ column }) => (
                    <DataGridColumnHeader column={column} title="Name" />
                ),
                cell: ({ row }) => (
                    <div className="text-foreground">{row.original.name}</div>
                ),
                size: 200,
                enableSorting: true,
            },
            {
                accessorKey: "is_active",
                id: "status",
                header: ({ column }) => (
                    <DataGridColumnHeader column={column} title="Status" />
                ),
                cell: ({ row }) => {
                    return (
                        <StatusCustom is_active={row.original.is_active}>
                            {row.original.is_active ? tCommon("active") : tCommon("inactive")}
                        </StatusCustom>
                    );
                },
                size: 120,
                enableSorting: true,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(row.original)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(row.original)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ),
                size: 100,
                enableSorting: false,
            },
        ],
        [tCommon]
    );

    const table = useReactTable({
        columns,
        data: clusters?.data || [],
        pageCount: Math.ceil((clusters?.data?.length || 0) / pagination.pageSize),
        getRowId: (row: ClusterGetDto) => row.id,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isLoading) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Card className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-48" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4">
                <Card className="p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="text-destructive text-lg font-semibold">
                            Error loading clusters
                        </div>
                        <p className="text-muted-foreground">{error?.message}</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </div>
                </Card>
            </div>
        );
    }

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="p-4 bg-muted rounded-full">
                <Layers className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No clusters found</h3>
                <p className="text-sm text-muted-foreground">
                    Get started by creating your first cluster
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Clusters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {clusters?.data && clusters.data.length > 0 ? (
                            <DataGrid
                                table={table}
                                recordCount={clusters?.data?.length || 0}
                                tableLayout={{
                                    headerSticky: true,
                                    dense: true
                                }}
                            >
                                <div className="w-full space-y-2.5">
                                    <DataGridContainer>
                                        <ScrollArea>
                                            <DataGridTable />
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </DataGridContainer>
                                    <DataGridPagination />
                                </div>
                            </DataGrid>
                        ) : (
                            <EmptyState />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Cluster</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={createForm.control}
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
                                    control={createForm.control}
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
                                    control={createForm.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-4">
                                            <FormLabel>Active Status</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" size={'sm'} disabled={isPending || !isValid}>
                                    {isPending ? "Creating..." : "Create Cluster"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Cluster</DialogTitle>
                        <DialogDescription>
                            Update the cluster information
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <div className="space-y-4">
                            <FormField
                                control={editForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-4">
                                        <FormLabel>Active</FormLabel>
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
                    </Form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the cluster
                            <span className="font-semibold"> {selectedCluster?.name}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

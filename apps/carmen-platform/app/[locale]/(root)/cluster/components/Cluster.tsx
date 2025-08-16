"use client";

import { useCluster, useDeleteCluster } from "@/app/hooks/useCluster";
import { useURL } from "@/app/hooks/useURL";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GetClusterDto } from "@/dto/cluster.dto";
import { Code, List, Printer, Share, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FormClusterDialog from "./FormClusterDialog";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Cluster() {
    const { data, isLoading, error } = useCluster();
    const deleteMutation = useDeleteCluster();
    const [search, setSearch] = useURL("search");
    const [clusterToDelete, setClusterToDelete] = useState<GetClusterDto | null>(null);
    const clusterData = data?.data;

    const page = data?.paginate?.page;
    const pages = data?.paginate?.pages;
    const perpage = data?.paginate?.perpage;
    const total = data?.paginate?.total;

    if (error instanceof Error) return <div>Error: {error.message}</div>;

    const handleDelete = (cluster: GetClusterDto) => {
        setClusterToDelete(cluster);
    };

    const handleConfirmDelete = async () => {
        if (clusterToDelete) {
            await deleteMutation.mutateAsync(clusterToDelete.id);
            setClusterToDelete(null);
        }
    };

    const title = (
        <div className="flex items-center gap-2">
            <Image src="/icons/cluster.svg" alt="cluster" width={40} height={40} />
            <h1 className="text-2xl font-bold">Cluster</h1>
        </div>
    )

    const actionButtons = (
        <div className="flex items-center gap-2">
            <FormClusterDialog mode="add" />
            <Button variant="outline" size="sm">
                <Share className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
                <Printer className="w-4 h-4" />
            </Button>
        </div>
    );

    const filters = (
        <SearchInput
            defaultValue={search}
            onSearch={setSearch}
            placeholder="Search clusters..."
        />
    );

    const renderTableContent = (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center w-14">#</TableHead>
                    <TableHead>
                        <div className="flex items-center gap-2">
                            <List className="w-4 h-4" />
                            <span>Name</span>
                        </div>
                    </TableHead>
                    <TableHead>
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            <span>Code</span>
                        </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clusterData?.map((cluster: GetClusterDto, index: number) => (
                    <TableRow key={cluster.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                            <FormClusterDialog
                                mode="edit"
                                clusterData={cluster}
                                trigger={
                                    <span className="cursor-pointer hover:text-primary hover:underline">
                                        {cluster.name}
                                    </span>
                                }
                            />
                        </TableCell>
                        <TableCell>{cluster.code}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="gap-1.5">
                                <span
                                    className={cn(cluster.is_active ? "bg-green-500" : "bg-red-500", "size-1.5 rounded-full")}
                                    aria-hidden="true"
                                ></span>
                                {cluster.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-transparent hover:text-destructive"
                                onClick={() => handleDelete(cluster)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={renderTableContent}
                isLoading={isLoading}
            />

            <AlertDialog
                open={!!clusterToDelete}
                onOpenChange={(open) => !open && setClusterToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete Cluster</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete cluster{' '}
                            <span className="font-bold text-primary">
                                {clusterToDelete?.name}
                            </span>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
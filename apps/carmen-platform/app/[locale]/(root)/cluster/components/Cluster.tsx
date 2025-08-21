"use client";

import { useCluster, useDeleteCluster } from "@/app/hooks/useCluster";
import { useURL } from "@/app/hooks/useURL";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GetClusterDto } from "@/dto/cluster.dto";
import { Grid, List, Plus, Printer, Share } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import ClusterData from "./ClusterData";
import { useRouter } from "@/i18n/routing";

export default function Cluster() {
    const router = useRouter();
    const { data, isLoading, error } = useCluster();
    const deleteMutation = useDeleteCluster();
    const [search, setSearch] = useURL("search");
    const [view, setView] = useState<"list" | "grid">("list");
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

    const handleView = (view: "list" | "grid") => {
        setView(view);
    };

    const title = (
        <div className="flex items-center gap-2">
            <Image src="/icons/cluster.svg" alt="cluster" width={40} height={40} />
            <h1 className="text-2xl font-bold">Cluster</h1>
        </div>
    )

    const actionButtons = (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/cluster/new")}
            >
                <Plus className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
                <Share className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
                <Printer className="w-4 h-4" />
            </Button>
        </div>
    );

    const filters = (
        <div className="flex items-center justify-between">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder="Search clusters..."
            />
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView("list")}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView("grid")}
                >
                    <Grid className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );

    const renderTableContent = (
        <ClusterData
            clusterData={clusterData}
            handleDelete={handleDelete}
            view={view}
        />
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
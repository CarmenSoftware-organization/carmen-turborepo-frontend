"use client";

import { useCluster } from "@/app/hooks/useCluster";
import { useURL } from "@/app/hooks/useURL";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Code, List, Plus, Printer, Share, Trash2 } from "lucide-react";
import Image from "next/image";

interface ClusterType {
    id: string;
    code: string;
    name: string;
    is_active: boolean;
}

export default function Cluster() {
    const { data, isLoading, error } = useCluster();
    const [search, setSearch] = useURL("search");
    const clusterData = data?.data;


    if (isLoading) return <div className="animate-pulse">Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Image src="/icons/cluster.svg" alt="cluster" width={40} height={40} />
                <h1 className="text-2xl font-bold">Cluster</h1>
            </div>
            <div className="flex items-center justify-between">
                <SearchInput
                    defaultValue={search}
                    onSearch={setSearch}
                    placeholder="Search..."
                />
                <div className="flex items-center gap-2">
                    <Button variant="outline" size={'sm'}>
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size={'sm'}>
                        <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size={'sm'}>
                        <Printer className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">
                            #
                        </TableHead>
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
                    {clusterData?.map((cluster: ClusterType, index: number) => (
                        <TableRow key={cluster.id}>
                            <TableCell className="w-14 text-center">{index + 1}</TableCell>
                            <TableCell>{cluster.name}</TableCell>
                            <TableCell>{cluster.code}</TableCell>
                            <TableCell>{cluster.is_active ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size={'sm'} className="hover:bg-transparent hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
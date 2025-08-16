"use client";

import { useBu } from "@/app/hooks/useBu";
import { Code, CrownIcon, Info, List, Printer, Share, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SearchInput from "@/components/SearchInput";
import { useURL } from "@/app/hooks/useURL";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCluster } from "@/app/hooks/useCluster";

export default function Bu() {
    const { data, isLoading, error } = useBu();
    const { getClusterName } = useCluster();
    const [search, setSearch] = useURL("search");

    if (error instanceof Error) return <div>Error: {error.message}</div>;

    const buData = data?.data;

    const title = (
        <div className="flex items-center gap-2">
            <Image src="/icons/business.svg" alt="business" width={40} height={40} />
            <h1 className="text-2xl font-bold">Business Unit</h1>
        </div>
    );

    const actionButtons = (
        <div className="flex items-center gap-2">
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

    const content = (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center w-14">#</TableHead>
                    <TableHead>
                        <div className="flex items-center gap-2">
                            <List className="w-4 h-4" />
                            <span>Cluster</span>
                        </div>
                    </TableHead>
                    <TableHead>
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            <span>Code</span>
                        </div>
                    </TableHead>
                    <TableHead>
                        <div className="flex items-center gap-2">
                            <List className="w-4 h-4" />
                            <span>Name</span>
                        </div>
                    </TableHead>
                    <TableHead>
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span>Description</span>
                        </div>
                    </TableHead>
                    <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <CrownIcon className="w-4 h-4" />
                            <span>Headquarter</span>
                        </div>
                    </TableHead>
                    <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Info className="w-4 h-4" />
                            <span>Status</span>
                        </div>
                    </TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {buData?.map((bu: IBuDto, index: number) => (
                    <TableRow key={bu.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                            <span className="cursor-pointer hover:text-primary hover:underline">
                                {getClusterName(bu.cluster_id)}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="cursor-pointer hover:text-primary hover:underline">
                                {bu.code}
                            </span>
                        </TableCell>

                        <TableCell>
                            <span className="cursor-pointer hover:text-primary hover:underline">
                                {bu.name}
                            </span>
                        </TableCell>

                        <TableCell>
                            <span className="cursor-pointer hover:text-primary hover:underline">
                                {bu.description}
                            </span>
                        </TableCell>

                        <TableCell className="text-center">
                            <span className="cursor-pointer hover:text-primary hover:underline">
                                {bu.is_hq ? "HQ" : "Branch"}
                            </span>
                        </TableCell>

                        <TableCell className="text-center">
                            <span className="cursor-pointer hover:text-primary hover:underline">
                                {bu.is_active ? "Active" : "Inactive"}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-transparent hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        // <pre>{JSON.stringify(buData, null, 2)}</pre>
    )

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
            isLoading={isLoading}
        />
    )
}
"use client";

import { useURL } from "@/app/hooks/useURL";
import { useUserCluster } from "@/app/hooks/useUserCluster";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List, Plus, Printer, Share, User } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import UserClusterData from "./UserClusterData";

export default function ClusterUser() {
    const { data, isLoading, error } = useUserCluster();
    const [search, setSearch] = useURL("search");
    const [view, setView] = useState<"list" | "grid">("list");

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleView = (view: "list" | "grid") => {
        setView(view);
    };

    const title = (
        <div className="flex items-center gap-2">
            <User className="w-10 h-10" />
            <h1 className="text-2xl font-bold">User Cluster</h1>
        </div>
    );


    const actionButtons = (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
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
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
                <SearchInput
                    defaultValue={search}
                    onSearch={setSearch}
                    placeholder="Search clusters..."
                />
            </div>
            <div className="hidden md:flex gap-2">
                <Button
                    variant={view === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleView("list")}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    variant={view === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleView("grid")}
                >
                    <Grid className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );

    const content = (
        <UserClusterData
            userClusters={data}
            view={view}
        />
    );

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
            isLoading={isLoading}
        />
    );
}
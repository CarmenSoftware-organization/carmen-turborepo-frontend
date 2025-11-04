"use client";

import { useURL } from "@/app/hooks/useURL";
import { useUserCluster } from "@/app/hooks/useUserCluster";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Grid, List, Plus, Printer, Share } from "lucide-react";
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

  const title = <h1 className="text-2xl font-bold">User Cluster</h1>;

  const actionButtons = (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new user</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Print</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  const filters = (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <SearchInput defaultValue={search} onSearch={setSearch} placeholder="Search clusters..." />
      </div>
      <TooltipProvider>
        <div className="hidden md:flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => handleView("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>List view</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => handleView("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grid view</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );

  const content = <UserClusterData userClusters={data} view={view} />;

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

"use client";

import { useCluster } from "@/app/hooks/useCluster";
import { useURL } from "@/app/hooks/useURL";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Grid, List, Plus, Printer, Share } from "lucide-react";
import { useState } from "react";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import ClusterData from "./ClusterData";
import { useRouter } from "@/i18n/routing";

export default function Cluster() {
  const router = useRouter();
  const { data, isLoading, error } = useCluster();
  const [search, setSearch] = useURL("search");
  const [view, setView] = useState<"list" | "grid">("list");
  const clusterData = data?.data;

  // Pagination data available but not currently used
  // const page = data?.paginate?.page;
  // const pages = data?.paginate?.pages;
  // const perpage = data?.paginate?.perpage;
  // const total = data?.paginate?.total;

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  const handleView = (view: "list" | "grid") => {
    setView(view);
  };

  const title = <h1 className="text-2xl font-bold">Cluster</h1>;

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => router.push("/cluster/new")}>
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
        <SearchInput defaultValue={search} onSearch={setSearch} placeholder="Search clusters..." />
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

  const content = <ClusterData clusterData={clusterData} view={view} />;

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

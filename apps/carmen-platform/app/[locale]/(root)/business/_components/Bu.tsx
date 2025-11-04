"use client";

import { useBu } from "@/app/hooks/useBu";
import { Plus, Printer, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SearchInput from "@/components/SearchInput";
import { useURL } from "@/app/hooks/useURL";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import { Link } from "@/i18n/routing";
import BuList from "./BuList";

export default function Bu() {
  const { data, isLoading, error } = useBu();
  const [search, setSearch] = useURL("search");

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  const buData = data?.data;

  const title = <h1 className="text-2xl font-bold">Business Unit</h1>;

  const actionButtons = (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" asChild>
              <Link href={"/business/new"}>
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new BU</p>
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
    <SearchInput defaultValue={search} onSearch={setSearch} placeholder="Search clusters..." />
  );

  const content = <BuList buData={buData} />;

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

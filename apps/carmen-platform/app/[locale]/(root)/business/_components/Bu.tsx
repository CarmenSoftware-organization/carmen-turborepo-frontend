"use client";

import { useBu } from "@/app/hooks/useBu";
import { Code, CrownIcon, Info, List, Plus, Printer, Share, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SearchInput from "@/components/SearchInput";
import { useURL } from "@/app/hooks/useURL";
import DataDisplayTemplate from "@/components/template/DataDisplayTemplate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCluster } from "@/app/hooks/useCluster";
import { Link } from "@/i18n/routing";

export default function Bu() {
  const { data, isLoading, error } = useBu();
  const { getClusterName } = useCluster();
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
    <SearchInput defaultValue={search} onSearch={setSearch} placeholder="Search clusters..." />
  );

  const content = (
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

          <TableHead>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>Cluster</span>
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
              <Link
                href={`/business/${bu.id}`}
                className="cursor-pointer hover:text-primary hover:underline"
              >
                {bu.name}
              </Link>
            </TableCell>
            <TableCell>{bu.code}</TableCell>

            <TableCell>{getClusterName(bu.cluster_id)}</TableCell>
            <TableCell>{bu.description}</TableCell>

            <TableCell className="text-center">{bu.is_hq ? "HQ" : "Branch"}</TableCell>

            <TableCell className="text-center">{bu.is_active ? "Active" : "Inactive"}</TableCell>
            <TableCell className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-transparent hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    // <pre>{JSON.stringify(buData, null, 2)}</pre>
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

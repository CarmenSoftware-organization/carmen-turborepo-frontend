import { use, useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Activity, Calendar, Flag, Users, TrendingUp, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { convertStatus } from "@/utils/status";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";

interface RfpDtoPL {
  id: string;
  name: string;
  status: "active" | "inactive" | "draft" | "submit" | "completed";
  priority: "high" | "medium" | "low";
  description?: string;
  create_date: Date;
  res_rate: number;
  count_vendors: number;
}

interface Props {
  rfps: RfpDtoPL[];
}

export default function TabRFP({ rfps }: Props) {
  const tStatus = useTranslations("Status");
  const tHeader = useTranslations("TableHeader");
  const tPlt = useTranslations("PriceListTemplate");
  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  const columns = useMemo<ColumnDef<RfpDtoPL>[]>(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
        size: 50,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "name",
        // header: () => (
        //   <div className="flex items-center gap-2">
        //     <Megaphone className="h-4 w-4" />
        //     <span>RFP Name</span>
        //   </div>
        // ),
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tPlt("rpf_name")}
            icon={<Megaphone className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const rfp = row.original;
          return (
            <div className="max-w-[300px] truncate ellipsis">
              <Link
                href={`/vendor-management/request-price-list/${rfp.id}`}
                className="hover:underline text-primary"
              >
                {rfp.name}
              </Link>
            </div>
          );
        },
        enableSorting: false,
        size: 250,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("status")}
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex justify-center">
              <Badge variant={status}>{getStatusLabel(status)}</Badge>
            </div>
          );
        },
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tPlt("priority")}
            icon={<Flag className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const priority = row.original.priority;
          const variantMap = {
            high: "destructive" as const,
            medium: "default" as const,
            low: "secondary" as const,
          };
          return (
            <div className="flex justify-center">
              <Badge variant={variantMap[priority]} className="capitalize">
                {priority}
              </Badge>
            </div>
          );
        },
        enableSorting: false,
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "res_rate",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tPlt("res_rate")}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span className="font-medium">{row.original.res_rate}%</span>
          </div>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "count_vendors",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tPlt("count_vendor")}
            icon={<Users className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span>{row.original.count_vendors}</span>
          </div>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "create_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("create_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.create_date), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },
    ],
    [getStatusLabel]
  );

  const table = useReactTable({
    data: rfps,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: false,
  });

  return (
    <div className="space-y-8 mt-4">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{tPlt("link_rfps_desc")}</p>
        {rfps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Megaphone className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-medium mb-1"> {tPlt("no_rpf_linked")}</h3>
            <p className="text-xs text-muted-foreground max-w-sm">{tPlt("no_rpf_linked_desc")} </p>
          </div>
        ) : (
          <DataGrid
            table={table}
            recordCount={rfps.length}
            isLoading={false}
            loadingMode="skeleton"
            emptyMessage="No RFPs found"
            tableLayout={{
              headerSticky: false,
              dense: true,
              rowBorder: true,
              headerBackground: true,
              headerBorder: true,
              width: "fixed",
            }}
          >
            <DataGridContainer>
              <ScrollArea className="max-h-[500px]">
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
          </DataGrid>
        )}
      </div>
    </div>
  );
}

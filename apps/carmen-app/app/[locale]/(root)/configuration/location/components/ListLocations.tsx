import { Button } from "@/components/ui/button";
import {
  SortConfig,
  getSortableColumnProps,
  renderSortIcon,
} from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import { Activity, FileCheck, FileType, Info, List, MapPin, MoreHorizontal, Trash2 } from "lucide-react";
import { INVENTORY_TYPE } from "@/constants/enum";
import ButtonLink from "@/components/ButtonLink";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface Location {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly location_type: INVENTORY_TYPE;
  readonly is_active: boolean;
  readonly delivery_point?: {
    readonly name: string;
  };
  readonly physical_count_type: string;
}

interface ListLocationsProps {
  readonly locations: Location[];
  readonly isLoading: boolean;
  readonly sort?: SortConfig;
  readonly onSort?: (field: string) => void;
  readonly onPageChange?: (page: number) => void;
  readonly onSelectAll?: (isChecked: boolean) => void;
  readonly onSelect?: (id: string) => void;
  readonly selectedLocations?: string[];
  readonly perpage?: number;
  readonly setPerpage?: (perpage: number) => void;
}

export default function ListLocations({
  locations,
  isLoading,
  sort,
  onSort,
  onPageChange,
  onSelectAll,
  onSelect,
  selectedLocations,
  perpage,
  setPerpage
}: ListLocationsProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const tStoreLocation = useTranslations("StoreLocation");

  const getLocationType = (location_type: INVENTORY_TYPE) => {
    if (location_type === INVENTORY_TYPE.DIRECT) {
      return tStoreLocation("direct");
    } else if (location_type === INVENTORY_TYPE.CONSIGNMENT) {
      return tStoreLocation("consignment");
    }
    return tStoreLocation("inventory");
  }

  const columns: TableColumn[] = [
    {
      title: (
        <Checkbox
          checked={selectedLocations?.length === locations.length}
          onCheckedChange={onSelectAll}
        />
      ),
      dataIndex: "select",
      key: "select",
      width: "w-8",
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        return (
          <Checkbox
            checked={selectedLocations?.includes(record.key)}
            onCheckedChange={() => onSelect?.(record.key)}
          />
        );
      },
    },
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      width: "w-8",
      align: "center",
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="name"
          label={t("name")}
          sort={sort ?? { field: "name", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "name",
      key: "name",
      icon: <List className="h-4 w-4" />,
      align: "left",
      width: "w-40",
      render: (_: unknown, record: TableDataSource) => {
        const location = locations.find(l => l.id === record.key);
        if (!location) return null;
        return (
          <ButtonLink href={`/configuration/location/${location.id}`}>
            {location.name}
          </ButtonLink>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      icon: <Info className="h-4 w-4" />,
      align: "left",
      render: (description: string) => (
        <span className="truncate max-w-[300px] inline-block">
          {description}
        </span>
      ),
    },
    {
      title: t("type"),
      dataIndex: "location_type",
      key: "location_type",
      icon: <FileType className="h-4 w-4" />,
      align: "left",
      render: (_: unknown, record: TableDataSource) => {
        const location = locations.find(l => l.id === record.key);
        if (!location) return null;
        return (
          <p className="text-xs md:text-base">
            {getLocationType(location.location_type)}
          </p>
        );
      },
    },
    {
      title: "EOP",
      dataIndex: "eop",
      key: "eop",
      align: "center",
      icon: <FileCheck className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        return (
          <p>{record.eop === "yes" ? tCommon("yes") : tCommon("no")}</p>
        );
      },
    },
    {
      title: t("delivery_point"),
      dataIndex: "delivery_point",
      key: "delivery_point",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      title: t("status"),
      dataIndex: "is_active",
      key: "is_active",
      icon: <Activity className="h-4 w-4" />,
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        const location = locations.find(l => l.id === record.key);
        if (!location) return null;
        return (
          <div className="flex justify-center">
            <StatusCustom is_active={location.is_active}>
              {location.is_active ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        )
      },
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      align: "right",
      render: (_: unknown, record: TableDataSource) => {
        const location = locations.find(l => l.id === record.key);
        if (!location) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-destructive cursor-pointer hover:bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const dataSource: TableDataSource[] = locations.map((location, index) => ({
    select: false,
    key: location.id,
    no: index + 1,
    name: location.name,
    description: location.description,
    location_type: location.location_type,
    eop: location.physical_count_type,
    delivery_point: location.delivery_point?.name,
    is_active: location.is_active,
  }));

  return (
    <TableTemplate
      columns={columns}
      dataSource={dataSource}
      totalItems={locations.length}
      totalPages={1}
      currentPage={1}
      onPageChange={onPageChange}
      isLoading={isLoading}
      perpage={perpage}
      setPerpage={setPerpage}
    />
  );
}

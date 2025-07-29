import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { STORE_LOCATION_TYPE_COLOR } from "@/utils/badge-status-color";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SortConfig,
  getSortableColumnProps,
  renderSortIcon,
} from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import { FileText, Trash2 } from "lucide-react";
import EmptyData from "@/components/EmptyData";
import { INVENTORY_TYPE } from "@/constants/enum";
import ButtonLink from "@/components/ButtonLink";

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
}

export default function ListLocations({
  locations,
  isLoading,
  sort,
  onSort,
}: ListLocationsProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  const renderTable = () => {
    if (isLoading) return <TableBodySkeleton rows={8} />;
    if (locations.length === 0)
      return <EmptyData message={"Location data not found"} />;

    return (
      <TableBody>
        {locations?.map((location, i) => (
          <TableRow key={location.id}>
            <TableCell className="w-10">{i + 1}</TableCell>
            <TableCell>
              <ButtonLink href={`/configuration/location/${location.id}`}>
                {location.name}
              </ButtonLink>
              {location.description && (
                <p className="text-xs text-muted-foreground mt-[-8px]">
                  {location.description}
                </p>
              )}

            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
              <Badge
                className={STORE_LOCATION_TYPE_COLOR(location.location_type)}
              >
                {location.location_type.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
              {location.physical_count_type.toUpperCase()}
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">{location.delivery_point?.name}</TableCell>
            <TableCell className="text-center">
              <Badge variant={location.is_active ? "active" : "inactive"}>
                {location.is_active ? tCommon("active") : tCommon("inactive")}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Edit location"
                  className="h-7 w-7 hover:text-muted-foreground"
                  asChild
                >
                  <Link href={`/configuration/location/${location.id}`}>
                    <FileText className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`${location.is_active ? "Deactivate" : "Activate"} location`}
                  disabled={!location.is_active}
                  className="h-7 w-7 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead
              {...getSortableColumnProps("name", sort, onSort)}
              className="font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {t("name")}
                {renderSortIcon("name", sort)}
              </div>
            </TableHead>
            <TableHead
              {...getSortableColumnProps("location_type", sort, onSort)}
              className="hidden md:table-cell text-center font-semibold cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                {t("type")}
                {renderSortIcon("location_type", sort)}
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold">
              EOP
            </TableHead>
            <TableHead
              {...getSortableColumnProps("delivery_point", sort, onSort)}
              className="hidden md:table-cell text-center font-semibold cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                {t("delivery_point")}
                {renderSortIcon("delivery_point", sort)}
              </div>
            </TableHead>
            <TableHead
              {...getSortableColumnProps("is_active", sort, onSort)}
              className="text-center font-semibold cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                {t("status")}
                {renderSortIcon("is_active", sort)}
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        {renderTable()}
      </Table>
    </div>
  );
}

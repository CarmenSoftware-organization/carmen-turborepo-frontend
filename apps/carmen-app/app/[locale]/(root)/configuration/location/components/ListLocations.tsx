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

interface Location {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly location_type: INVENTORY_TYPE;
  readonly is_active: boolean;
  readonly delivery_point?: {
    readonly name: string;
  };
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
              <div>
                <p className="text-xs font-bold">{location.name}</p>
                <p className="text-xs text-muted-foreground">
                  {location.description}
                </p>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge
                className={STORE_LOCATION_TYPE_COLOR(location.location_type)}
              >
                {location.location_type.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{location.delivery_point?.name}</TableCell>
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
      <Table className="border">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead {...getSortableColumnProps("name", sort, onSort)}>
              <div className="flex items-center">
                {t("name")}
                {renderSortIcon("name", sort)}
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">{t("type")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("delivery_point")}
            </TableHead>
            <TableHead {...getSortableColumnProps("is_active", sort, onSort)}>
              <div className="flex items-center">
                {t("status")}
                {renderSortIcon("is_active", sort)}
              </div>
            </TableHead>
            <TableHead className="text-right">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        {renderTable()}
      </Table>
    </div>
  );
}

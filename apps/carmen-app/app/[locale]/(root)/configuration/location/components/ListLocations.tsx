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
} from "@/utils/table-sort";
import { useTranslations } from "next-intl";
import { FileText, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

  const getSortIcon = (field: string) => {
    if (!sort || sort.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sort.direction === "asc" ?
      <ArrowUp className="h-4 w-4" /> :
      <ArrowDown className="h-4 w-4" />;
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

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
              <Link
                href={`/configuration/location/${location.id}`}
                className="text-xs font-bold hover:underline text-primary hover:text-primary/80 font-medium"
              >
                {location.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {location.description}
              </p>
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
              <Badge
                className={STORE_LOCATION_TYPE_COLOR(location.location_type)}
              >
                {location.location_type.toUpperCase()}
              </Badge>
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
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                {t("name")}
                {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              <Button
                variant="ghost"
                onClick={() => handleSort("location_type")}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                {t("type")}
                {getSortIcon("location_type")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              {t("delivery_point")}
            </TableHead>
            <TableHead className="text-center">
              <Button
                variant="ghost"
                onClick={() => handleSort("is_active")}
                className="h-auto p-0 font-medium hover:bg-transparent"
              >
                {t("status")}
                {getSortIcon("is_active")}
              </Button>
            </TableHead>
            <TableHead className="text-right">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        {renderTable()}
      </Table>
    </div>
  );
}

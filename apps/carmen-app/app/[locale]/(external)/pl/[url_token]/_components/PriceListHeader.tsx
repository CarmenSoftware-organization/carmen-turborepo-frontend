import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/format/date";
import { PricelistExternalDto } from "./pl-external.dto";
import { Badge } from "@/components/ui/badge";

interface PriceListHeaderProps {
  data: PricelistExternalDto;
}

export default function PriceListHeader({ data }: PriceListHeaderProps) {
  const { dateFormat } = useAuth();
  return (
    <div className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">{data.pricelist_no}</h1>
          <p className="text-muted-foreground">{data.name}</p>
        </div>
        <Badge variant={data.status} className="font-bold">
          {data.status.toLocaleUpperCase()}
        </Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
        <div>
          <span className="text-muted-foreground">Vendor Name:</span>{" "}
          <span className="font-medium">{data.vendor_name || "-"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Currency:</span>{" "}
          <span className="font-medium">{data.currency_code}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Date:</span>{" "}
          <span className="font-medium">
            {formatDate(data.effective_from_date, dateFormat || "yyyy-MM-dd")} -{" "}
            {formatDate(data.effective_to_date, dateFormat || "yyyy-MM-dd")}
          </span>
        </div>
        {data.description && (
          <div className="col-span-2 md:col-span-4">
            <span className="text-muted-foreground">Description:</span>{" "}
            <span className="font-medium">{data.description}</span>
          </div>
        )}
        {data.note && (
          <div className="col-span-2 md:col-span-4">
            <span className="text-muted-foreground">Note:</span>{" "}
            <span className="font-medium">{data.note}</span>
          </div>
        )}
      </div>
    </div>
  );
}

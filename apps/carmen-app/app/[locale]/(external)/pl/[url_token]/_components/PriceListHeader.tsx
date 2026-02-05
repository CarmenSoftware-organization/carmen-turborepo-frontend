import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/format/date";
import { PricelistExternalDto } from "./pl-external.dto";

interface PriceListHeaderProps {
  data: PricelistExternalDto;
}

export default function PriceListHeader({ data }: PriceListHeaderProps) {
  const { dateFormat } = useAuth();
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">{data.pricelist_no}</h1>
          <p className="text-muted-foreground">{data.name}</p>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
          {data.status}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
        <div>
          <span className="text-muted-foreground">Vendor Name:</span> {data.vendor_name}
        </div>
        <div>
          <span className="text-muted-foreground">Currency:</span> {data.currency_code}
        </div>
        <div>
          <span className="text-muted-foreground">Date:</span>{" "}
          {formatDate(data.effective_from_date, dateFormat || "yyyy-MM-dd")} -{" "}
          {formatDate(data.effective_to_date, dateFormat || "yyyy-MM-dd")}
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Description:</span> {data.description}
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Note:</span> {data.note}
        </div>
      </div>
    </div>
  );
}

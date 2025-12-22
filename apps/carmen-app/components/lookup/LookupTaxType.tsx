import { PropsLookup } from "@/dtos/lookup.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTaxTypeInventoryQuery } from "@/hooks/useTaxTypeInventory";

export default function LookupTaxType({
  value,
  onValueChange,
  placeholder = "Select tax type",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, buCode } = useAuth();

  const { data: taxTypeData, isLoading } = useTaxTypeInventoryQuery(token, buCode);

  if (isLoading) {
    return (
      <div className="relative w-full">
        <Select disabled value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </Select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {taxTypeData && taxTypeData.length > 0 ? (
          taxTypeData.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="empty" disabled>
            No tax types available.
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}

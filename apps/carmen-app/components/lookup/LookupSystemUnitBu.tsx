"use client";

import { PropsLookup } from "@/dtos/lookup.dto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSystemUnitBuQuery } from "@/hooks/useSystemConfig";
import { useAuth } from "@/context/AuthContext";
import { GetAllSystemUnitBuDto } from "@/dtos/system.dto";

export default function LookupSystemUnitBu({
  value,
  onValueChange,
  placeholder = "Select system unit bu",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token } = useAuth();
  const { data, isLoading } = useSystemUnitBuQuery(token);
  const systemUnitBu = data?.data ?? [];
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
        {systemUnitBu.map((item: GetAllSystemUnitBuDto) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { ChevronsUpDown } from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";

interface Props {
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function LookupDeliveryPoint({
  value = "",
  onValueChange,
  placeholder = "Search delivery point...",
  className = "",
}: Props) {

  const { token, tenantId } = useAuth();

  const { deliveryPoints, isLoading } = useDeliveryPointQuery({
    token: token,
    tenantId: tenantId,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterData = (
    deliveryPoints: { data: DeliveryPointGetDto[] },
    term: string
  ): { data: DeliveryPointGetDto[] } => {
    if (!term.trim()) return deliveryPoints;

    return {
      data: deliveryPoints.data.filter((item: DeliveryPointGetDto) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      ),
    };
  };

  const highlightMatch = (
    text: string,
    searchTerm: string
  ): React.ReactNode => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={`${text}-${index}`} className="text-primary font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleInputChange = (inputValue: string): void => {
    setSearchTerm(inputValue);
    setIsDropdownOpen(true);
  };

  const handleInputClick = (): void => {
    setIsDropdownOpen(true);
  };

  const handleSelectItem = (item: DeliveryPointGetDto): void => {
    setSearchTerm(item.name);
    setIsDropdownOpen(false);
    onValueChange?.(item.id || "");
  };

  const filteredData = deliveryPoints?.data
    ? filterData(deliveryPoints, searchTerm)
    : { data: [] };

  // แก้ไข useEffect เพื่อแก้ปัญหาการ map ข้อมูล
  useEffect(() => {
    // ตรวจสอบว่ามี value และข้อมูลโหลดเสร็จแล้ว
    if (value && deliveryPoints?.data && !isLoading) {
      const selectedDeliveryPoint = deliveryPoints.data.find(
        (dp: DeliveryPointGetDto) => dp.id === value
      );

      if (selectedDeliveryPoint) {
        setSearchTerm(selectedDeliveryPoint.name);
      } else {
        // ถ้าหาไม่เจอ ให้เคลียร์ searchTerm
        setSearchTerm("");
      }
    } else if (!value) {
      // ถ้าไม่มี value ให้เคลียร์ searchTerm
      setSearchTerm("");
    }
  }, [value, deliveryPoints, isLoading]); // เพิ่ม isLoading ใน dependency array

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={handleInputClick}
          className="pr-10"
        />
        <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {isDropdownOpen && filteredData?.data?.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-10 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            <div className="py-1">
              {filteredData?.data?.map((item: DeliveryPointGetDto) => (
                <button
                  key={`${item.id}-${item.name}`}
                  className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer text-xs"
                  onClick={() => handleSelectItem(item)}
                  type="button"
                >
                  <div className="font-medium text-xs">
                    {highlightMatch(item.name, searchTerm)}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isDropdownOpen && searchTerm.trim() && filteredData.data.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-10">
          <CardContent className="p-3">
            <div className="text-gray-500 text-center">No data found</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

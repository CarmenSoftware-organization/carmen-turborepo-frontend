"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ChevronsUpDown } from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";
import { cn } from "@/lib/utils";

interface Props {
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function LookupDeliveryPoint({
  value = "",
  onValueChange,
  placeholder = "Search...",
  className = "",
}: Props) {
  const { token, tenantId } = useAuth();

  const { deliveryPoints, isLoading } = useDeliveryPointQuery({
    token: token,
    tenantId: tenantId,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filterData = useCallback(
    (
      deliveryPoints: { data: DeliveryPointGetDto[] },
      term: string
    ): { data: DeliveryPointGetDto[] } => {
      if (!term.trim()) return deliveryPoints;

      return {
        data: deliveryPoints.data.filter((item: DeliveryPointGetDto) =>
          item.name.toLowerCase().includes(term.toLowerCase())
        ),
      };
    },
    []
  );

  const highlightMatch = useCallback(
    (text: string, searchTerm: string): React.ReactNode => {
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
    },
    []
  );

  const handleInputChange = (inputValue: string): void => {
    setSearchTerm(inputValue);
    setIsDropdownOpen(true);
    setSelectedIndex(-1);
  };

  const handleInputClick = (): void => {
    setIsDropdownOpen(true);
    setSelectedIndex(-1);
  };

  const handleSelectItem = (item: DeliveryPointGetDto): void => {
    setSearchTerm(item.name);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    onValueChange?.(item.id || "");
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!isDropdownOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsDropdownOpen(true);
        setSelectedIndex(0);
        e.preventDefault();
      }
      return;
    }

    const filteredItems = filteredData?.data || [];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredItems[selectedIndex]) {
          handleSelectItem(filteredItems[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const filteredData = deliveryPoints?.data
    ? filterData(deliveryPoints, debouncedSearchTerm)
    : { data: [] };
  const renderDropdownContent = (): React.ReactNode => {
    if (filteredData?.data?.length > 0) {
      return (
        <div
          role="listbox"
          aria-label="Delivery points"
        >
          {filteredData.data.map((item: DeliveryPointGetDto, index: number) => (
            <button
              key={`${item.id}-${item.name}`}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn(
                "w-full text-left p-2 cursor-pointer text-xs transition-colors duration-150",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                selectedIndex === index && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSelectItem(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              type="button"
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={-1}
            >
              <div className="font-medium text-xs">
                {highlightMatch(item.name, debouncedSearchTerm)}
              </div>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="p-3 text-center">
        <div className="text-gray-500 text-sm">
          {debouncedSearchTerm.trim() ? "No results found" : "Start typing to search..."}
        </div>
      </div>
    );
  };

  // Map value to display name
  useEffect(() => {
    if (value && deliveryPoints?.data && !isLoading) {
      const selectedDeliveryPoint = deliveryPoints.data.find(
        (dp: DeliveryPointGetDto) => dp.id === value
      );

      if (selectedDeliveryPoint) {
        setSearchTerm(selectedDeliveryPoint.name);
      } else {
        setSearchTerm("");
      }
    } else if (!value) {
      setSearchTerm("");
    }
  }, [value, deliveryPoints, isLoading]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          className={cn("bg-background pr-8", className)}
          autoComplete="off"
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-describedby={`${className}-description`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Dropdown with maximum z-index */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[9999]">
          <Card className="shadow-lg border border-border">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-3 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Loading...</div>
                </div>
              ) : (
                <div className="py-1 max-h-60 overflow-y-auto">
                  {renderDropdownContent()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden description for screen readers */}
      <div id={`${className}-description`} className="sr-only">
        Type to search for delivery points. Use arrow keys to navigate, Enter to select, Escape to close.
      </div>
    </div>
  );
}
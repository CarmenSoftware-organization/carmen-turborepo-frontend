"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronsUpDown } from "lucide-react";

const mockData: Employee[] = [
  {
    id: "carmen-01",
    name: "Lek",
    position: "CEO",
  },
  {
    id: "carmen-02",
    name: "Peak",
    position: "CFO",
  },
  {
    id: "carmen-03",
    name: "Aof",
    position: "TECH LEAD",
  },
  {
    id: "carmen-04",
    name: "Oat",
    position: "MANAGER",
  },
  {
    id: "carmen-05",
    name: "Kaowfang",
    position: "BACKEND DEVELOPER",
  },
  {
    id: "carmen-06",
    name: "Daew",
    position: "FRONTEND DEVELOPER",
  },
];

interface Employee {
  id: string;
  name: string;
  position: string;
}

interface EmployeeLookupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function EmployeeLookup({
  value = "",
  onValueChange,
  placeholder = "Search employee...",
  className = "",
}: EmployeeLookupProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterData = (employees: Employee[], term: string): Employee[] => {
    if (!term.trim()) return [];

    return employees.filter(
      (item) =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.position.toLowerCase().includes(term.toLowerCase())
    );
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
        <span key={index} className="text-primary font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleInputChange = (inputValue: string): void => {
    setSearchTerm(inputValue);
    setIsDropdownOpen(inputValue.trim().length > 0);
  };

  const handleSelectItem = (item: Employee): void => {
    setSearchTerm(item.name);
    setIsDropdownOpen(false);
    onValueChange?.(item.id);
  };

  const filteredData = filterData(mockData, searchTerm);

  // Update search term when value prop changes
  useEffect(() => {
    if (value) {
      const selectedEmployee = mockData.find((emp) => emp.id === value);
      if (selectedEmployee) {
        setSearchTerm(selectedEmployee.name);
      }
    } else {
      setSearchTerm("");
    }
  }, [value]);

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
          className="pr-10"
        />
        <ChevronsUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {isDropdownOpen && filteredData.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-10 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Name</TableHead>
                  <TableHead>Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectItem(item)}
                  >
                    <TableCell className="font-medium">
                      {highlightMatch(item.name, searchTerm)}
                    </TableCell>
                    <TableCell>
                      {highlightMatch(item.position, searchTerm)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {isDropdownOpen && searchTerm.trim() && filteredData.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-10">
          <CardContent className="p-3">
            <div className="text-gray-500 text-center">No data found</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

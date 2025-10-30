"use client";

import { SortConfig } from "@/utils/table";
import React from "react";

interface SortableColumnHeaderProps {
  columnKey: string;
  label: string;
  sort: SortConfig;
  onSort: (column: string) => void;
  getSortableColumnProps: (
    column: string,
    sort: SortConfig,
    onSort: (column: string) => void
  ) => React.HTMLAttributes<HTMLDivElement>;
  renderSortIcon: (column: string, sort: SortConfig) => React.ReactNode;
}

const SortableColumnHeader: React.FC<SortableColumnHeaderProps> = ({
  columnKey,
  label,
  sort,
  onSort,
  getSortableColumnProps,
  renderSortIcon,
}) => {
  return (
    <div {...getSortableColumnProps(columnKey, sort, onSort)} className="font-medium">
      <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
        {label}
        {renderSortIcon(columnKey, sort)}
      </div>
    </div>
  );
};

export default SortableColumnHeader;

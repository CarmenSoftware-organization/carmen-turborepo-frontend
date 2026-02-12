"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Button } from "@/components/ui/button";
import { useListPageState } from "@/hooks/use-list-page-state";
import { ChevronDown, FileDown, Printer, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InventoryBalanceList from "./InventoryBalanceList";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function InventoryBalanceComponent() {
  const tCommon = useTranslations("Common");
  const { search, setSearch, filter, setFilter } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="inventory-balance-list-filters">
      <Button variant={"outline"} size={"sm"}>
        Stock Card
      </Button>
      <Button variant={"outline"} size={"sm"}>
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </Button>
      <Button variant="outline" size={"sm"} data-id="inventory-balance-export-button">
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="inventory-balance-print-button">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="inventory-balance-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="inventory-balance-list-search-input"
      />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              Product
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Product</DropdownMenuItem>
            <DropdownMenuItem>Category</DropdownMenuItem>
            <DropdownMenuItem>Lot</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              FIFO
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>FIFO</DropdownMenuItem>
            <DropdownMenuItem>LIFO</DropdownMenuItem>
            <DropdownMenuItem>Weighted Avg</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
        />
      </div>
    </div>
  );

  const content = <InventoryBalanceList />;

  return (
    <DataDisplayTemplate
      title="Inventory Balance Report"
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}

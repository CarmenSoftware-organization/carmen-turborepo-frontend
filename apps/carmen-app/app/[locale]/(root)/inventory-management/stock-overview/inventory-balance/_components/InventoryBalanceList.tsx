"use client";
import { Button } from "@/components/ui/button";
import InventoryBalanceSummaryCard from "./InventoryBalanceSummaryCard";
import InventoryBalanceTabs from "./InventoryBalanceTabs";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import FilterInventoryBalance from "./FilterInventoryBalance";

export default function InventoryBalanceList() {
    const [filterOpen, setFilterOpen] = useState(false);

    const handleFilterOpen = () => {
        setFilterOpen(!filterOpen);
    }

    return (
        <div className="space-y-4">
            <InventoryBalanceSummaryCard />
            <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={handleFilterOpen}>
                    <FilterIcon className="w-4 h-4" />
                    Filter
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </div>

            {filterOpen && (
                <FilterInventoryBalance />
            )}
            <InventoryBalanceTabs />
        </div>
    );
}

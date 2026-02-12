import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MOBILE_ITEMS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];
const ROW_IDS = ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8", "row9", "row10"];
const GRID_ITEMS = Array.from({ length: 10 }, (_, i) =>
  Array.from({ length: 4 }, (_, j) => `grid-${i}-${j}`)
);

export default function SkeltonLoad() {
  return (
    <div className="border border-border rounded-lg">
      <div className="block md:hidden px-4 py-3">
        <div className="grid grid-cols-1 gap-3">
          {MOBILE_ITEMS.map((id) => (
            <Skeleton key={id} className="h-[100px] w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="hidden md:block divide-y divide-border">
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-3" />
          <div className="divide-y divide-border space-y-3">
            {GRID_ITEMS.map((row, i) => (
              <div key={ROW_IDS[i]} className="grid grid-cols-4 gap-4">
                {row.map((id) => (
                  <Skeleton key={id} className="h-4 w-full mt-3" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

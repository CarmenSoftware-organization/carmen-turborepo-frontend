import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MOBILE_ITEMS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];
const ROW_IDS = ["row1", "row2", "row3", "row4", "row5", "row6", "row7", "row8", "row9", "row10"];
const GRID_ITEMS = Array.from({ length: 10 }, (_, i) =>
  Array.from({ length: 4 }, (_, j) => `grid-${i}-${j}`)
);

export default function SkeltonLoad() {
  return (
    <div className="border border-gray-200 rounded-md">
      <div className="block md:hidden px-4 py-3">
        <div className="grid grid-cols-1 gap-4">
          {MOBILE_ITEMS.map((id) => (
            <Skeleton key={id} className="h-[125px] w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div className="hidden md:block divide-y divide-gray-200">
        <div className="border border-gray-200 rounded-md p-5">
          <Skeleton className="h-[50px] w-full mb-4" />
          <div className="divide-y divide-gray-200 space-y-4">
            {GRID_ITEMS.map((row, i) => (
              <div key={ROW_IDS[i]} className="grid grid-cols-4 gap-4">
                {row.map((id) => (
                  <Skeleton key={id} className="h-4 w-full mt-4" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

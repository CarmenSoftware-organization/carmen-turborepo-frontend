import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { mockBalanceReport } from "@/mock-data/inventory-balance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MovementHistoryList() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({});

  const handleToggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleSubSection = (id: string) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[350px]">Name</TableHead>
          <TableHead className="w-[150px]">Code</TableHead>
          <TableHead className="text-right">Total Quantity</TableHead>
          <TableHead className="text-right">Total Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockBalanceReport.map((section) => {
          const isExpanded = expandedSections[section.id] || false;
          const totalQuantity =
            section.sub_item?.reduce((sum, subItem) => sum + subItem.total_item_quantity, 0) ?? 0;
          const totalValue =
            section.sub_item?.reduce(
              (sum, subItem) =>
                sum + subItem.items.reduce((itemSum, item) => itemSum + item.value, 0),
              0
            ) ?? 0;

          return (
            <>
              <TableRow
                key={section.id}
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => handleToggleSection(section.id)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {section.sub_item?.length ? (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    ) : (
                      <span className="w-4" />
                    )}
                    {section.name}
                  </div>
                </TableCell>
                <TableCell>{section.code}</TableCell>
                <TableCell className="text-right">{formatNumber(totalQuantity)}</TableCell>
                <TableCell className="text-right">${formatNumber(totalValue)}</TableCell>
              </TableRow>

              {isExpanded &&
                section.sub_item?.map((subItem) => {
                  const isSubExpanded =
                    expandedSubSections[`${section.id}-${subItem.name}`] || false;
                  const subItemTotalValue = subItem.items.reduce(
                    (sum, item) => sum + item.value,
                    0
                  );

                  return (
                    <>
                      <TableRow
                        key={`${section.id}-${subItem.name}`}
                        className="cursor-pointer hover:bg-muted/60 bg-muted/30"
                        onClick={() => handleToggleSubSection(`${section.id}-${subItem.name}`)}
                      >
                        <TableCell className="font-medium">
                          <div className="fxr-c gap-2 pl-6">
                            {isSubExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            {subItem.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {subItem.description}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(subItem.total_item_quantity)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${formatNumber(subItemTotalValue)}
                        </TableCell>
                      </TableRow>

                      {isSubExpanded &&
                        subItem.items.map((item) => (
                          <TableRow key={item.id} className="bg-muted/10">
                            <TableCell className="font-medium">
                              <div className="fxr-c gap-2 pl-12">{item.name}</div>
                            </TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell className="text-right">
                              {item.unit_cost} ({item.unit})
                            </TableCell>
                            <TableCell className="text-right">
                              ${formatNumber(item.value)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  );
                })}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

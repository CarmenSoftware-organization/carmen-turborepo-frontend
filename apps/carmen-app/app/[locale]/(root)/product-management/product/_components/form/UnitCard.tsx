import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Table } from "@tanstack/react-table";
import { UnitRow } from "@/dtos/unit.dto";

interface UnitCardProps {
  title: string;
  addTooltip: string;
  onAdd: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  showAddButton: boolean;
  hasUnits: boolean;
  emptyMessage: string;
  noDataMessage: string;
  table: Table<UnitRow>;
  data: UnitRow[];
  rowClassName?: (row: UnitRow) => string;
  isUseinRecipe?: boolean;
}

const UnitCard = ({
  title,
  addTooltip,
  onAdd,
  disabled,
  showAddButton,
  hasUnits,
  emptyMessage,
  noDataMessage,
  table,
  data,
  rowClassName,
  isUseinRecipe,
}: UnitCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base text-muted-foreground font-semibold">{title}</h2>
        {showAddButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  onClick={onAdd}
                  disabled={disabled || isUseinRecipe === false}
                  className="w-6 h-6"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{addTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {hasUnits ? (
        <DataGrid
          table={table}
          recordCount={data.length}
          isLoading={false}
          loadingMode="skeleton"
          emptyMessage={noDataMessage}
          tableLayout={{
            headerSticky: true,
            dense: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
          }}
          {...(rowClassName && {
            meta: {
              getRowClassName: rowClassName,
            },
          })}
        >
          <div className="w-full">
            <DataGridContainer>
              <DataGridTable />
            </DataGridContainer>
          </div>
        </DataGrid>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </Card>
  );
};

export default UnitCard;

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { ExtraCostItem, ExtraCostDetailItem } from "@/types/grn-api.types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Control } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExtraCostProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
  readonly extraCostData?: ExtraCostItem[];
  readonly extraCostDetailData?: ExtraCostDetailItem[];
}

export default function ExtraCost({ mode, extraCostData, extraCostDetailData }: ExtraCostProps) {
  console.log(extraCostData);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">Extra Cost</p>
        {mode !== formType.VIEW && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div>
        {extraCostData?.map((data) => (
          <div key={data.id} className="text-sm text-muted-foreground">
            <p>Name: {data.name || "N/A"}</p>
            <p>Allocate Extra Cost Type: {data.allocate_extra_cost_type || "N/A"}</p>
            <p>Note: {data.note || "N/A"}</p>
          </div>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Extra Cost Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Tax Type Inventory</TableHead>
            <TableHead className="text-center">Tax Type</TableHead>
            <TableHead className="text-right">Tax Rate</TableHead>
            <TableHead className="text-right">Tax Amount</TableHead>
            <TableHead className="text-center">Tax Adjustment</TableHead>
            <TableHead>Note</TableHead>
            {mode !== formType.VIEW && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!extraCostDetailData || extraCostDetailData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={mode === formType.VIEW ? 8 : 9} className="text-center">
                No extra costs found
              </TableCell>
            </TableRow>
          ) : (
            extraCostDetailData.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.name || "N/A"}</TableCell>
                <TableCell className="text-right">{detail.amount || "0"}</TableCell>
                <TableCell>{detail.tax_profile_name || "N/A"}</TableCell>
                <TableCell className="text-center">{detail.tax_profile_name || "N/A"}</TableCell>
                <TableCell className="text-right">{detail.tax_rate || "0"}%</TableCell>
                <TableCell className="text-right">{detail.tax_amount || "0"}</TableCell>
                <TableCell className="text-center">
                  {detail.is_tax_adjustment ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-left">{detail.note || "N/A"}</TableCell>
                {mode !== formType.VIEW && (
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

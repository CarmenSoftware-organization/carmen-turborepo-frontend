import { formType } from "@/dtos/form.dto";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface BudgetPrProps {
  readonly mode: formType;
}

export default function BudgetPr({ mode }: BudgetPrProps) {
  const tCommon = useTranslations("Common");
  const [search, setSearch] = useURL("search");
  const isDisabled = mode === formType.VIEW;

  const handleAddNewItem = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("add new item");
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium px-2">Budget Allocation</p>

          <div className="flex flex-row items-center gap-1">
            <SearchInput
              defaultValue={search}
              onSearch={setSearch}
              placeholder={tCommon("search")}
              data-id="purchase-request-budget-search-input"
              containerClassName="w-full"
            />
            <Button size="sm">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            {!isDisabled && (
              <Button size="sm" onClick={handleAddNewItem}>
                <Plus className="h-3 w-3" />
                Add Item
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-semibold">Location</TableHead>
              <TableHead className="text-xs font-semibold">Category</TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Total Budget
              </TableHead>
              <TableHead className="text-center">
                <div>
                  <p className="text-xs font-semibold mb-2">Soft Commitment</p>
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-xs font-medium">Dept Head</p>
                    <p className="text-xs font-medium">Form PO</p>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Hard Commitment
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Available Budget
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Current PR Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBgData.map((item: BudgetItem) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="text-xs">{item.location}</TableCell>
                <TableCell className="text-xs">{item.category}</TableCell>
                <TableCell className="text-xs font-medium text-right">
                  {item.total_budget.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-xs">
                      {item.soft_commitment.dept_head.toLocaleString()}
                    </p>
                    <p className="text-xs">
                      {item.soft_commitment.form_po.toLocaleString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  {item.hard_commitment.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`text-xs font-medium text-right ${item.available_budget < 0 ? "text-red-500" : "text-green-600"}`}
                >
                  {item.available_budget.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-medium text-right">
                  {item.current_pr_amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-row items-center justify-between p-4">
          <p>Manage budget allocation for purchase requests</p>
          <div className="flex flex-row items-center gap-8">
            <div>
              <p className="text-xs font-medium">Total Request:</p>
              <p className="text-sm font-semibold">
                {mockBgData
                  .reduce((sum, item) => sum + item.current_pr_amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Total Available:</p>
              <p className="text-sm font-semibold">
                {mockBgData
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.total_budget -
                        item.soft_commitment.dept_head -
                        item.soft_commitment.form_po -
                        item.hard_commitment),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Remaining:</p>
              <p
                className={`text-sm font-semibold ${mockBgData.reduce(
                  (sum, item) =>
                    sum +
                    (item.total_budget -
                      item.soft_commitment.dept_head -
                      item.soft_commitment.form_po -
                      item.hard_commitment -
                      item.current_pr_amount),
                  0
                ) < 0
                    ? "text-red-500"
                    : "text-green-600"
                  }`}
              >
                {mockBgData
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.total_budget -
                        item.soft_commitment.dept_head -
                        item.soft_commitment.form_po -
                        item.hard_commitment -
                        item.current_pr_amount),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

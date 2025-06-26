import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface TransactionItem {
  description: string;
  amount: number;
  baseAmount: number;
}

export default function TransactionSummary() {
  const transactionData: TransactionItem[] = [
    { description: "Subtotal Amount", amount: 4499.85, baseAmount: 4499.85 },
    { description: "Discount Amount", amount: 325.0, baseAmount: 325.0 },
    { description: "Net Amount", amount: 4499.85, baseAmount: 4499.85 },
    { description: "Tax Amount", amount: 360.0, baseAmount: 360.0 },
    { description: "Total Amount", amount: 4859.85, baseAmount: 4859.85 },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Transaction Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Description</TableHead>
              <TableHead className="text-right">Amount (USD)</TableHead>
              <TableHead className="text-right">Base Amount (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData.map((item) => (
              <TableRow
                key={item.description}
                className={
                  item.description === "Total Amount" ? "font-medium" : ""
                }
              >
                <TableCell
                  className={
                    item.description === "Total Amount" ? "font-medium" : ""
                  }
                >
                  {item.description}
                </TableCell>
                <TableCell
                  className={`text-right ${item.description === "Total Amount" ? "font-medium" : ""}`}
                >
                  {formatCurrency(item.amount, "THB")}
                </TableCell>
                <TableCell
                  className={`text-right ${item.description === "Total Amount" ? "font-medium" : ""}`}
                >
                  {formatCurrency(item.baseAmount, "THB")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

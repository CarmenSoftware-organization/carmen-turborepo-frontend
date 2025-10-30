import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const fields = [
  {
    label: "Subtotal Amount",
    amount: 1200.02,
  },
  {
    label: "Discount Amount",
    amount: 1100.2,
  },
  {
    label: "Net Amount",
    amount: 7.0,
  },
  {
    label: "Tax Amount",
    amount: 7.0,
  },
  {
    label: "Total Amount",
    amount: 2314.0,
  },
];

export default function TransactionSummary() {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          {fields.map((field) => (
            <TableHead key={field.label}>{field.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {fields.map((field) => (
            <TableCell key={field.label}>
              {field.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

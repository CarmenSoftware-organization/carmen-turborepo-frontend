import { useTranslations } from "next-intl";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Hash, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface GrnsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly grns: any[];
}

export default function Grns({ grns }: GrnsProps) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tTableHeader = useTranslations("TableHeader");
  return (
    <div className="space-y-4">
      <p className="font-medium">{tPurchaseOrder("grns")}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-10">
              <Checkbox />
            </TableHead>
            <TableHead className="text-center w-10">
              <Hash className="h-3 w-3" />
            </TableHead>
            <TableHead className="text-left">{tTableHeader("grn_number")}</TableHead>
            <TableHead className="text-center">{tTableHeader("date")}</TableHead>
            <TableHead className="text-center">{tTableHeader("status")}</TableHead>
            <TableHead className="text-left">{tTableHeader("receiver")}</TableHead>
            <TableHead className="text-right">{tTableHeader("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grns.map((grn, index) => (
            <TableRow key={index}>
              <TableCell className="text-center w-10">
                <Checkbox />
              </TableCell>
              <TableCell className="text-center w-10">{index + 1}</TableCell>
              <TableCell className="text-left">{grn.no}</TableCell>
              <TableCell className="text-center">{grn.date}</TableCell>
              <TableCell className="text-center">{grn.status}</TableCell>
              <TableCell className="text-left">{grn.receiver}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size={"sm"}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size={"sm"}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { GoodsReceivedNoteListDto } from "@/dtos/grn.dto";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MoreHorizontal,
  Trash2,
  Calendar,
  Store,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import PaginationComponent from "@/components/PaginationComponent";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import EmptyData from "@/components/EmptyData";

interface GoodsReceivedNoteListProps {
  readonly goodsReceivedNotes: GoodsReceivedNoteListDto[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly isLoading: boolean;
}

export default function GoodsReceivedNoteList({
  goodsReceivedNotes,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: GoodsReceivedNoteListProps) {
  const t = useTranslations("TableHeader");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === goodsReceivedNotes.length) {
      // If all items are selected, unselect all
      setSelectedItems([]);
    } else {
      const allIds = goodsReceivedNotes
        .map((grn) => grn.id ?? "")
        .filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    goodsReceivedNotes?.length > 0 &&
    selectedItems.length === goodsReceivedNotes.length;

  const renderTableContent = () => {
    if (isLoading) {
      return <TableBodySkeleton rows={7} />;
    }

    if (goodsReceivedNotes.length === 0) {
      return <EmptyData message="No goods received notes found" />;
    }

    return (
      <TableBody>
        {goodsReceivedNotes?.map((grn) => (
          <TableRow key={grn.id}>
            <TableCell className="text-center w-10">
              <Checkbox
                id={`checkbox-${grn.id}`}
                checked={selectedItems.includes(grn.id ?? "")}
                onCheckedChange={() => handleSelectItem(grn.id ?? "")}
                aria-label={`Select ${grn.grn_no}`}
              />
            </TableCell>
            <TableCell className="w-[150px]">
              <Link
                href={`/procurement/goods-received-note/${grn.id}`}
                className="hover:underline text-primary hover:text-primary/80 font-medium"
              >
                {grn.grn_no ?? "-"}
              </Link>
            </TableCell>
            <TableCell className="w-[100px]">
              <Badge variant={grn.is_active ? "active" : "inactive"}>
                {grn.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="w-[100px]">{grn.vendor_name ?? "-"}</TableCell>
            <TableCell className="w-[100px]">
              {grn.created_at
                ? format(new Date(grn.created_at), "dd/MM/yyyy")
                : "-"}
            </TableCell>
            <TableCell className="text-right w-[100px]">{grn.total_amount}</TableCell>
            
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <Button variant="ghost" size={"sm"} asChild className="h-7 w-7">
                  <Link href={`/procurement/goods-received-note/${grn.id}`}>
                    <FileText className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size={"sm"} className="h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Print GRN</DropdownMenuItem>
                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                    <DropdownMenuItem>Copy Reference</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <Table>
          <TableHeader className="border">
            <TableRow className="bg-muted">
              <TableHead className="w-10 text-center">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all purchase requests"
                />
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {t("grn_number")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t("status")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  {t("vendor")}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t("date")}
                </div>
              </TableHead>
              <TableHead className="text-right w-[100px]">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {t("amount")}
                </div>
              </TableHead>
            
              <TableHead className="text-right">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableContent()}
        </Table>
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}

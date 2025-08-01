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
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import EmptyData from "@/components/EmptyData";
import ButtonLink from "@/components/ButtonLink";
import ButtonIcon from "@/components/ButtonIcon";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import FooterCustom from "@/components/table/FooterCustom";

interface GoodsReceivedNoteListProps {
  readonly goodsReceivedNotes: GoodsReceivedNoteListDto[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly isLoading: boolean;
  readonly totalItems?: number;
}

export default function GoodsReceivedNoteList({
  goodsReceivedNotes,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  totalItems
}: GoodsReceivedNoteListProps) {
  const t = useTranslations("TableHeader");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { dateFormat, amount, currencyBase } = useAuth();
  const defaultAmount = { locales: 'en-US', minimumIntegerDigits: 2 }

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
            <TableCell>
              <ButtonLink href={`/procurement/goods-received-note/${grn.id}`}>
                {grn.grn_no ?? "-"}
              </ButtonLink>
            </TableCell>
            <TableCell>
              <Badge variant={grn.is_active ? "active" : "inactive"}>
                {grn.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{grn.vendor_name ?? "-"}</TableCell>
            <TableCell>
              {formatDateFns(grn.created_at, dateFormat || 'yyyy-MM-dd')}
            </TableCell>
            <TableCell className="text-right w-[100px]">
              {formatPriceConf(grn.total_amount, amount ?? defaultAmount, currencyBase ?? 'THB')}
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <ButtonIcon href={`/procurement/goods-received-note/${grn.id}`}>
                  <FileText className="h-4 w-4" />
                </ButtonIcon>
                <Button variant="ghost" size={"sm"} className="h-7 w-7 hover:bg-transparent hover:text-destructive">
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
        <Table className="border">
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
                {t("grn_number")}
              </TableHead>
              <TableHead>
                {t("status")}
              </TableHead>
              <TableHead>
                {t("vendor")}
              </TableHead>
              <TableHead>
                {t("date")}
              </TableHead>
              <TableHead className="text-right w-[100px]">
                {t("amount")}
              </TableHead>

              <TableHead className="text-right">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableContent()}
          <FooterCustom
            totalPages={totalPages}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={onPageChange}
            colSpanItems={6}
            colSpanPagination={2}
          />
        </Table>
      </div>
    </div>
  );
}

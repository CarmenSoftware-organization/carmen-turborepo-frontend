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
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import EmptyData from "@/components/EmptyData";
import ButtonLink from "@/components/ButtonLink";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns } from "@/utils/config-system";
import FooterCustom from "@/components/table/FooterCustom";
import CreditNoteCard from "./CreditNoteCard";

interface CreditNoteListProps {
  readonly creditNotes: CreditNoteGetAllDto[];
  readonly isLoading: boolean;
  readonly totalItems: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

export default function CreditNoteList({
  creditNotes = [],
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  onPageChange
}: CreditNoteListProps) {
  const { dateFormat } = useAuth();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    if (!id) return;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === creditNotes.length) {
      setSelectedItems([]);
    } else {
      const allIds = creditNotes
        .filter((cn) => cn && cn.id)
        .map((cn) => cn.id as string);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    creditNotes?.length > 0 && selectedItems.length === creditNotes.length;


  const renderTableContent = () => {
    if (isLoading) {
      return <TableBodySkeleton rows={11} />;
    }

    if (!creditNotes?.length) {
      return <EmptyData message="No credit notes found" />;
    }

    return (
      <TableBody>
        {creditNotes.map((cn) => (
          <TableRow key={cn?.id || Math.random()}>
            <TableCell className="text-center w-10">
              <Checkbox
                id={`checkbox-${cn?.id}`}
                checked={cn?.id ? selectedItems.includes(cn.id) : false}
                onCheckedChange={() => cn?.id && handleSelectItem(cn.id)}
                aria-label={`Select ${cn?.cn_no || "item"}`}
              />
            </TableCell>
            <TableCell>
              <ButtonLink href={`/procurement/credit-note/${cn.id}`}>
                {cn?.cn_no}
              </ButtonLink>
            </TableCell>
            <TableCell>
              <Badge variant={cn?.doc_status}>{cn?.doc_status || "-"}</Badge>
            </TableCell>
            <TableCell>
              {formatDateFns(cn.cn_date, dateFormat || 'yyyy/MM/dd')}
            </TableCell>
            <TableCell>{cn?.note || "-"}</TableCell>
            <TableCell>{cn?.current_workflow_status || "-"}</TableCell>
            <TableCell>{cn?.last_action_name || "-"}</TableCell>
            <TableCell>{cn?.last_action_by_name || "-"}</TableCell>
            <TableCell>{cn?.last_action_date || "-"}</TableCell>

            <TableCell>
              <div className="flex items-center justify-end">
                <ButtonLink href={`/procurement/credit-note/${cn.id}/edit`}>
                  <FileText className="h-4 w-4" />
                </ButtonLink>
                <Button variant="ghost" size={"sm"} className="h-7 w-7">
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-10 text-center">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all credit notes"
                />
              </TableHead>
              <TableHead>Reference #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Workflow Status</TableHead>
              <TableHead>Last Action</TableHead>
              <TableHead>Last Action By</TableHead>
              <TableHead>Last Action Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableContent()}
          <FooterCustom
            totalPages={totalPages}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={onPageChange}
            colSpanItems={8}
            colSpanPagination={2}
          />
        </Table>
      </div>

      <div className="grid gap-4 md:hidden">
        <CreditNoteCard
          creditNotes={creditNotes}
          selectAll={handleSelectAll}
          selectItem={handleSelectItem}
          isSelected={isAllSelected}
          isLoading={isLoading}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
}

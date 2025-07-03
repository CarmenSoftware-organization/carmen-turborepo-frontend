import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import { format, isValid } from "date-fns";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import EmptyData from "@/components/EmptyData";
import { Link } from "@/lib/navigation";

interface CreditNoteListProps {
  readonly creditNotes: CreditNoteGetAllDto[];
  readonly isLoading: boolean;
}

export default function CreditNoteList({
  creditNotes = [],
  isLoading,
}: CreditNoteListProps) {
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

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MM/dd/yyyy") : "-";
  };

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
            <TableCell className="font-medium text-primary hover:underline cursor-pointer">
              <Link href={`/procurement/credit-note/${cn.id}`}>
                {cn?.cn_no}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant={cn?.doc_status}>{cn?.doc_status || "-"}</Badge>
            </TableCell>

            <TableCell>{formatDate(cn?.cn_date)}</TableCell>
            <TableCell>{cn?.note || "-"}</TableCell>
            <TableCell>{cn?.current_workflow_status || "-"}</TableCell>
            <TableCell>{cn?.last_action_name || "-"}</TableCell>
            <TableCell>{cn?.last_action_by_name || "-"}</TableCell>
            <TableCell>{cn?.last_action_date || "-"}</TableCell>
            
            <TableCell>
              <div className="flex items-center justify-end">
                <Button variant="ghost" size={"sm"} className="h-7 w-7" asChild>
                  <Link href={`/procurement/credit-note/${cn.id}`}>
                    <FileText className="h-4 w-4" />
                  </Link>
                </Button>
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
      {/* Desktop Table View */}
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
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {isAllSelected ? "Unselect All" : "Select All"}
          </Button>
          {selectedItems.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedItems.length} Items Selected
            </span>
          )}
        </div>
        {creditNotes.map((cn) => (
          <Card
            key={cn?.id || Math.random()}
            className="transition-all duration-200 hover:shadow-lg hover:border-primary/50"
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`mobile-checkbox-${cn?.id}`}
                    checked={cn?.id ? selectedItems.includes(cn.id) : false}
                    onCheckedChange={() => cn?.id && handleSelectItem(cn.id)}
                    aria-label={`Select ${cn?.cn_no || "item"}`}
                    className="mt-1"
                  />
                  <CardTitle className="text-base text-primary hover:underline cursor-pointer">
                    <Link href={`/procurement/credit-note/${cn.id}`}>
                      {cn.cn_no}
                    </Link>
                  </CardTitle>
                  <Badge variant={cn?.doc_status}>
                    {cn?.doc_status || "-"}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="h-7 w-7"
                    asChild
                  >
                    <Link href={`/procurement/credit-note/${cn.id}`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(cn?.cn_date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Note</p>
                  <p className="text-sm font-medium">{cn?.note || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Workflow Status
                  </p>
                  <p className="text-sm font-medium">
                    {cn?.current_workflow_status || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Action</p>
                  <p className="text-sm font-medium">
                    {cn?.last_action_name || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Last Action By
                  </p>
                  <p className="text-sm font-medium">
                    {cn?.last_action_by_name || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Last Action Date
                  </p>
                  <p className="text-sm font-medium">
                    {cn?.last_action_date || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

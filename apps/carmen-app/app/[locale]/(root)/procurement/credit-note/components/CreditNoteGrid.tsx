import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, SquarePen, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import { format } from "date-fns";

interface CreditNoteGridProps {
  readonly creditNotes: CreditNoteGetAllDto[];
  readonly isLoading: boolean;
}

export default function CreditNoteGrid({
  creditNotes,
  isLoading,
}: CreditNoteGridProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === creditNotes.length) {
      setSelectedItems([]);
    } else {
      const allIds = creditNotes.map((cn) => cn.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    creditNotes?.length > 0 && selectedItems.length === creditNotes.length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="col-span-full flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {isAllSelected ? "Unselect All" : "Select All"}
        </Button>
        {selectedItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} Items Selected
          </span>
        )}
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {creditNotes.map((cn) => (
            <Card
              key={cn.id}
              className="transition-all duration-200 hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader className="p-2 border-b bg-muted">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`grid-checkbox-${cn.id}`}
                      checked={selectedItems.includes(cn.id ?? "")}
                      onCheckedChange={() => handleSelectItem(cn.id ?? "")}
                      aria-label={`Select ${cn.cn_no}`}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {cn.cn_no}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(cn.cn_date), "MM/dd/yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={cn?.doc_status}
                  >
                    {cn.doc_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-xs font-medium line-clamp-2">
                      {cn.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Note</p>
                      <p className="text-xs font-medium">{cn.note}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Workflow Status
                      </p>
                      <p className="text-xs font-medium">
                        {cn.current_workflow_status}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Last Action
                      </p>
                      <p className="text-xs font-medium">
                        {cn.last_action_name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Last Action By
                      </p>
                      <p className="text-xs font-medium">
                        {cn.last_action_by_name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Last Action Date
                      </p>
                      <p className="text-xs font-medium">
                        {cn.last_action_date}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Workflow Name
                      </p>
                      <p className="text-xs font-medium">{cn.workflow_name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end p-2 border-t bg-muted">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7"
                  aria-label="View credit note"
                  data-id={`view-cn-${cn.id}`}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7"
                  aria-label="Edit credit note"
                  data-id={`edit-cn-${cn.id}`}
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7"
                  aria-label="Delete credit note"
                  data-id={`delete-cn-${cn.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

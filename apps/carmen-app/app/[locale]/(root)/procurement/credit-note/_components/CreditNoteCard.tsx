import ButtonIcon from "@/components/ButtonIcon";
import CardLoading from "@/components/loading/CardLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import { Link } from "@/lib/navigation";
import { formatDate } from "@/utils/format/date";
import { FileText, Trash2 } from "lucide-react";

interface CreditNoteCardProps {
  readonly creditNotes: CreditNoteGetAllDto[];
  readonly selectAll: () => void;
  readonly selectItem: (id: string) => void;
  readonly isSelected: boolean;
  readonly isLoading: boolean;
  readonly selectedItems: string[];
}

export default function CreditNoteCard({
  creditNotes,
  selectAll,
  selectItem,
  isSelected,
  isLoading,
  selectedItems,
}: CreditNoteCardProps) {
  const { dateFormat } = useAuth();
  return (
    <>
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={selectAll}>
          {isSelected ? "Unselect All" : "Select All"}
        </Button>
        {selectItem.length > 0 && (
          <span className="text-xs text-muted-foreground">{selectItem.length} Items Selected</span>
        )}
      </div>
      {isLoading ? (
        <CardLoading items={5} />
      ) : (
        creditNotes?.map((cn) => (
          <Card
            key={cn?.id}
            className="transition-all duration-200 hover:shadow-lg hover:border-primary/50"
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`mobile-checkbox-${cn?.id}`}
                    checked={cn?.id ? selectedItems.includes(cn.id) : false}
                    onCheckedChange={() => cn?.id && selectItem(cn.id)}
                    aria-label={`Select ${cn?.cn_no || "item"}`}
                    className="mt-1"
                  />
                  <CardTitle className="text-base text-primary hover:underline cursor-pointer">
                    <Link
                      href={`/procurement/credit-note/${cn.id}`}
                      className="hover:underline hover:underline-offset text-primary dark:text-primary-foreground hover:text-primary/80"
                    >
                      {cn.cn_no}
                    </Link>
                  </CardTitle>
                  <Badge variant={cn?.doc_status}>{cn?.doc_status || "-"}</Badge>
                </div>
                <div className="flex items-center">
                  <ButtonIcon href={`/procurement/credit-note/${cn.id}`}>
                    <FileText />
                  </ButtonIcon>
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
                    {formatDate(cn?.cn_date, dateFormat || "yyyy-MM-dd")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Note</p>
                  <p className="text-sm font-medium">{cn?.note || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Workflow Status</p>
                  <p className="text-sm font-medium">{cn?.current_workflow_status || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Action</p>
                  <p className="text-sm font-medium">{cn?.last_action_name || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Action By</p>
                  <p className="text-sm font-medium">{cn?.last_action_by_name || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Action Date</p>
                  <p className="text-sm font-medium">{cn?.last_action_date || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
}

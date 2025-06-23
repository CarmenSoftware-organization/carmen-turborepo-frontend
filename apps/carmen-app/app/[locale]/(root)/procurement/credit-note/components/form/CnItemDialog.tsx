import { CreditNoteDetailDto, CreditNoteFormDto } from "@/dtos/credit-note.dto";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";

interface CnItemDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly control: Control<CreditNoteFormDto>;
  readonly onSave: (data: CreditNoteDetailDto) => void;
  readonly initItem?: CreditNoteDetailDto;
}

export default function CnItemDialog({
  open,
  onOpenChange,
  control,
  onSave,
  initItem,
}: CnItemDialogProps) {
  useEffect(() => {
    if (initItem) {
      console.log("Init item:", initItem);
      console.log("Form control:", control);
    }
  }, [initItem, control]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="w-4 h-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initItem ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (initItem) {
                onSave(initItem);
              }
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "@/lib/navigation";
import { FileText } from "lucide-react";

interface GoodsReceivedNoteDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function GoodsReceivedNoteDialog({
  open,
  onOpenChange,
}: GoodsReceivedNoteDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <p className="text-base font-semibold leading-none tracking-tight">
            Create New Goods Received Note
          </p>
          <p className="text-sm text-muted-foreground">
            Choose how you would like to create a new goods received note.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Card
            className="cursor-pointer hover:bg-accent/50 transition-all duration-300 ease-in-out"
            onClick={() =>
              router.push("/procurement/goods-received-note/new?type=po")
            }
          >
            <CardHeader>
              <CardTitle>
                <div className="fxr-c gap-2">
                  <FileText className="h-4 w-4" />
                  From PO
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Create a new goods received note from a purchase order.
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:bg-accent/49 transition-all duration-300 ease-in-out"
            onClick={() =>
              router.push("/procurement/goods-received-note/new?type=blank")
            }
          >
            <CardHeader>
              <CardTitle>
                <div className="fxr-c gap-3">
                  <FileText className="h-5 w-4" />
                  From Manual
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Create a new goods received note from scratch.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

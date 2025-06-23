"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditNoteDetailDto, CreditNoteFormDto } from "@/dtos/credit-note.dto";
import { formType } from "@/dtos/form.dto";
import {  SquarePenIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";
import CnItemDialog from "./CnItemDialog";

interface CnItemProps {
  readonly control: Control<CreditNoteFormDto>;
  readonly mode: formType;
  readonly itemsDetail?: CreditNoteDetailDto[];
}

export default function CnItem({ control, mode, itemsDetail }: CnItemProps) {
  console.log(mode);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    CreditNoteDetailDto | undefined
  >();

  const openChange = (open: boolean) => {
    if (!open) {
      setSelectedItem(undefined);
    }
    setOpen(open);
  };

  const handleEdit = (item: CreditNoteDetailDto) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleSave = (data: CreditNoteDetailDto) => {
    console.log("Save item:", data);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CnItemDialog
          open={open}
          onOpenChange={openChange}
          control={control}
          onSave={handleSave}
          initItem={selectedItem}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Local Name</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsDetail?.map((item: CreditNoteDetailDto) => (
            <TableRow key={item.id}>
              <TableCell className="w-10">
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500">
                    {item.description ?? "-"}
                  </p>
                </div>
              </TableCell>
              <TableCell>{item.product_local_name ?? "-"}</TableCell>
              <TableCell>{item.note ?? "-"}</TableCell>
              <TableCell className="text-right">{item.qty ?? "-"}</TableCell>
              <TableCell className="text-right">{item.amount ?? "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8"
                    onClick={() => handleEdit(item)}
                  >
                    <SquarePenIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="w-8 h-8">
                    <Trash2Icon className="w-4 h-4" />
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

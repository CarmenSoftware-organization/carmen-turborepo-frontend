import { formType } from "@/dtos/form.dto";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditNoteDetailFormDto } from "@/dtos/credit-note.dto";
import { useFieldArray, useForm } from "react-hook-form";
import { nanoid } from "nanoid";

interface CnItemProps {
  readonly itemsCn: CreditNoteDetailFormDto[];
  readonly mode: formType;
  readonly openDetail: (
    e: React.MouseEvent,
    data: CreditNoteDetailFormDto
  ) => void;
  readonly onDeleteItem?: (itemId: string) => void;
}

export default function CnItem({
  itemsCn,
  mode,
  openDetail,
  onDeleteItem,
}: CnItemProps) {
  const isDisabled = mode === formType.VIEW;

  const form = useForm<{ items: CreditNoteDetailFormDto[] }>({
    defaultValues: {
      items: itemsCn.map((item) => ({
        ...item,
        id: item.id ?? nanoid(),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAddNewItem = (e: React.MouseEvent) => {
    const emptyItem: CreditNoteDetailFormDto = {
      id: nanoid(),
      product_id: "",
      qty: "0",
      amount: "0",
      note: null,
    };

    append(emptyItem);
    openDetail(e, emptyItem);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <p className="text-sm font-medium px-2">Items Details</p>
        {!isDisabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNewItem}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <Form {...form}>
          <form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Note</TableHead>
                  {!isDisabled && <TableHead></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow
                    key={field.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => {
                      if (!isDisabled) {
                        openDetail(e, form.getValues().items[index]);
                      }
                    }}
                  >
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.product_id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="text-xs"
                                disabled={isDisabled}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.qty`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="text-xs"
                                disabled={isDisabled}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="text-xs"
                                disabled={isDisabled}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.note`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                value={field.value ?? ""}
                                className="min-h-[56px] text-xs"
                                disabled={isDisabled}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    {!isDisabled && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (field.id) {
                              onDeleteItem?.(field.id);
                            }
                            remove(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

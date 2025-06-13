import { formType } from "@/dtos/form.dto";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
import { useEffect } from "react";
import useProduct from "@/hooks/useProduct";

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
  const { getProductName } = useProduct();
  const isDisabled = mode === formType.VIEW;

  const form = useForm<{ items: CreditNoteDetailFormDto[] }>({
    defaultValues: {
      items: itemsCn || [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for changes in itemsCn and update form
  useEffect(() => {
    console.log("ItemsCn changed in CnItem:", itemsCn);
    console.log("Current form values before reset:", form.getValues());
    form.reset({ items: itemsCn || [] });
    console.log("Form values after reset:", form.getValues());
  }, [itemsCn, form]);

  const handleAddNewItem = (e: React.MouseEvent) => {
    console.log("handleAddNewItem called");
    const emptyItem: CreditNoteDetailFormDto = {
      product_id: "",
      qty: 0,
      amount: 0,
      note: null,
    };

    console.log("Created emptyItem:", emptyItem);
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
      <CardContent className="p-1">
        <Form {...form}>
          <form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Note</TableHead>
                  {!isDisabled && (
                    <TableHead className="text-right">Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isDisabled ? 4 : 5}
                      className="h-24 text-center"
                    >
                      <p className="text-sm text-muted-foreground">
                        Not have credit note data
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, index) => (
                    <TableRow key={field.id} className="hover:bg-muted/50">
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.product_id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <p className="text-xs">
                                  {getProductName(field.value)}
                                </p>
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
                                <p className="text-xs">{field.value}</p>
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
                                <p className="text-xs">{field.value}</p>
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
                                <p className="text-xs">{field.value ?? "-"}</p>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      {!isDisabled && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={(e) => {
                              e.stopPropagation();
                              const item = form.getValues().items[index];
                              if (item.id) {
                                onDeleteItem?.(item.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={(e) => {
                              if (!isDisabled) {
                                openDetail(e, form.getValues().items[index]);
                              }
                            }}
                          >
                            <SquarePen className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

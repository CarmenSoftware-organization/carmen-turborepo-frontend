import { formType } from "@/dtos/form.dto";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Box, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditNoteDetailFormDto,
  creditNoteDetailSchema,
} from "@/dtos/credit-note.dto";
import { useEffect } from "react";
import ProductLookup from "@/components/lookup/ProductLookup";

interface CnItemDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly isLoading?: boolean;
  readonly mode: formType;
  readonly formValues?: CreditNoteDetailFormDto;
  readonly onSave?: (data: CreditNoteDetailFormDto) => void;
}

export default function CnItemDialog({
  open,
  onOpenChange,
  isLoading,
  mode,
  formValues,
  onSave,
}: CnItemDialogProps) {
  console.log(
    "CnItemDialog rendered with mode:",
    mode,
    "formValues:",
    formValues
  );

  const form = useForm<CreditNoteDetailFormDto>({
    resolver: zodResolver(creditNoteDetailSchema),
    defaultValues: {
      id: formValues?.id,
      product_id: formValues?.product_id ?? "",
      qty: formValues?.qty ?? 0,
      amount: formValues?.amount ?? 0,
      note: formValues?.note ?? null,
    },
    mode: "onChange",
  });

  const watchedValues = form.watch();
  const isDirty = form.formState.isDirty;
  const errors = form.formState.errors;

  useEffect(() => {
    console.log("Form Values Changed in Dialog:", watchedValues);
    console.log("Form Errors in Dialog:", errors);
    console.log("Is Form Dirty in Dialog:", isDirty);
  }, [watchedValues, errors, isDirty]);

  useEffect(() => {
    console.log("formValues changed in Dialog:", formValues);
    if (formValues) {
      form.reset(formValues);
    }
    console.log("Form values after reset in Dialog:", form.getValues());
  }, [formValues, form]);

  const onSubmit = (data: CreditNoteDetailFormDto) => {
    console.log("Dialog onSubmit called with data:", data);
    if (Object.keys(errors).length > 0) {
      console.error("Form has errors:", errors);
      return;
    }

    const submitData = {
      ...data,
      id: formValues?.id,
    };

    console.log("Submitting form data from Dialog:", submitData);
    onSave?.(submitData);
    console.log("After onSave called in Dialog");
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b pb-2 flex-shrink-0">
          <DialogTitle className="text-lg font-medium flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            Credit Note Item
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-4 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Product
                      </FormLabel>
                      <FormControl>
                        <ProductLookup
                          value={field.value ?? ""}
                          onValueChange={(value) => field.onChange(value)}
                          disabled={mode === formType.VIEW}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="qty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Quantity
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            className="text-xs"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            className="text-xs"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Note
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          className="min-h-[100px] text-xs"
                          placeholder="Enter note..."
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      mode === formType.VIEW ||
                      !isDirty ||
                      Object.keys(errors).length > 0
                    }
                    className="text-xs"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

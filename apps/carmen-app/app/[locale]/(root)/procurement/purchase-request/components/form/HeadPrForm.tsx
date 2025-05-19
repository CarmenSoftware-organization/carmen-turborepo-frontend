import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestPostDto } from "@/dtos/pr.dto";
import { Control } from "react-hook-form";

interface HeadPrFormProps {
    readonly control: Control<PurchaseRequestPostDto>;
    readonly mode: formType;
}

export default function HeadPrForm({ control, mode }: HeadPrFormProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                <FormField
                    control={control}
                    name="pr_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PR Number</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

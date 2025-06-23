import { Control } from "react-hook-form";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { formType } from "@/dtos/form.dto";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ExtraCostProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
}

export default function ExtraCost({ control, mode }: ExtraCostProps) {
  console.log("Rendering ExtraCost component with mode:", mode);

  return (
    <div>
      <FormField
        control={control}
        name="extra_cost.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extra Cost Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

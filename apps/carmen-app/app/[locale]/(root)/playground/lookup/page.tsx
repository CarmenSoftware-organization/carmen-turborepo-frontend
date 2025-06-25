"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EmployeeLookup } from "./employee-lookup";


const formSchema = z.object({
  selectedEmployee: z.string().min(1, "Please select an employee"),
});

export default function LookupPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedEmployee: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>): void => {
   
    console.log("Form submitted:", {
      selectedEmployee: values.selectedEmployee,
    });
    alert(
      `เลือกพนักงาน: ${values.selectedEmployee}`
    );
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Employee Lookup Form
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="selectedEmployee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select employee</FormLabel>
                <FormControl>
                  <EmployeeLookup
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="ค้นหาพนักงาน..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>

      {/* Display current form values for debugging */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Current form values:</h3>
        <pre className="text-xs bg-white p-2 rounded border overflow-auto">
          {JSON.stringify(form.watch(), null, 2)}
        </pre>
      </div>
    </div>
  );
}

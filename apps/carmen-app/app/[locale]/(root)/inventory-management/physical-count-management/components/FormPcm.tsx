"use client";

import { PhysicalCountDto, PhysicalCountSchema } from "@/dtos/inventory-management.dto";
import { formType } from "@/dtos/form.dto";
import { useRouter } from "@/lib/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { statusSpotCheckOptions } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { mockDepartments } from "@/mock-data/inventory-management";
import DateInput from "@/components/form-custom/DateInput";

interface FormPcmProps {
    readonly mode: formType;
    readonly initialValues?: PhysicalCountDto;
}

export default function FormPcm({ mode, initialValues }: FormPcmProps) {
    const router = useRouter();

    const defaultValues = {
        department: "",
        location: "",
        status: "pending",
        requested_by: "",
        date: new Date().toISOString().split('T')[0],
        checked_items: 0,
        count_items: 0,
    }

    const form = useForm<PhysicalCountDto>({
        resolver: zodResolver(PhysicalCountSchema),
        defaultValues: mode === formType.ADD ? defaultValues : initialValues,
    });

    const handleSubmit = async (data: PhysicalCountDto) => {
        try {
            console.log('Form submitted:', data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleCancel = () => {
        router.push('/inventory-management/physical-count-management');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {mode === formType.ADD ? "Create Spot Check" : "Edit Spot Check"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockDepartments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statusSpotCheckOptions
                                                .filter(option => option.value !== '')
                                                .map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requested_by"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requested By</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter requester name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <DateInput field={field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="checked_items"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Checked Items</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="count_items"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Items</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="col-span-full flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {mode === formType.ADD ? "Create" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

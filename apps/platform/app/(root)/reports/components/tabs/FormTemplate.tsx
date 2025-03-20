"use client";
import { ReportTemplateType } from "@/dto/report.dto";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportSchedule, ReportTemplateSchema } from "@/constants/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockReportCategories, mockUsersAssigned } from "@/constants/option";
import { Checkbox } from "@/components/ui/checkbox";

interface FormTemplateProps {
    readonly onAddTemplate: (template: ReportTemplateType) => void;
}

interface UserCheckboxItemProps {
    user: { value: string; label: string };
    control: Control<ReportTemplateType>;
}

const UserCheckboxItem = ({ user, control }: UserCheckboxItemProps) => (
    <FormField
        key={user.value}
        control={control}
        name="assigned_to"
        render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                    <Checkbox
                        checked={field.value?.some((item) => item.name === user.label)}
                        onCheckedChange={(checked) => {
                            const updatedValue = checked
                                ? [...field.value, { name: user.label }]
                                : field.value?.filter((item) => item.name !== user.label);
                            field.onChange(updatedValue);
                        }}
                    />
                </FormControl>
                <FormLabel className="font-normal">
                    {user.label}
                </FormLabel>
            </FormItem>
        )}
    />
);

export default function FormTemplate({ onAddTemplate }: FormTemplateProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<ReportTemplateType>({
        resolver: zodResolver(ReportTemplateSchema),
        defaultValues: {
            id: crypto.randomUUID(),
            name: "",
            category: "",
            schedule: "Daily",
            data_points: 0,
            assigned_to: [],
            status: "active",
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    });

    const onSubmit = (template: ReportTemplateType) => {
        onAddTemplate(template);
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Template
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Create Report Template</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Template Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter template name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                const selectedCategory = mockReportCategories.find(cat => cat.value === value);
                                                field.onChange(selectedCategory?.label ?? value);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mockReportCategories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="schedule"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Schedule</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select schedule" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ReportSchedule.options.map((schedule) => (
                                                    <SelectItem key={schedule} value={schedule}>
                                                        {schedule}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="data_points"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data Points</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter number of data points"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="assigned_to"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Assign Users</FormLabel>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {mockUsersAssigned.map((user) => (
                                            <UserCheckboxItem
                                                key={user.value}
                                                user={user}
                                                control={form.control}
                                            />
                                        ))}
                                    </div>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create Template
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

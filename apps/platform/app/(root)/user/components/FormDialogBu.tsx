import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BusinessUnitUserDto } from "@/dto/user.dto";
import { PlusIcon } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { businessUnitUserSchema } from "@/constants/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockClusters, mockDepartments, mockHotels, mockRoles } from "@/constants/option";



interface FormDialogBuProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onAddUser: (user: BusinessUnitUserDto) => void;
}

export default function FormDialogBu({ open, onOpenChange, onAddUser }: FormDialogBuProps) {
    const formId = useId();

    const form = useForm<BusinessUnitUserDto>({
        resolver: zodResolver(businessUnitUserSchema),
        defaultValues: {
            name: "",
            email: "",
            cluster_name: "",
            hotel_name: "",
            department: "",
            role: "",
            module: [],
            status: true,
        },
    });

    const onSubmit = (values: BusinessUnitUserDto) => {
        const newUser: BusinessUnitUserDto = {
            id: `bu${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
            name: values.name,
            email: values.email,
            cluster_name: values.cluster_name,
            hotel_name: values.hotel_name,
            department: values.department,
            role: values.role,
            module: values.module,
            status: values.status,
            last_active: new Date().toISOString()
        };

        onAddUser(newUser);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Business Unit User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Business Unit User</DialogTitle>
                    <DialogDescription>
                        Create a new user with business unit-level access. Fill out the details below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            className="col-span-3"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            className="col-span-3"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cluster_name"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Cluster</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select cluster" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockClusters.map((cluster) => (
                                                <SelectItem key={cluster.value} value={cluster.label}>
                                                    {cluster.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hotel_name"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Hotel</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select hotel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockHotels.map((hotel) => (
                                                <SelectItem key={hotel.value} value={hotel.label}>
                                                    {hotel.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Department</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockDepartments.map((department) => (
                                                <SelectItem key={department.value} value={department.value}>
                                                    {department.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockRoles.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Status</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        value={field.value ? "true" : "false"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Add User</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
import { ClusterUserDto } from "@/dto/user.dto";
import { useId } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { clusterUserSchema } from "@/constants/schema";
import { mockModules } from "@/constants/option";

interface FormDialogClusterProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onAddUser: (user: ClusterUserDto) => void;
}



export default function FormDialogCluster({ open, onOpenChange, onAddUser }: FormDialogClusterProps) {
    const formId = useId();

    const form = useForm<ClusterUserDto>({
        resolver: zodResolver(clusterUserSchema),
        defaultValues: {
            name: "",
            email: "",
            hotel_group: "",
            role: "",
            module: [],
            status: true,
            last_active: "",
        },
    });

    const onSubmit = (values: ClusterUserDto) => {
        const newUser: ClusterUserDto = {
            id: `c${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
            name: values.name,
            email: values.email,
            hotel_group: values.hotel_group,
            role: values.role,
            module: values.module,
            status: values.status,
            last_active: new Date().toISOString()
        };

        console.log(newUser);

        onAddUser(newUser);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" >
                    <PlusIcon className="w-4 h-4" />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Cluster User</DialogTitle>
                    <DialogDescription>
                        Create a new user with cluster-level access. Fill out the details below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-right text-foreground">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            className="col-span-3 bg-background text-foreground"
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
                                <FormItem>
                                    <FormLabel className="text-right text-foreground">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            className="col-span-3 bg-background text-foreground"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hotel_group"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-right text-foreground">Hotel Group</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3 bg-background text-foreground">
                                                <SelectValue placeholder="Select hotel group" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background text-foreground">
                                            <SelectItem value="Hotel Group 1">Hotel Group 1</SelectItem>
                                            <SelectItem value="Hotel Group 2">Hotel Group 2</SelectItem>
                                            <SelectItem value="Hotel Group 3">Hotel Group 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="module"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-right text-foreground">Module</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedModule = mockModules.find(m => m.value === value);
                                            if (selectedModule) {
                                                field.onChange([{
                                                    id: selectedModule.value,
                                                    name: selectedModule.label
                                                }]);
                                            }
                                        }}
                                        value={field.value && field.value.length > 0 ? field.value[0].id : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3 bg-background text-foreground">
                                                <SelectValue
                                                    placeholder="Select module"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background text-foreground">
                                            {mockModules.map((module) => (
                                                <SelectItem key={module.value} value={module.value}>
                                                    {module.label}
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
                                <FormItem>
                                    <FormLabel className="text-right text-foreground">Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3 bg-background text-foreground">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background text-foreground">
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="User">User</SelectItem>
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
                                <FormItem>
                                    <FormLabel className="text-right text-foreground">Status</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        defaultValue={field.value ? "true" : "false"}
                                        value={field.value ? "true" : "false"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3 bg-background text-foreground">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background text-foreground">
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Add User
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

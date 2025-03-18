import { FormPlatformUserValues, PlatformUserDto } from "@/dto/user.dto";
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
import { platformUserSchema } from "@/constants/schema";

interface FormDialogPlatformProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onAddUser: (user: PlatformUserDto) => void;
}


export default function FormDialogPlatform({ open, onOpenChange, onAddUser }: FormDialogPlatformProps) {
    const formId = useId();

    const form = useForm<FormPlatformUserValues>({
        resolver: zodResolver(platformUserSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            bu_name: "",
            status: true,
        },
    });

    const handleSubmit = (values: FormPlatformUserValues) => {

        const newUser: PlatformUserDto = {
            id: `p${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
            name: values.name,
            email: values.email,
            role: values.role,
            bu_name: values.bu_name,
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
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Platform User</DialogTitle>
                    <DialogDescription>
                        Create a new user with platform-level access. Fill out the details below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form id={formId} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
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
                                <FormItem>
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
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-right">Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                                            <SelectItem value="IT Director">IT Director</SelectItem>
                                            <SelectItem value="HR Director">HR Director</SelectItem>
                                            <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-start-2 col-span-3" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bu_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-right">Business Unit</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select business unit" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Corporate Headquarters">Corporate Headquarters</SelectItem>
                                            <SelectItem value="Finance Department">Finance Department</SelectItem>
                                            <SelectItem value="IT Department">IT Department</SelectItem>
                                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                                            <SelectItem value="Operations">Operations</SelectItem>
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
                                    <FormLabel className="text-right">Status</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        defaultValue={field.value ? "true" : "false"}
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
    );
}
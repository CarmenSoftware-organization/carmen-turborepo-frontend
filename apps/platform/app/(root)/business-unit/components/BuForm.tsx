"use client";

import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// Define Zod schema based on FormData interface
const formSchema = z.object({
    name: z.string().min(1, "Business Unit Name is required"),
    brand: z.string().min(1, "Brand is required"),
    head_manager_id: z.string().optional(),
    cluster_id: z.string().optional(),
    locations: z.object({
        post_code: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
    }),
    contact: z.object({
        email: z.string().email("Invalid email address"),
        phone: z.string(),
    }),
    properties: z.object({
        number_of_rooms: z.number().int().positive(),
        number_of_teams: z.number().int().positive(),
        number_of_members: z.number().int().positive(),
    }),
    configuration: z.object({
        db_host: z.string(),
        db_name: z.string(),
        db_type: z.string(),
    }),
    notification: z.object({
        email: z.boolean(),
        sms: z.boolean(),
    }),
    integration: z.object({
        supply_chain: z.boolean(),
        sales_channel: z.boolean(),
        marketing_channel: z.boolean(),
        finance_channel: z.boolean(),
        hr_channel: z.boolean(),
        inventory_channel: z.boolean(),
    }),
});

// Infer TypeScript type from Zod schema
type FormData = z.infer<typeof formSchema>;

export default function BuForm() {

    // Initialize form with react-hook-form
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            head_manager_id: "",
            cluster_id: "",
            locations: {
                post_code: "",
                address: "",
                city: "",
                state: "",
                country: "",
            },
            contact: {
                email: "",
                phone: "",
            },
            properties: {
                number_of_rooms: 0,
                number_of_teams: 0,
                number_of_members: 0,
            },
            configuration: {
                db_host: "",
                db_name: "",
                db_type: "",
            },
            notification: {
                email: false,
                sms: false,
            },
            integration: {
                supply_chain: false,
                sales_channel: false,
                marketing_channel: false,
                finance_channel: false,
                hr_channel: false,
                inventory_channel: false,
            },
        },
    });

    const handleComplete = (data: FormData) => {
        console.log('Form Submitted!', data);
        alert("Form Submitted!");
    }

    // Define form steps with react-hook-form fields
    const steps = [
        {
            title: "Basic Information",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Unit Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter business unit name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter brand name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="contact.email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="locations.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="locations.post_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="10001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="locations.state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="locations.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="United States" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="locations.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            title: "Details",
            content: (
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="properties.number_of_rooms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Rooms</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="properties.number_of_teams"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Teams</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="properties.number_of_members"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Members</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            title: "Configuration",
            content: (
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="configuration.db_host"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Database Host</FormLabel>
                                <FormControl>
                                    <Input placeholder="localhost" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="configuration.db_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Database Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="my_database" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="configuration.db_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Database Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="PostgreSQL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            title: "Notifications",
            content: (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-3">Notifications</h3>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="notification.email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Email Notifications
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="notification.sms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            SMS Notifications
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-3">Integrations</h3>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="integration.supply_chain"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Supply Chain
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="integration.sales_channel"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Sales Channel
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="integration.marketing_channel"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Marketing Channel
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Review",
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">Please review your information before submitting.</p>
                    <div className="rounded-md bg-muted p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Business Unit Name:</div>
                            <div>{form.watch("name") || "Not provided"}</div>

                            <div className="font-medium">Brand:</div>
                            <div>{form.watch("brand") || "Not provided"}</div>

                            <div className="font-medium">Email:</div>
                            <div>{form.watch("contact.email") || "Not provided"}</div>

                            <div className="font-medium">Address:</div>
                            <div>{form.watch("locations.address") || "Not provided"}</div>

                            <div className="font-medium">City:</div>
                            <div>{form.watch("locations.city") || "Not provided"}</div>

                            <div className="font-medium">Number of Rooms:</div>
                            <div>{form.watch("properties.number_of_rooms") || "0"}</div>

                            <div className="font-medium">Database Host:</div>
                            <div>{form.watch("configuration.db_host") || "Not provided"}</div>

                            <div className="font-medium">Email Notifications:</div>
                            <div>{form.watch("notification.email") ? "Enabled" : "Disabled"}</div>

                            <div className="font-medium">SMS Notifications:</div>
                            <div>{form.watch("notification.sms") ? "Enabled" : "Disabled"}</div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className='space-y-2'>
                <h2 className="text-2xl font-bold tracking-tight">Add Business Unit</h2>
                <p className="text-muted-foreground">
                    Add a new hotel or property
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleComplete)}>

                    <Stepper
                        steps={steps}
                        onComplete={() => form.handleSubmit(handleComplete)()}
                    />
                </form>
            </Form>
        </div>
    );
}

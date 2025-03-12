import { Card } from "@/components/ui/card";
import { FormField, FormMessage } from "@/components/ui/form";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SettingsFormValues } from "@/types/form/form";
import { Control } from "react-hook-form";

interface MaintenanceCardProps {
    control: Control<SettingsFormValues>;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ control }) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Maintenance Mode</h3>
            <div className="space-y-4">
                <FormField
                    control={control}
                    name="maintenance.enabled"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Maintenance Mode</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Enable maintenance mode to show a maintenance message to users.
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="maintenance.message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maintenance Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="min-h-[100px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    )
}

export default MaintenanceCard

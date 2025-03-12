import React from 'react'
import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { SettingsFormValues } from '@/types/form/form';

interface LocalizationCardProps {
    control: Control<SettingsFormValues>;
}

const LocalizationCard: React.FC<LocalizationCardProps> = ({ control }) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Localization</h3>
            <div className="space-y-4">
                <FormField
                    control={control}
                    name="localization.language"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="localization.timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    )
}

export default LocalizationCard
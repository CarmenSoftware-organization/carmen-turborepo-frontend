'use client';

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form';
import { Save } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettings } from '@/hooks/setting';
import GeneralCard from './GeneralCard';
import { settingsFormSchema, SettingsFormValues } from '@/types/form/form';
import LocalizationCard from './LocalizationCard';
import MaintenanceCard from './MaintenanceCard';
import { defaultSettingValues } from '@/types/form/default-value';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { updateSettings } from '@/services/setting/setting';

const GeneralSetting = () => {
    const { settings } = useSettings();
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: defaultSettingValues
    });

    useEffect(() => {
        if (settings) {
            form.reset(settings);
        }
    }, [settings, form]);


    const onSubmit = async (data: SettingsFormValues) => {
        try {
            const result = await updateSettings(data);
            if (result) {
                toastSuccess({ message: 'Settings updated successfully' });
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
            toastError({ message: 'Failed to update settings' });
        }
    };


    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your platform settings and preferences
                    </p>
                </div>
                <Button
                    type="submit"
                    form="settings-form"
                    className="font-medium"
                    size={'sm'}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
            </div>
            <Form {...form}>
                <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <GeneralCard control={form.control} />
                    <LocalizationCard control={form.control} />
                    <MaintenanceCard control={form.control} />
                </form>
            </Form>
        </div>
    );
};

export default GeneralSetting;
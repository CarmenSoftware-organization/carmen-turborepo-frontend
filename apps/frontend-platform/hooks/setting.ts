'use client';
import { useEffect, useState } from 'react';
import { getSettings } from '@/services/setting/setting';
import { SettingsType } from '@/types/main';

interface UseSettingsReturn {
    settings: SettingsType | null;
    refetch: () => Promise<void>;
}

function useSettings(): UseSettingsReturn {
    const [settings, setSettings] = useState<SettingsType | null>(null);


    const fetchSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const refetch = async () => {
        await fetchSettings();
    };

    return {
        settings,
        refetch
    };
}

export { useSettings };

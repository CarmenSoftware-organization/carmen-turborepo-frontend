'use client';

import { useState, useCallback, useEffect } from 'react';

type URLStateOptions = {
    defaultValue?: string;
    onUpdate?: (value: string) => void;
};

export const useURL = (paramName: string, options: URLStateOptions = {}) => {
    const { defaultValue = '', onUpdate } = options;

    const [value, setValue] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get(paramName) || defaultValue;
        }
        return defaultValue;
    });

    const updateValue = useCallback((newValue: string) => {
        setValue(newValue);

        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (newValue) {
                url.searchParams.set(paramName, newValue);
            } else {
                url.searchParams.delete(paramName);
            }
            window.history.replaceState({ ...window.history.state }, '', url.toString());
            onUpdate?.(newValue);
        }
    }, [paramName, onUpdate]);

    // Sync with URL when browser back/forward is used
    useEffect(() => {
        const handlePopState = () => {
            const newValue = new URLSearchParams(window.location.search).get(paramName) || defaultValue;
            setValue(newValue);
            onUpdate?.(newValue);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [paramName, defaultValue, onUpdate]);

    return [value, updateValue] as const;
}; 
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

type ParamValue = string;
type ParamRecord = Record<string, ParamValue>;

const isClient = typeof window !== 'undefined';

function createURLManager(baseURL: string = window?.location?.href) {
    const url = new URL(baseURL);
    return {
        getParam: (key: string) => url.searchParams.get(key),
        getParams: (params: ParamRecord) => {
            const result = { ...params };
            Object.keys(params).forEach(key => {
                const value = url.searchParams.get(key);
                if (value !== null) {
                    result[key] = value;
                }
            });
            return result;
        },
        setParam: (key: string, value: string) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
            return url.toString();
        },
        setParams: (params: ParamRecord) => {
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.set(key, String(value));
                } else {
                    url.searchParams.delete(key);
                }
            });
            return url.toString();
        }
    };
}

export function useMutiURL(paramNameOrParams: string | ParamRecord, defaultValue: string = '') {
    // URL Manager instance
    const urlManager = useRef(isClient ? createURLManager() : null);

    // Handle single parameter case
    if (typeof paramNameOrParams === 'string') {
        const paramName = paramNameOrParams;

        // State management for single parameter
        const [value, setValue] = useState(() => {
            if (!isClient) return defaultValue;
            return urlManager.current?.getParam(paramName) || defaultValue;
        });

        // Update URL and state for single parameter
        const updateValue = useCallback((newValue: string) => {
            if (!isClient || !urlManager.current) return;

            setValue(newValue);
            const newURL = urlManager.current.setParam(paramName, newValue);
            window.history.replaceState(
                { ...window.history.state, [paramName]: newValue },
                '',
                newURL
            );
        }, [paramName]);

        // Handle browser navigation for single parameter
        useEffect(() => {
            if (!isClient) return;

            const handlePopState = () => {
                const newValue = new URLSearchParams(window.location.search)
                    .get(paramName) || defaultValue;
                setValue(newValue);
            };

            window.addEventListener('popstate', handlePopState);
            return () => window.removeEventListener('popstate', handlePopState);
        }, [paramName, defaultValue]);

        return [value, updateValue] as const;
    }

    // Handle multiple parameters case
    const defaultParams = paramNameOrParams;

    // State management for multiple parameters
    const [params, setParams] = useState(() => {
        if (!isClient) return defaultParams;
        return urlManager.current?.getParams(defaultParams) || defaultParams;
    });

    // Update URL and state for multiple parameters
    const updateParams = useCallback((newParams: Partial<ParamRecord>) => {
        if (!isClient || !urlManager.current) return;

        const updatedParams = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries({ ...params, ...newParams }).filter(([_, value]) => value !== undefined)
        ) as ParamRecord;
        const newURL = urlManager.current.setParams(updatedParams);

        window.history.replaceState(
            { ...window.history.state, params: updatedParams },
            '',
            newURL
        );

        setParams(updatedParams);
    }, [params]);

    // Handle browser navigation for multiple parameters
    useEffect(() => {
        if (!isClient) return;

        const handlePopState = () => {
            const newParams = urlManager.current?.getParams(defaultParams) || defaultParams;
            setParams(newParams);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [defaultParams]);

    return [params, updateParams] as const;
}
"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type URLStateOptions = {
  defaultValue?: string;
  onUpdate?: (value: string) => void;
};

export const useURL = (paramName: string, options: URLStateOptions = {}) => {
  const { defaultValue = "", onUpdate } = options;
  const isUpdatingRef = useRef(false);

  const [value, setValue] = useState(() => {
    if (globalThis.window !== undefined) {
      return new URLSearchParams(globalThis.window.location.search).get(paramName) ?? defaultValue;
    }
    return defaultValue;
  });

  const updateValue = useCallback(
    (newValue: string) => {
      if (isUpdatingRef.current) return;

      setValue(newValue);

      if (globalThis.window !== undefined) {
        isUpdatingRef.current = true;

        const url = new URL(globalThis.window.location.href);
        if (newValue) {
          url.searchParams.set(paramName, newValue);
        } else {
          url.searchParams.delete(paramName);
        }

        if (url.toString() !== globalThis.window.location.href) {
          globalThis.window.history.replaceState(
            { ...globalThis.window.history.state },
            "",
            url.toString()
          );
        }

        onUpdate?.(newValue);
        isUpdatingRef.current = false;
      }
    },
    [paramName, onUpdate]
  );

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const handlePopState = () => {
      if (isUpdatingRef.current) return;

      const newValue =
        new URLSearchParams(globalThis.window.location.search).get(paramName) ?? defaultValue;
      setValue(newValue);
      onUpdate?.(newValue);
    };

    globalThis.window.addEventListener("popstate", handlePopState);
    return () => {
      if (globalThis.window !== undefined) {
        globalThis.window.removeEventListener("popstate", handlePopState);
      }
    };
  }, [paramName, defaultValue, onUpdate]);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const checkURLChange = () => {
      if (isUpdatingRef.current) return;
      const currentValue =
        new URLSearchParams(globalThis.window.location.search).get(paramName) ?? defaultValue;

      if (currentValue !== value) {
        setValue(currentValue);
        onUpdate?.(currentValue);
      }
    };

    const interval = setInterval(checkURLChange, 100);

    return () => clearInterval(interval);
  }, [paramName, defaultValue, value, onUpdate]);

  return [value, updateValue] as const;
};

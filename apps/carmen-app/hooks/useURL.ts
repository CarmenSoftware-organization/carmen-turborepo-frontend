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
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get(paramName) ??
        defaultValue
      );
    }
    return defaultValue;
  });

  const updateValue = useCallback(
    (newValue: string) => {
      // Prevent infinite loops
      if (isUpdatingRef.current) return;

      setValue(newValue);

      if (typeof window !== "undefined") {
        isUpdatingRef.current = true;

        const url = new URL(window.location.href);
        if (newValue) {
          url.searchParams.set(paramName, newValue);
        } else {
          url.searchParams.delete(paramName);
        }

        // Only update if URL actually changed
        if (url.toString() !== window.location.href) {
          window.history.replaceState(
            { ...window.history.state },
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

  // Sync with URL when browser back/forward is used
  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      // Prevent infinite loops
      if (isUpdatingRef.current) return;

      const newValue =
        new URLSearchParams(window.location.search).get(paramName) ??
        defaultValue;
      setValue(newValue);
      onUpdate?.(newValue);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", handlePopState);
      }
    };
  }, [paramName, defaultValue, onUpdate]);

  return [value, updateValue] as const;
};

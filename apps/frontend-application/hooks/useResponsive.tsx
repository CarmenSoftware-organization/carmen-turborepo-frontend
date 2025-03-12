"use client";

import { useEffect, useState } from 'react'

interface ScreenSizes {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

const SCREEN = {
    MOBILE: 768,
    TABLET: 1024,
} as const;

const useResponsive = (): ScreenSizes => {
    const [width, setWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth;
        }
        // Default to desktop during SSR to avoid hydration mismatch
        return SCREEN.TABLET + 1;
    });

    useEffect(() => {
        // Debounced resize handler to improve performance
        let timeoutId: NodeJS.Timeout;

        const handleWindowSizeChange = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWidth(window.innerWidth);
            }, 150); // Debounce time of 150ms
        };

        window.addEventListener("resize", handleWindowSizeChange);

        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
            clearTimeout(timeoutId);
        };
    }, []);

    return {
        isMobile: width <= SCREEN.MOBILE,
        isTablet: width <= SCREEN.TABLET && width > SCREEN.MOBILE,
        isDesktop: width > SCREEN.TABLET,
    };
}

export default useResponsive;
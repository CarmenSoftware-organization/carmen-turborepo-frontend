'use client';

import { useEffect } from 'react';
import { initToolbar } from '@stagewise/toolbar';

// 2. Define your toolbar configuration
const stagewiseConfig = {
    plugins: []
};

export default function StagewiseToolbar() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            initToolbar(stagewiseConfig);
        }
    }, []);

    return null;
}
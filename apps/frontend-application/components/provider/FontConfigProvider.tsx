'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type FontConfig = {
    family: string;
    size: string;
    weight: string;
    lineHeight: string;
    color: string;
    style: string;
}

type FontConfigContextType = {
    fontConfig: FontConfig | null;
    updateFontConfig: (config: FontConfig) => void;
    resetFontConfig: () => void;
}

const defaultFontConfig: FontConfig = {
    family: 'var(--font-geist-sans)',
    size: '16px',
    weight: '400',
    lineHeight: '1.5',
    color: '#0F172A',
    style: 'normal'
}

const FontConfigContext = createContext<FontConfigContextType>({
    fontConfig: defaultFontConfig,
    updateFontConfig: () => { },
    resetFontConfig: () => { }
})

export const useFontConfig = () => useContext(FontConfigContext)

export function FontConfigProvider({ children }: { children: React.ReactNode }) {
    const [fontConfig, setFontConfig] = useState<FontConfig | null>(null)

    useEffect(() => {
        // Load saved config from localStorage if available
        const savedConfig = localStorage.getItem('fontConfig')
        if (savedConfig) {
            try {
                setFontConfig(JSON.parse(savedConfig))
            } catch {
                setFontConfig(defaultFontConfig)
            }
        } else {
            setFontConfig(defaultFontConfig)
        }
    }, [])

    useEffect(() => {
        if (fontConfig) {
            // Apply the font config to document root
            const rootElement = document.documentElement
            rootElement.style.setProperty('--font-family', fontConfig.family)
            rootElement.style.setProperty('--font-size', fontConfig.size)
            rootElement.style.setProperty('--font-weight', fontConfig.weight)
            rootElement.style.setProperty('--line-height', fontConfig.lineHeight)
            rootElement.style.setProperty('--text-color', fontConfig.color)
            rootElement.style.setProperty('--font-style', fontConfig.style)
        }
    }, [fontConfig])

    const updateFontConfig = (config: FontConfig) => {
        setFontConfig(config)
        localStorage.setItem('fontConfig', JSON.stringify(config))
    }

    const resetFontConfig = () => {
        setFontConfig(defaultFontConfig)
        localStorage.removeItem('fontConfig')
    }

    if (!fontConfig) return <>{children}</>

    return (
        <FontConfigContext.Provider value={{ fontConfig, updateFontConfig, resetFontConfig }}>
            <div
                style={{
                    // Apply styles globally but allow component-level overrides
                    '--font-family': fontConfig.family,
                    '--font-size': fontConfig.size,
                    '--font-weight': fontConfig.weight,
                    '--line-height': fontConfig.lineHeight,
                    '--text-color': fontConfig.color,
                    '--font-style': fontConfig.style,
                } as React.CSSProperties}
            >
                {children}
            </div>
        </FontConfigContext.Provider>
    )
} 
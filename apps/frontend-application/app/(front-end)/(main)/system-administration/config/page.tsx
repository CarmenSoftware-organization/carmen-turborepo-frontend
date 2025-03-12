'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useFontConfig } from '@/components/provider/FontConfigProvider'

type FontInfo = {
    family: string;
    size: string;
    weight: string;
    lineHeight: string;
    color: string;
    style: string;
}

type FontConfig = {
    family: string;
    size: string;
    weight: string;
    lineHeight: string;
    color: string;
    style: string;
}

const fontFamilies = [
    'Inter, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Times New Roman, serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Montserrat, sans-serif',
];

const fontWeights = [
    { value: '300', label: 'Light' },
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semibold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extrabold' },
];

const fontStyles = [
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italic' },
];

// Common text colors
const commonColors = [
    { value: '#000000', label: 'Black' },
    { value: '#333333', label: 'Dark Gray' },
    { value: '#666666', label: 'Medium Gray' },
    { value: '#0F172A', label: 'Slate 900' },
    { value: '#1E40AF', label: 'Blue 800' },
    { value: '#047857', label: 'Emerald 700' },
    { value: '#B91C1C', label: 'Red 700' },
    { value: '#713F12', label: 'Amber 900' },
];

const SystemConfigurationPage = () => {
    const { fontConfig: globalFontConfig, updateFontConfig, resetFontConfig } = useFontConfig()
    const [defaultFontInfo, setDefaultFontInfo] = useState<FontInfo | null>(null)
    const [fontConfig, setFontConfig] = useState<FontConfig | null>(null)
    const [isChangesApplied, setIsChangesApplied] = useState(false)

    useEffect(() => {
        // If we have a global config, use it as our starting point
        if (globalFontConfig) {
            setDefaultFontInfo(globalFontConfig)
            setFontConfig(globalFontConfig)
            return
        }

        // Otherwise get computed styles from body element as fallback
        const bodyStyles = window.getComputedStyle(document.body)

        // Extract font information
        const fontData: FontInfo = {
            family: bodyStyles.fontFamily,
            size: bodyStyles.fontSize,
            weight: bodyStyles.fontWeight,
            lineHeight: bodyStyles.lineHeight,
            color: bodyStyles.color,
            style: bodyStyles.fontStyle
        }

        setDefaultFontInfo(fontData)
        setFontConfig(fontData)
    }, [globalFontConfig])

    const handleFontFamilyChange = (value: string) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, family: value })
            setIsChangesApplied(false)
        }
    }

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, size: e.target.value + 'px' })
            setIsChangesApplied(false)
        }
    }

    const handleFontWeightChange = (value: string) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, weight: value })
            setIsChangesApplied(false)
        }
    }

    const handleLineHeightChange = (value: number[]) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, lineHeight: value[0].toString() })
            setIsChangesApplied(false)
        }
    }

    const handleColorChange = (value: string) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, color: value })
            setIsChangesApplied(false)
        }
    }

    const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, color: e.target.value })
            setIsChangesApplied(false)
        }
    }

    const handleFontStyleChange = (value: string) => {
        if (fontConfig) {
            setFontConfig({ ...fontConfig, style: value })
            setIsChangesApplied(false)
        }
    }

    const handleApplyChanges = () => {
        if (fontConfig) {
            // Update global font config instead of directly applying to document
            updateFontConfig(fontConfig)
            setIsChangesApplied(true)
        }
    }

    const handleResetToDefaults = () => {
        // Reset to the application default font
        resetFontConfig()
        if (defaultFontInfo) {
            setFontConfig(defaultFontInfo)
            setIsChangesApplied(false)
        }
    }

    if (!fontConfig) {
        return <div className="flex items-center justify-center min-h-[200px]">Loading font information...</div>
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">System Configuration</h1>

            <Tabs defaultValue="display" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="display">Current Font Style</TabsTrigger>
                    <TabsTrigger value="configure">Configure Font Style</TabsTrigger>
                </TabsList>

                <TabsContent value="display">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Default Font Style Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm text-slate-500 mb-2">Font Family</h3>
                                        <p className="font-medium">{fontConfig.family}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm text-slate-500 mb-2">Font Size</h3>
                                        <p className="font-medium">{fontConfig.size}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm text-slate-500 mb-2">Font Weight</h3>
                                        <p className="font-medium">{fontConfig.weight}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm text-slate-500 mb-2">Line Height</h3>
                                        <p className="font-medium">{fontConfig.lineHeight}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm text-slate-500 mb-2">Text Color</h3>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-5 h-5 rounded border border-gray-300"
                                                style={{ backgroundColor: fontConfig.color }}
                                                aria-label={`Color preview: ${fontConfig.color}`}
                                            />
                                            <p className="font-medium">{fontConfig.color}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-sm text-slate-500 mb-2">Font Style</h3>
                                        <p className="font-medium">{fontConfig.style}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="configure">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Configure Font Style</CardTitle>
                            <CardDescription>Customize the font appearance for your application</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="fontFamily">Font Family</Label>
                                            <Select
                                                value={fontConfig.family}
                                                onValueChange={handleFontFamilyChange}
                                            >
                                                <SelectTrigger id="fontFamily">
                                                    <SelectValue placeholder="Select font family" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fontFamilies.map((font, index) => (
                                                        <SelectItem key={index} value={font}>
                                                            <span style={{ fontFamily: font }}>{font.split(',')[0]}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="fontSize">Font Size (px)</Label>
                                            <Input
                                                id="fontSize"
                                                type="number"
                                                min="8"
                                                max="32"
                                                value={parseInt(fontConfig.size)}
                                                onChange={handleFontSizeChange}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="fontWeight">Font Weight</Label>
                                            <Select
                                                value={fontConfig.weight}
                                                onValueChange={handleFontWeightChange}
                                            >
                                                <SelectTrigger id="fontWeight">
                                                    <SelectValue placeholder="Select font weight" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fontWeights.map((weight) => (
                                                        <SelectItem key={weight.value} value={weight.value}>
                                                            {weight.label} ({weight.value})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="lineHeight">Line Height</Label>
                                            <div className="flex items-center gap-2">
                                                <Slider
                                                    id="lineHeight"
                                                    min={1}
                                                    max={2.5}
                                                    step={0.1}
                                                    value={[parseFloat(fontConfig.lineHeight)]}
                                                    onValueChange={handleLineHeightChange}
                                                    className="flex-1"
                                                />
                                                <span className="w-12 text-right">{parseFloat(fontConfig.lineHeight).toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="fontStyle">Font Style</Label>
                                            <Select
                                                value={fontConfig.style}
                                                onValueChange={handleFontStyleChange}
                                            >
                                                <SelectTrigger id="fontStyle">
                                                    <SelectValue placeholder="Select font style" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fontStyles.map((style) => (
                                                        <SelectItem key={style.value} value={style.value}>
                                                            {style.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="textColor">Text Color</Label>
                                            <div className="grid gap-2">
                                                <Select
                                                    value={fontConfig.color}
                                                    onValueChange={handleColorChange}
                                                >
                                                    <SelectTrigger id="textColor" className="flex justify-between items-center">
                                                        <SelectValue placeholder="Select color" />
                                                        <div
                                                            className="w-5 h-5 rounded border border-gray-300 ml-2"
                                                            style={{ backgroundColor: fontConfig.color }}
                                                            aria-label={`Selected color: ${fontConfig.color}`}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {commonColors.map((color) => (
                                                            <SelectItem key={color.value} value={color.value}>
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className="w-4 h-4 rounded mr-2"
                                                                        style={{ backgroundColor: color.value }}
                                                                    />
                                                                    {color.label}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                        <SelectItem value="custom">Custom Color...</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {fontConfig.color && !commonColors.some(c => c.value === fontConfig.color) && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Input
                                                            type="color"
                                                            value={fontConfig.color}
                                                            onChange={handleColorInputChange}
                                                            className="w-10 h-10 p-1 cursor-pointer"
                                                            aria-label="Custom color picker"
                                                        />
                                                        <span className="text-sm">{fontConfig.color}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 border rounded-lg">
                                    <h3 className="font-medium mb-2">Preview</h3>
                                    <div
                                        className="p-4 bg-white rounded-lg"
                                        style={{
                                            fontFamily: fontConfig.family,
                                            fontSize: fontConfig.size,
                                            fontWeight: fontConfig.weight,
                                            lineHeight: fontConfig.lineHeight,
                                            color: fontConfig.color,
                                            fontStyle: fontConfig.style
                                        }}
                                    >
                                        <p>This is a preview of your configured font style.</p>
                                        <p className="mt-2"><strong>Bold text</strong> and <em>italic text</em> for reference.</p>
                                        <p className="mt-2">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
                                            Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handleResetToDefaults}
                            >
                                Reset to Defaults
                            </Button>
                            <Button
                                onClick={handleApplyChanges}
                                disabled={isChangesApplied}
                            >
                                {isChangesApplied ? 'Changes Applied' : 'Apply Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SystemConfigurationPage;

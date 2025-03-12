"use client";
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/i18n';
import { ArrowLeft, Check, Edit2, PanelRightOpen, Printer, X, XCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import RightPanel from './RightPanel';
interface HeaderActionsProps {
    status: string
    isEditMode: boolean
    setIsEditMode: (value: boolean) => void
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ status, isEditMode, setIsEditMode }) => {
    const router = useRouter();
    const [showRightPanel, setShowRightPanel] = useState(false)
    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">Inventory Adjustment</h1>
                        <Badge>{status}</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isEditMode ? (
                        <>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => setIsEditMode(false)}
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                className="flex items-center gap-2"
                                onClick={() => {
                                    // Save changes
                                    setIsEditMode(false)
                                }}
                            >
                                <Check className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="flex items-center gap-2"
                                onClick={() => setIsEditMode(true)}
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => console.log('Post adjustment')}
                            >
                                Post
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => console.log('Print adjustment')}
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                        onClick={() => console.log('Void adjustment')}
                    >
                        <XCircle className="h-4 w-4" />
                        Void
                    </Button>
                    <div className="border-l border-border pl-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={showRightPanel ? 'bg-accent' : ''}
                                        onClick={() => setShowRightPanel(!showRightPanel)}
                                    >
                                        <PanelRightOpen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Show Details</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            <RightPanel
                isOpen={showRightPanel}
                onClose={() => setShowRightPanel(false)}
            />
        </>
    )
}

export default HeaderActions
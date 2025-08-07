"use client";

import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { MessageSquare, Activity, X } from "lucide-react";
import { MotionDiv, AnimatePresence } from "./framer-motion/MotionWrapper";
import { cn } from "@/lib/utils";

interface Props {
    readonly children: React.ReactNode;
    readonly className?: string;
    readonly activityComponent: React.ReactNode;
    readonly commentComponent: React.ReactNode;
}

export default function DetailsAndComments({ children, className, activityComponent, commentComponent }: Props) {
    const [openLog, setOpenLog] = useState(false);
    const [activeTab, setActiveTab] = useState<'activity' | 'comment'>('activity');

    const sidebarVariants = {
        open: {
            width: "400px",
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            }
        },
        closed: {
            width: "0px",
            opacity: 0,
            x: 400,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            }
        }
    };

    const contentVariants = {
        expanded: {
            width: "calc(100% - 400px)",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            }
        },
        collapsed: {
            width: "100%",
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeOut" as const,
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const contentSwitchVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 }
        }
    };

    const handleOpenPanel = (tab: 'activity' | 'comment') => {
        setActiveTab(tab);
        setOpenLog(true);
    };

    return (
        <MotionDiv
            className={`${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex h-[calc(100vh-120px)]">
                <MotionDiv
                    variants={contentVariants}
                    animate={openLog ? "expanded" : "collapsed"}
                    className="h-full"
                >
                    <ScrollArea className="w-full h-full pr-4">
                        <MotionDiv
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            {children}
                        </MotionDiv>
                    </ScrollArea>
                </MotionDiv>
                <div className={cn("flex flex-col gap-2 border-l border-border", openLog ? "px-4" : "pl-2")}>
                    <MotionDiv
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            onClick={() => handleOpenPanel('activity')}
                            variant="outlinePrimary"
                            size="sm"
                            aria-label="Open Activity Log"
                            className="h-10 w-10"
                        >
                            <Activity className="h-5 w-5" />
                        </Button>
                    </MotionDiv>
                    <MotionDiv
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            onClick={() => handleOpenPanel('comment')}
                            variant="outlinePrimary"
                            size="sm"
                            aria-label="Open Comments"
                            className="h-10 w-10"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                    </MotionDiv>
                </div>
                <AnimatePresence mode="wait">
                    {openLog && (
                        <MotionDiv
                            variants={sidebarVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="h-full border-l border-border bg-background shadow-lg"
                        >
                            <MotionDiv
                                className="flex flex-col h-full"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        {activeTab === 'activity' ? (
                                            <>
                                                <Activity className="w-5 h-5" />
                                                Activity Log
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare className="w-5 h-5" />
                                                Comments
                                            </>
                                        )}
                                    </h3>

                                    <MotionDiv
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Button
                                            onClick={() => setOpenLog(false)}
                                            variant="ghost"
                                            size="sm"
                                            aria-label="Close sidebar"
                                            className="h-8 w-8 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </MotionDiv>
                                </div>
                                <ScrollArea className="flex-1">
                                    <AnimatePresence mode="wait">
                                        <MotionDiv
                                            key={activeTab}
                                            variants={contentSwitchVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="p-4"
                                        >
                                            {activeTab === 'activity' ? (
                                                <div className="space-y-4">
                                                    {activityComponent}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {commentComponent}
                                                </div>
                                            )}
                                        </MotionDiv>
                                    </AnimatePresence>
                                </ScrollArea>
                            </MotionDiv>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>
        </MotionDiv>
    );
}
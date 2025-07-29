"use client";

import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MotionDiv, AnimatePresence } from "./framer-motion/MotionWrapper";

interface Props {
    readonly children: React.ReactNode;
    readonly className?: string;
    readonly commentPanel: React.ReactNode;
}

export default function DetailsAndComments({ children, className, commentPanel }: Props) {
    const [openLog, setOpenLog] = useState(false);

    const slideInVariants = {
        open: {
            width: "25%",
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeInOut" as const,
                opacity: { duration: 0.2, delay: 0.1 }
            }
        },
        closed: {
            width: "0%",
            opacity: 0,
            x: 100,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        }
    };

    const contentVariants = {
        expanded: {
            width: "75%",
            transition: {
                duration: 0.4,
                ease: "easeInOut" as const
            }
        },
        collapsed: {
            width: "100%",
            transition: {
                duration: 0.4,
                ease: "easeInOut" as const
            }
        }
    };

    const buttonVariants = {
        open: {
            x: -5,
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeOut" as const
            }
        },
        closed: {
            x: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut" as const
            }
        },
        hover: {
            scale: 1.1,
            x: openLog ? -8 : -3,
            transition: {
                duration: 0.2,
                ease: "easeOut" as const
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const iconVariants = {
        initial: {
            rotate: 0,
            scale: 1
        },
        animate: {
            rotate: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const
            }
        },
        exit: {
            rotate: 180,
            scale: 0.8,
            transition: {
                duration: 0.2,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <MotionDiv
            className={`relative ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex gap-4 relative">
                {/* Main Content Area */}
                <MotionDiv
                    variants={contentVariants}
                    animate={openLog ? "expanded" : "collapsed"}
                    className="h-[calc(100vh-120px)]"
                >
                    <ScrollArea className="w-full h-full">
                        <MotionDiv
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            {children}
                        </MotionDiv>
                    </ScrollArea>
                </MotionDiv>

                {/* Log Panel */}
                <AnimatePresence mode="wait">
                    {openLog && (
                        <MotionDiv
                            variants={slideInVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="h-[calc(100vh-120px)] overflow-hidden"
                        >
                            <MotionDiv
                                className="flex flex-col gap-4 h-full"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <ScrollArea className="h-full">
                                    {commentPanel}
                                </ScrollArea>
                            </MotionDiv>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>

            {/* Toggle Button */}
            <MotionDiv
                variants={buttonVariants}
                animate={openLog ? "open" : "closed"}
                whileHover="hover"
                whileTap="tap"
                className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50"
            >
                <Button
                    onClick={() => setOpenLog(!openLog)}
                    variant="default"
                    size="sm"
                    className="h-10 w-10 rounded-l-full rounded-r-none shadow-lg border-0 bg-primary hover:bg-primary/90"
                    aria-label={openLog ? "Close log panel" : "Open log panel"}
                >
                    <AnimatePresence mode="wait">
                        <MotionDiv
                            key={openLog ? "close" : "open"}
                            variants={iconVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {openLog ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </MotionDiv>
                    </AnimatePresence>
                </Button>
            </MotionDiv>
        </MotionDiv>
    );
}
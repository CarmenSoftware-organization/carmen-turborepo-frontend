"use client";

import dynamic from "next/dynamic";
import React, { ReactNode } from "react";
import { TargetAndTransition, VariantLabels, Transition } from "framer-motion";

// Interface สำหรับ motion props
interface MotionProps {
    initial?: boolean | TargetAndTransition | VariantLabels;
    animate?: boolean | TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
    transition?: Transition;
    variants?: Record<string, TargetAndTransition>;
    layout?: boolean;
    whileHover?: TargetAndTransition | VariantLabels;
    whileTap?: TargetAndTransition | VariantLabels;
    whileFocus?: TargetAndTransition | VariantLabels;
    children: ReactNode;
    className?: string;
}

// Dynamic import สำหรับ motion components
export const MotionDiv = dynamic(
    () => import("framer-motion").then((mod) => {
        const Component: React.FC<MotionProps> = ({ children, ...props }) => {
            const MotionDiv = mod.motion.div;
            return <MotionDiv {...props}>{children}</MotionDiv>;
        };
        return Component;
    }),
    { ssr: false }
);

export const MotionTr = dynamic(
    () => import("framer-motion").then((mod) => {
        const Component: React.FC<MotionProps> = ({ children, ...props }) => {
            const MotionTr = mod.motion.tr;
            return <MotionTr {...props}>{children}</MotionTr>;
        };
        return Component;
    }),
    { ssr: false }
);

export const MotionSpan = dynamic(
    () => import("framer-motion").then((mod) => {
        const Component: React.FC<MotionProps> = ({ children, ...props }) => {
            const MotionSpan = mod.motion.span;
            return <MotionSpan {...props}>{children}</MotionSpan>;
        };
        return Component;
    }),
    { ssr: false }
);

export const AnimatePresence = dynamic(
    () => import("framer-motion").then((mod) => mod.AnimatePresence),
    { ssr: false }
); 
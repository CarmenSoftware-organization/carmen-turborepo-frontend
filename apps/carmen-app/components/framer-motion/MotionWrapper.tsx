"use client";

import dynamic from "next/dynamic";

// Dynamic import for motion components
// Note: Types are intentionally left implicit to avoid conflicts between React 19 RC
// and framer-motion's ReactNode type expectations. The components will work correctly
// at runtime even though there are type mismatches at compile time.
export const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export const MotionTr = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.tr),
  { ssr: false }
);

export const MotionSpan = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.span),
  { ssr: false }
);

export const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

export const MotionP = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.p),
  { ssr: false }
);
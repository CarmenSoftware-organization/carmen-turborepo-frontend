"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

// Custom interfaces for ScrollArea components
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "auto" | "always" | "scroll" | "hover";
  scrollHideDelay?: number;
  children?: React.ReactNode;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    // Use type assertion to work with React 19
    const Root = ScrollAreaPrimitive.Root as unknown as React.ComponentType<
      ScrollAreaProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    const Viewport = ScrollAreaPrimitive.Viewport as unknown as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
    >;

    const Corner = ScrollAreaPrimitive.Corner as unknown as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <Root
        ref={ref}
        data-slot="scroll-area"
        className={cn("relative", className)}
        {...props}
      >
        <Viewport
          data-slot="scroll-area-viewport"
          className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
        >
          {children}
        </Viewport>
        <ScrollBar />
        <Corner />
      </Root>
    )
  }
)
ScrollArea.displayName = "ScrollArea"

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  forceMount?: boolean;
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    // Use type assertion to work with React 19
    const Scrollbar = ScrollAreaPrimitive.ScrollAreaScrollbar as unknown as React.ComponentType<
      ScrollBarProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    const Thumb = ScrollAreaPrimitive.ScrollAreaThumb as unknown as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <Scrollbar
        ref={ref}
        data-slot="scroll-area-scrollbar"
        orientation={orientation}
        className={cn(
          "flex touch-none p-px transition-colors select-none",
          orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
          orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
          className
        )}
        {...props}
      >
        <Thumb
          data-slot="scroll-area-thumb"
          className="bg-border relative flex-1 rounded-full"
        />
      </Scrollbar>
    )
  }
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }

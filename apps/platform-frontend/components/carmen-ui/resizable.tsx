"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

// Properly typed wrapper components for react-resizable-panels
// These fix TypeScript compatibility issues with React 19

interface ResizablePanelGroupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "dir"> {
  direction?: "horizontal" | "vertical";
  onLayout?: (sizes: number[]) => void;
  autoSaveId?: string;
  children?: React.ReactNode;
}

const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ className, direction = "horizontal", children, ...props }, ref) => {
    // ResizablePrimitive.PanelGroup is causing TypeScript issues, so we'll use a type assertion
    // to make it compatible with React 19
    const PanelGroup = ResizablePrimitive.PanelGroup as unknown as React.ComponentType<
      ResizablePanelGroupProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <PanelGroup
        ref={ref}
        direction={direction}
        data-slot="resizable-panel-group"
        className={cn(
          "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </PanelGroup>
    )
  }
)
ResizablePanelGroup.displayName = "ResizablePanelGroup"

interface ResizablePanelProps extends Omit<React.ComponentPropsWithoutRef<"div">, "id" | "onResize"> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  onResize?: (size: number) => void;
  id?: string;
  children?: React.ReactNode;
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (props, ref) => {
    // ResizablePrimitive.Panel is causing TypeScript issues, so we'll use a type assertion
    // to make it compatible with React 19
    const Panel = ResizablePrimitive.Panel as unknown as React.ComponentType<
      ResizablePanelProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return <Panel ref={ref} data-slot="resizable-panel" {...props} />
  }
)
ResizablePanel.displayName = "ResizablePanel"

interface ResizableHandleProps extends React.ComponentPropsWithoutRef<"div"> {
  withHandle?: boolean;
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle, ...props }, ref) => {
    // ResizablePrimitive.PanelResizeHandle is causing TypeScript issues, so we'll use a type assertion
    // to make it compatible with React 19
    const PanelResizeHandle = ResizablePrimitive.PanelResizeHandle as unknown as React.ComponentType<
      ResizableHandleProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <PanelResizeHandle
        ref={ref}
        data-slot="resizable-handle"
        className={cn(
          "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
          className
        )}
        {...props}
      >
        {withHandle && (
          <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
            <GripVerticalIcon className="size-2.5" />
          </div>
        )}
      </PanelResizeHandle>
    )
  }
)
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

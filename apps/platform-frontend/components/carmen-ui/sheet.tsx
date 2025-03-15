"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Custom interfaces for Sheet components to fix TypeScript compatibility with React 19
interface SheetProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  children?: React.ReactNode;
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Root = SheetPrimitive.Root as unknown as React.ComponentType<
      SheetProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return <Root ref={ref} data-slot="sheet" {...props} />;
  }
);
Sheet.displayName = "Sheet";

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Trigger = SheetPrimitive.Trigger as unknown as React.ComponentType<
      SheetTriggerProps & { ref?: React.Ref<HTMLButtonElement> }
    >;

    return <Trigger ref={ref} data-slot="sheet-trigger" {...props} />;
  }
);
SheetTrigger.displayName = "SheetTrigger";

interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SheetClose = React.forwardRef<HTMLButtonElement, SheetCloseProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Close = SheetPrimitive.Close as unknown as React.ComponentType<
      SheetCloseProps & { ref?: React.Ref<HTMLButtonElement> }
    >;

    return <Close ref={ref} data-slot="sheet-close" {...props} />;
  }
);
SheetClose.displayName = "SheetClose";

interface SheetPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
  forceMount?: boolean;
}

const SheetPortal = React.forwardRef<HTMLDivElement, SheetPortalProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Portal = SheetPrimitive.Portal as unknown as React.ComponentType<
      SheetPortalProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return <Portal ref={ref} data-slot="sheet-portal" {...props} />;
  }
);
SheetPortal.displayName = "SheetPortal";

interface SheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  forceMount?: boolean;
}

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const Overlay = SheetPrimitive.Overlay as unknown as React.ComponentType<
      SheetOverlayProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <Overlay
        ref={ref}
        data-slot="sheet-overlay"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
          className
        )}
        {...props}
      />
    );
  }
);
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: React.SyntheticEvent) => void;
  forceMount?: boolean;
  children?: React.ReactNode;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, side = "right", ...props }, ref) => {
    // Type assertions to work with React 19
    const Content = SheetPrimitive.Content as unknown as React.ComponentType<
      SheetContentProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    const Close = SheetPrimitive.Close as unknown as React.ComponentType<
      React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }
    >;

    return (
      <SheetPortal>
        <SheetOverlay />
        <Content
          ref={ref}
          data-slot="sheet-content"
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
            side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
            side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
            side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
            className
          )}
          {...props}
        >
          {children}
          <Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </Close>
        </Content>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = "SheetContent";

interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sheet-header"
        className={cn("flex flex-col gap-1.5 p-4", className)}
        {...props}
      />
    );
  }
);
SheetHeader.displayName = "SheetHeader";

interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sheet-footer"
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
      />
    );
  }
);
SheetFooter.displayName = "SheetFooter";

interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const Title = SheetPrimitive.Title as unknown as React.ComponentType<
      SheetTitleProps & { ref?: React.Ref<HTMLHeadingElement> }
    >;

    return (
      <Title
        ref={ref}
        data-slot="sheet-title"
        className={cn("text-foreground font-semibold", className)}
        {...props}
      />
    );
  }
);
SheetTitle.displayName = "SheetTitle";

interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const Description = SheetPrimitive.Description as unknown as React.ComponentType<
      SheetDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }
    >;

    return (
      <Description
        ref={ref}
        data-slot="sheet-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    );
  }
);
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

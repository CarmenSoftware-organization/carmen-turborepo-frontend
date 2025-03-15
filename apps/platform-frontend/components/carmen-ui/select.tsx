"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Custom interfaces for Select components to fix TypeScript compatibility with React 19
interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: "ltr" | "rtl";
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  children?: React.ReactNode;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Root = SelectPrimitive.Root as unknown as React.ComponentType<
      SelectProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return <Root ref={ref} data-slot="select" {...props} />;
  }
);
Select.displayName = "Select";

interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Group = SelectPrimitive.Group as unknown as React.ComponentType<
      SelectGroupProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return <Group ref={ref} data-slot="select-group" {...props} />;
  }
);
SelectGroup.displayName = "SelectGroup";

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  children?: React.ReactNode;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  (props, ref) => {
    // Type assertion to work with React 19
    const Value = SelectPrimitive.Value as unknown as React.ComponentType<
      SelectValueProps & { ref?: React.Ref<HTMLSpanElement> }
    >;

    return <Value ref={ref} data-slot="select-value" {...props} />;
  }
);
SelectValue.displayName = "SelectValue";

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    // Type assertion to work with React 19
    const Trigger = SelectPrimitive.Trigger as unknown as React.ComponentType<
      SelectTriggerProps & { ref?: React.Ref<HTMLButtonElement> }
    >;

    const Icon = SelectPrimitive.Icon as unknown as React.ComponentType<{
      asChild?: boolean;
      children?: React.ReactNode;
    }>;

    return (
      <Trigger
        ref={ref}
        data-slot="select-trigger"
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      >
        {children}
        <Icon asChild>
          <ChevronDownIcon className="size-4 opacity-50" />
        </Icon>
      </Trigger>
    )
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "item-aligned" | "popper";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | null | Array<Element | null>;
  collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  sticky?: "partial" | "always";
  hideWhenDetached?: boolean;
  children?: React.ReactNode;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", ...props }, ref) => {
    // Type assertions to work with React 19
    const Portal = SelectPrimitive.Portal as unknown as React.ComponentType<{
      children?: React.ReactNode;
      container?: HTMLElement;
      forceMount?: boolean;
    }>;

    const Content = SelectPrimitive.Content as unknown as React.ComponentType<
      SelectContentProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    const Viewport = SelectPrimitive.Viewport as unknown as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <Portal>
        <Content
          ref={ref}
          data-slot="select-content"
          position={position}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
            position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <Viewport
            className={cn(
              "p-1",
              position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            )}
          >
            {children}
          </Viewport>
          <SelectScrollDownButton />
        </Content>
      </Portal>
    )
  }
);
SelectContent.displayName = "SelectContent";

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const Label = SelectPrimitive.Label as unknown as React.ComponentType<
      SelectLabelProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <Label
        ref={ref}
        data-slot="select-label"
        className={cn("px-2 py-1.5 text-sm font-medium", className)}
        {...props}
      />
    )
  }
);
SelectLabel.displayName = "SelectLabel";

interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  value: string;
  disabled?: boolean;
  textValue?: string;
  children?: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    // Type assertions to work with React 19
    const Item = SelectPrimitive.Item as unknown as React.ComponentType<
      SelectItemProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    const ItemIndicator = SelectPrimitive.ItemIndicator as unknown as React.ComponentType<
      React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }
    >;

    const ItemText = SelectPrimitive.ItemText as unknown as React.ComponentType<
      React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> }
    >;

    return (
      <Item
        ref={ref}
        data-slot="select-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
          className
        )}
        {...props}
      >
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <ItemIndicator>
            <CheckIcon className="size-4" />
          </ItemIndicator>
        </span>
        <ItemText>{children}</ItemText>
      </Item>
    )
  }
);
SelectItem.displayName = "SelectItem";

// Convert empty interfaces to type aliases
type SelectSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const Separator = SelectPrimitive.Separator as unknown as React.ComponentType<
      SelectSeparatorProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <Separator
        ref={ref}
        data-slot="select-separator"
        className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
        {...props}
      />
    )
  }
);
SelectSeparator.displayName = "SelectSeparator";

type SelectScrollUpButtonProps = React.HTMLAttributes<HTMLDivElement>;

const SelectScrollUpButton = React.forwardRef<HTMLDivElement, SelectScrollUpButtonProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const ScrollUpButton = SelectPrimitive.ScrollUpButton as unknown as React.ComponentType<
      SelectScrollUpButtonProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <ScrollUpButton
        ref={ref}
        data-slot="select-scroll-up-button"
        className={cn(
          "flex cursor-default items-center justify-center py-1",
          className
        )}
        {...props}
      >
        <ChevronUpIcon className="size-4" />
      </ScrollUpButton>
    )
  }
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

type SelectScrollDownButtonProps = React.HTMLAttributes<HTMLDivElement>;

const SelectScrollDownButton = React.forwardRef<HTMLDivElement, SelectScrollDownButtonProps>(
  ({ className, ...props }, ref) => {
    // Type assertion to work with React 19
    const ScrollDownButton = SelectPrimitive.ScrollDownButton as unknown as React.ComponentType<
      SelectScrollDownButtonProps & { ref?: React.Ref<HTMLDivElement> }
    >;

    return (
      <ScrollDownButton
        ref={ref}
        data-slot="select-scroll-down-button"
        className={cn(
          "flex cursor-default items-center justify-center py-1",
          className
        )}
        {...props}
      >
        <ChevronDownIcon className="size-4" />
      </ScrollDownButton>
    )
  }
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

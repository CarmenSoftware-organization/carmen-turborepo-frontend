import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react"
import * as m from '@/paraglide/messages.js';

const rippleStyles = `
  .ripple-effect {
    position: absolute;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = rippleStyles;
    document.head.appendChild(style);
}

const buttonVariants = cva(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "px-2 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    prefixIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    loading?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, disabled, loading, prefixIcon, suffixIcon, onClick, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const handleRipple = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();

            const rippleSize = Math.max(button.offsetWidth, button.offsetHeight);
            const x = e.clientX - rect.left - rippleSize / 2;
            const y = e.clientY - rect.top - rippleSize / 2;

            const ripple = document.createElement("span");
            ripple.className = "ripple-effect";
            ripple.style.width = ripple.style.height = `${rippleSize}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            ripple.addEventListener("animationend", () => ripple.remove());
        }, []);

        const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disabled) {
                handleRipple(e);
                onClick?.(e);
            }
        }, [disabled, handleRipple, onClick]);

        const disabledClass = disabled || loading
            ? `cursor-not-allowed ${variant === "outline"
                ? "bg-neutral-200 text-neutral-400"
                : variant === "default"
                    ? "bg-neutral-300 text-neutral-600"
                    : ""
            }`
            : "";

        return (
            <Comp
                ref={ref}
                onClick={handleClick}
                className={cn(buttonVariants({ variant, size }), disabledClass, className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className="ml-2 animate-spin" />
                        <span>{`${m.loading()}...`}</span>
                    </>
                ) : (
                    <>
                        {prefixIcon && <span>{prefixIcon}</span>}
                        {props.children}
                        {suffixIcon && <span>{suffixIcon}</span>}
                    </>
                )}
            </Comp>
        );
    }
);

CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };

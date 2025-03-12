import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { RotateCw } from "lucide-react"

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean
	isLoading?: boolean;
}

const LoaderButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, disabled, isLoading = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";

		const disabledClass =
			disabled && variant === "outline"
				? "bg-neutral-200 text-neutral-400"
				: disabled && variant === "default"
					? "bg-neutral-300 text-neutral-600"
					: "";

		return (
			<Comp
				className={cn(buttonVariants({ variant, size }), disabledClass, className)}
				ref={ref}
				disabled={disabled || isLoading}
				aria-busy={isLoading}
				aria-label={isLoading ? "Loading..." : props["aria-label"]}
				{...props}
			>
				{isLoading && <RotateCw className="animate-spin mr-2" />}
				{props.children}
			</Comp>
		);
	}
);

LoaderButton.displayName = "LoaderButton";

export { LoaderButton, buttonVariants }

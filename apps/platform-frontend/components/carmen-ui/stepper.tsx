"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const stepVariants = cva(
    "relative flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-primary bg-background text-foreground",
                active: "border-primary bg-primary text-primary-foreground",
                completed: "border-primary bg-primary text-primary-foreground",
                disabled: "border-muted bg-muted text-muted-foreground cursor-not-allowed",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

export interface StepProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stepVariants> {
    completed?: boolean
    active?: boolean
    disabled?: boolean
    icon?: React.ReactNode
    connector?: boolean
    label?: React.ReactNode
    onClick?: () => void
    prevCompleted?: boolean
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
    ({ className, completed, active, disabled, icon, connector = true, label, onClick, prevCompleted, ...props }, ref) => {
        const getStepVariant = () => {
            if (disabled) return "disabled"
            if (completed) return "completed"
            if (active) return "active"
            return "default"
        }

        const stepVariant = getStepVariant()

        let stepContent = props.children;
        if (completed && !active) {
            stepContent = <CheckIcon className="h-5 w-5" />;
        } else if (icon) {
            stepContent = icon;
        }

        return (
            <div
                className={cn("flex-1 relative", onClick && !disabled ? "cursor-pointer" : "", className)}
                ref={ref}
                onClick={!disabled ? onClick : undefined}
                tabIndex={!disabled && onClick ? 0 : undefined}
                onKeyDown={!disabled && onClick ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick();
                    }
                } : undefined}
                role={onClick ? "button" : undefined}
                aria-disabled={disabled}
                {...props}
            >
                {/* Left connector - แสดงสีตาม prevCompleted */}
                <div className="absolute top-5 h-[2px] -translate-y-1/2 left-0 w-1/2 bg-muted">
                    {prevCompleted && <div className="absolute inset-0 bg-primary"></div>}
                </div>

                {/* Right connector - แสดงสีตาม completed ของ step นี้ */}
                {connector && (
                    <div className="absolute top-5 h-[2px] -translate-y-1/2 right-0 w-1/2 bg-muted">
                        {completed && <div className="absolute inset-0 bg-primary"></div>}
                    </div>
                )}

                <div className="flex flex-col items-center">
                    <div
                        className={cn(stepVariants({ variant: stepVariant, className: "" }), "z-10")}
                        aria-current={active ? "step" : undefined}
                    >
                        {stepContent}
                    </div>
                    {label && (
                        <div
                            className={cn(
                                "mt-2 text-center text-sm font-medium",
                                {
                                    "text-foreground": active || completed,
                                    "text-muted-foreground": !active && !completed,
                                    "text-muted-foreground cursor-not-allowed": disabled,
                                }
                            )}
                        >
                            {label}
                        </div>
                    )}
                </div>
            </div>
        )
    },
)
Step.displayName = "Step"

export interface StepLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean
    completed?: boolean
    disabled?: boolean
}

const StepLabel = React.forwardRef<HTMLDivElement, StepLabelProps>(
    ({ className, active, completed, disabled, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "mt-2 text-center text-sm font-medium",
                    {
                        "text-foreground": active || completed,
                        "text-muted-foreground": !active && !completed,
                        "text-muted-foreground cursor-not-allowed": disabled,
                    },
                    className,
                )}
                {...props}
            />
        )
    },
)
StepLabel.displayName = "StepLabel"

export interface StepContentProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean
}

const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(({ className, active, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "mt-4 overflow-hidden transition-all",
                active ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
                className,
            )}
            {...props}
        />
    )
})
StepContent.displayName = "StepContent"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    activeStep: number
    orientation?: "horizontal" | "vertical"
    alternativeLabel?: boolean
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
    ({
        className,
        orientation = "horizontal",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        activeStep,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        alternativeLabel = false,
        ...props
    }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex w-full", orientation === "vertical" ? "flex-col" : "flex-row", className)}
                {...props}
            />
        )
    },
)
Stepper.displayName = "Stepper"

export { Step, StepLabel, StepContent, Stepper }


"use client"

import * as React from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly steps: readonly { title: string; content: React.ReactNode }[]
    initialStep?: number
    onComplete?: () => void
}

export function Stepper({ steps, initialStep = 0, onComplete, className, ...props }: Readonly<StepperProps>) {
    const [currentStep, setCurrentStep] = React.useState(initialStep)
    const [completedSteps, setCompletedSteps] = React.useState<boolean[]>(Array(steps.length).fill(false))

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            // Mark current step as completed
            const newCompletedSteps = [...completedSteps]
            newCompletedSteps[currentStep] = true
            setCompletedSteps(newCompletedSteps)

            // Move to next step
            setCurrentStep(currentStep + 1)
        }
    }

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const goToStep = (stepIndex: number) => {
        // Only allow navigation to completed steps or the next available step
        if (stepIndex < currentStep || stepIndex === currentStep || completedSteps[stepIndex - 1] || stepIndex === 0) {
            setCurrentStep(stepIndex)
        }
    }

    const getStepButtonStyle = (index: number) => {
        if (completedSteps[index]) return "border-primary bg-primary text-primary-foreground";
        if (index === currentStep) return "border-primary text-primary";
        return "border-muted-foreground text-muted-foreground";
    };

    const handleComplete = () => {
        // Mark all steps as completed
        setCompletedSteps(Array(steps.length).fill(true))

        // Call onComplete callback if provided
        if (onComplete) {
            onComplete()
        } else {
            // Default behavior
            alert("Success!")
        }
    }

    return (
        <div className={cn("space-y-8", className)} {...props}>
            {/* Step indicators with justify-between */}
            <div className="flex justify-between items-center w-full">
                {steps.map((step, index) => (
                    <div
                        key={`stepper-${step.title}-${index}`}
                        className={cn(
                            "flex flex-col items-center transition-all",
                            index <= currentStep || completedSteps[index] ? "opacity-100" : "opacity-50",
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => goToStep(index)}
                            aria-label={`Go to step ${index + 1}: ${step.title}`}
                            aria-current={index === currentStep ? "step" : undefined}
                            disabled={!(index < currentStep || index === currentStep || completedSteps[index - 1] || index === 0)}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                getStepButtonStyle(index),
                            )}
                        >
                            {completedSteps[index] ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                        </button>
                        <span
                            className={cn(
                                "mt-2 text-sm font-medium text-center",
                                index === currentStep ? "text-primary" : "text-muted-foreground",
                            )}
                        >
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Current step content */}
            <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Step {currentStep + 1}: {steps[currentStep].title}
                </h2>
                <div className="min-h-[200px]">{steps[currentStep].content}</div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={goToPrevStep} disabled={currentStep === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                    <Button onClick={handleComplete}>Complete</Button>
                ) : (
                    <Button onClick={goToNextStep}>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}


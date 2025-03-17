"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Step, Stepper } from "@/components/carmen-ui/stepper"
import { Input } from "@/components/carmen-ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/carmen-ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/carmen-ui/label"

const steps = [
    {
        label: "Personal Information",
        description: "Provide your personal details",
        content: (
            <div className="space-y-4">
                <p>Fill in your personal information to get started.</p>
                <Input type="text" placeholder="First Name" />
            </div>
        ),
    },
    {
        label: "Account Setup",
        description: "Set up your account credentials",
        content: (
            <div className="space-y-4">
                <p>Create your account credentials for secure access.</p>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        ),
    },
    {
        label: "Preferences",
        description: "Choose your preferences",
        content: (
            <div className="space-y-4">
                <p>Select your preferences to personalize your experience.</p>
                <div className="flex items-center gap-2">
                    <Checkbox />
                    <Label htmlFor="terms">I accept the terms and conditions</Label>
                </div>


            </div>
        ),
    },
    {
        label: "Review",
        description: "Review your information",
        content: (
            <div className="space-y-4">
                <p>Review your information before submitting.</p>
                <div className="rounded-md border p-4">
                    <div className="space-y-2">
                        <div className="h-4 w-1/2 rounded bg-muted" />
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-2/3 rounded bg-muted" />
                        <div className="h-4 w-1/2 rounded bg-muted" />
                        <div className="h-4 w-1/4 rounded bg-muted" />
                    </div>
                </div>
            </div>
        ),
    },
]

export function StepperDemo() {
    const [activeStep, setActiveStep] = React.useState(0)
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([])

    const handleNext = () => {
        setCompletedSteps((prev) => {
            if (!prev.includes(activeStep)) {
                const newSteps = [...prev, activeStep];
                newSteps.sort((a, b) => a - b);
                return newSteps;
            }
            return prev;
        });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const handleBack = () => {
        setCompletedSteps((prev) => {
            return prev.filter(step => step !== activeStep);
        });
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompletedSteps([])
    }

    const handleStepClick = (index: number) => {
        if (completedSteps.includes(index) || index === 0 || (completedSteps.length > 0 && index <= Math.max(...completedSteps) + 1)) {
            if (index > activeStep) {
                const updatedSteps = [...completedSteps];
                if (!updatedSteps.includes(activeStep)) {
                    updatedSteps.push(activeStep);
                }

                for (let i = activeStep + 1; i < index; i++) {
                    if (!updatedSteps.includes(i)) {
                        updatedSteps.push(i);
                    }
                }

                updatedSteps.sort((a, b) => a - b);
                setCompletedSteps(updatedSteps);
            }

            setActiveStep(index);
        }
    }

    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle>Multi-step Form</CardTitle>
                <CardDescription>Complete all steps to submit your information</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <Stepper activeStep={activeStep} className="mb-8">
                    {steps.map((step, index) => {
                        const isActive = activeStep === index
                        const isCompleted = completedSteps.includes(index)
                        const isClickable = isCompleted || index === 0 ||
                            (completedSteps.length > 0 && index <= Math.max(...completedSteps) + 1)

                        const isPrevCompleted = index > 0 && completedSteps.includes(index - 1)

                        return (
                            <Step
                                key={step.label}
                                active={isActive}
                                completed={isCompleted}
                                connector={index < steps.length - 1}
                                label={step.label}
                                onClick={() => handleStepClick(index)}
                                disabled={!isClickable}
                                prevCompleted={isPrevCompleted}
                            >
                                {index + 1}
                            </Step>
                        )
                    })}
                </Stepper>

                {steps.map((step, index) => (
                    <div key={step.label} className={activeStep === index ? "block" : "hidden"}>
                        {step.content}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={activeStep === 0} className="gap-1">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back
                </Button>
                <div>
                    {activeStep === steps.length - 1 ? (
                        <Button onClick={handleReset}>Reset</Button>
                    ) : (
                        <Button onClick={handleNext} className="gap-1">
                            Next
                            <ArrowRightIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}


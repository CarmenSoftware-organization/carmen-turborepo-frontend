"use client";

import { Stepper } from "@/components/ui-custom/Stepper";
import { useState } from "react";

const steps = [
    { title: "Step 1", description: "Create your account", stepNumber: 1 },
    { title: "Step 2", description: "Verify your email", stepNumber: 2 },
    { title: "Step 3", description: "Add your details", stepNumber: 3 },
    { title: "Step 4", description: "Confirm and finish", stepNumber: 4 },
]
export default function StepperPage() {
    const [currentStep, setCurrentStep] = useState(0)
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-8 text-center">Stepper Demo</h1>
            <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} isStepValid={true} />
            <div className="mt-8 p-4 border rounded-md">
                <h2 className="text-lg font-semibold mb-2">Current Step Content</h2>
                <p>{steps[currentStep].description}</p>
            </div>
        </div>
    )
};


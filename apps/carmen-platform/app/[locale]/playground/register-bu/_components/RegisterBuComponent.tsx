"use client";

import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StepBu from "./form-step/StepBu";
import StepUser from "./form-step/StepUser";
import StepConfig from "./form-step/StepConfig";
import {
  registerBuSchema,
  stepBuSchema,
  stepUserSchema,
  stepConfigSchema,
  type RegisterBuFormData,
} from "../_schema/register-bu.schema";

const steps = [
  { step: 1, component: StepBu, schema: stepBuSchema },
  { step: 2, component: StepUser, schema: stepUserSchema },
  { step: 3, component: StepConfig, schema: stepConfigSchema },
];

export default function RegisterBuComponent() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<RegisterBuFormData>({
    resolver: zodResolver(registerBuSchema),
    defaultValues: {
      cluster_id: "",
      code: "",
      name: "",
      is_hq: false,
      is_active: true,
    },
  });

  const onSubmit = (data: RegisterBuFormData) => {
    console.log("Form submitted:", data);
  };

  const handleNext = async () => {
    const currentStepConfig = steps.find((s) => s.step === currentStep);
    if (!currentStepConfig) return;

    const fieldsToValidate = Object.keys(
      currentStepConfig.schema.shape
    ) as (keyof RegisterBuFormData)[];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper value={currentStep} onValueChange={setCurrentStep} className="space-y-8">
            <StepperNav>
              {steps.map(({ step }) => (
                <StepperItem key={step} step={step}>
                  <StepperTrigger asChild>
                    <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
                      {step}
                    </StepperIndicator>
                  </StepperTrigger>
                  {steps.length > step && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>
            <StepperPanel className="text-sm">
              {steps.map(({ step, component: StepComponent }) => (
                <StepperContent
                  className="w-full"
                  key={step}
                  value={step}
                >
                  <StepComponent />
                </StepperContent>
              ))}
            </StepperPanel>
            <div className="flex items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep === steps.length ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </Stepper>
        </form>
      </Form>
    </div>
  );
}

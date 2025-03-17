"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Stepper } from "@/components/ui/stepper";
import { Steps } from "@/components/ui/steps";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function BuForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        hearAbout: "social",
        comments: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleRadioChange = (value: string) => {
        setFormData((prev) => ({ ...prev, hearAbout: value }))
    }

    const handleComplete = () => {
        // Show success toast
        alert("Form Submitted!")
    }

    const steps = [
        {
            title: "Personal Information",
            content: (
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Address Details",
            content: (
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="New York" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input id="zip" placeholder="10001" value={formData.zip} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Additional Information",
            content: (
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="preferences">How did you hear about us?</Label>
                        <RadioGroup value={formData.hearAbout} onValueChange={handleRadioChange}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="social" id="social" />
                                <Label htmlFor="social">Social Media</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="friend" id="friend" />
                                <Label htmlFor="friend">Friend Referral</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="search" id="search" />
                                <Label htmlFor="search">Search Engine</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other">Other</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="comments">Additional Comments</Label>
                        <Textarea id="comments" placeholder="Tell us more..." value={formData.comments} onChange={handleChange} />
                    </div>
                </div>
            ),
        },
        {
            title: "Review & Submit",
            content: (
                <div className="space-y-4">
                    <p className="text-muted-foreground">Please review your information before submitting.</p>
                    <div className="rounded-md bg-muted p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Name:</div>
                            <div>{formData.name || "Not provided"}</div>

                            <div className="font-medium">Email:</div>
                            <div>{formData.email || "Not provided"}</div>

                            <div className="font-medium">Address:</div>
                            <div>{formData.address || "Not provided"}</div>

                            <div className="font-medium">City:</div>
                            <div>{formData.city || "Not provided"}</div>

                            <div className="font-medium">Zip Code:</div>
                            <div>{formData.zip || "Not provided"}</div>

                            <div className="font-medium">How you heard about us:</div>
                            <div>{formData.hearAbout}</div>

                            <div className="font-medium">Comments:</div>
                            <div>{formData.comments || "None"}</div>
                        </div>
                    </div>
                </div>
            ),
        },
    ]
    return (
        <Stepper steps={steps} onComplete={handleComplete} />
    )
};

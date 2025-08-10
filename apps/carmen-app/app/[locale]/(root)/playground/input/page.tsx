"use client";

import InputCustom from "@/components/ui-custom/InputCustom";
import { PasswordInput } from "@/components/ui-custom/PasswordInput";
import { Mail, Lock, Search, CheckCircle, AlertCircle } from "lucide-react";

export default function InputPage() {
    return (
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Input Component Playground</h1>

            {/* Password Input with Toggle */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Password Input with Toggle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Using PasswordInput Component</h3>
                        <PasswordInput
                            placeholder="Enter password"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">With Built-in Toggle</h3>
                        <InputCustom
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            startContent={<Lock className="h-4 w-4 text-gray-500" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Password Toggle Disabled</h3>
                        <InputCustom
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            showPasswordToggle={false}
                            endContent={<Lock className="h-4 w-4 text-gray-500" />}
                        />
                    </div>
                </div>
            </section>

            {/* Label Placement Examples */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Label Placement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Label Top (Default)</h3>
                        <InputCustom
                            label="Username"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Label Inside</h3>
                        <InputCustom
                            label="Username"
                            labelPlacement="inside"
                            placeholder="This shows when input has value"
                            required
                            type="password"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Label Left</h3>
                        <InputCustom
                            label="Username"
                            labelPlacement="left"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Label Right</h3>
                        <InputCustom
                            label="Agree to terms"
                            labelPlacement="right"
                            type="checkbox"
                        />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Label Over The Line</h3>
                        <InputCustom
                            label="Username"
                            labelPlacement="overTheLine"
                            placeholder="Enter your username"
                        />
                    </div>
                </div>
            </section>

            {/* Required Fields */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Required Fields</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Using required prop</h3>
                        <InputCustom
                            label="Email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Using isRequired prop</h3>
                        <InputCustom
                            label="Full Name"
                            placeholder="Enter your full name"
                            isRequired
                        />
                    </div>
                </div>
            </section>

            {/* Start & End Content */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Start & End Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Start Content</h3>
                        <InputCustom
                            label="Email Address"
                            placeholder="Enter email"
                            startContent={<Mail className="h-4 w-4 text-gray-500" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">End Content</h3>
                        <InputCustom
                            label="Search"
                            placeholder="Search terms..."
                            endContent={<Search className="h-4 w-4 text-gray-500" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Both Start & End Content</h3>
                        <InputCustom
                            label="Search"
                            placeholder="Search..."
                            startContent={<Search className="h-4 w-4 text-gray-500" />}
                            endContent={<span className="text-xs text-gray-500">⌘K</span>}
                            type="text"
                        />
                    </div>
                </div>
            </section>

            {/* Validation Examples */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Validation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Min/Max Length</h3>
                        <InputCustom
                            label="Username (5-10 characters)"
                            placeholder="Enter 5-10 characters"
                            minLength={5}
                            maxLength={10}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Pattern (Numbers only)</h3>
                        <InputCustom
                            label="Phone Number"
                            placeholder="Enter numbers only"
                            pattern="[0-9]*"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Email Validation</h3>
                        <InputCustom
                            label="Email"
                            type="email"
                            placeholder="Enter a valid email"
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">URL Validation</h3>
                        <InputCustom
                            label="Website"
                            type="url"
                            placeholder="Enter a valid URL"
                        />
                    </div>
                </div>
            </section>

            {/* Error State */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Error State</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">With Error Message</h3>
                        <InputCustom
                            label="Username"
                            placeholder="Enter username"
                            error="This username is already taken"
                            startContent={<AlertCircle className="h-4 w-4 text-red-500" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Success State (Custom)</h3>
                        <InputCustom
                            label="Email"
                            placeholder="Enter email"
                            className="border-green-500 focus:ring-green-500"
                            endContent={<CheckCircle className="h-4 w-4 text-green-500" />}
                        />
                    </div>
                </div>
            </section>

            {/* Disabled State */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold">Disabled State</h2>
                <InputCustom
                    label="Disabled Input"
                    placeholder="This input is disabled"
                    disabled
                />
            </section>
        </div>
    )
}

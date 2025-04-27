"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toastSuccess } from "@/components/ui-custom/Toast"
import { profileFormSchema, ProfileFormValues } from "./ProfileComponent"

interface EditProfileDialogProps {
    readonly open: boolean
    readonly onOpenChange: (open: boolean) => void
    readonly profile: {
        readonly id: string
        readonly email: string
        readonly user_info: {
            readonly firstname: string
            readonly middlename?: string
            readonly lastname: string
        }
        readonly business_unit: {
            readonly id: string
            readonly name: string
            readonly is_default?: boolean
        }[]
    }
    readonly onSave: (values: ProfileFormValues) => void
}

export function EditProfileDialog({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstname: profile.user_info.firstname,
            middlename: profile.user_info.middlename ?? "",
            lastname: profile.user_info.lastname,
            email: profile.email,
        },
    })

    function onSubmit(data: ProfileFormValues) {
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            onSave(data)
            setIsSubmitting(false)
            onOpenChange(false)
            toastSuccess({ message: "Profile updated successfully" })
        }, 1000)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile information here.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middlename"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Middle name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your middle name (optional)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

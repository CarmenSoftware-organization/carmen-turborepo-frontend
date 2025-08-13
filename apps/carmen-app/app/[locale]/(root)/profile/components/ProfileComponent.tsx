"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Mail, Briefcase, Edit } from "lucide-react"
import { useState } from "react"
import { EditProfileDialog } from "./EditProfileDialog";
import { z } from "zod";

export const profileFormSchema = z.object({
    firstname: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    middlename: z.string().optional(),
    lastname: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface BusinessUnit {
    id: string;
    name: string;
    is_default?: boolean;
}

interface UserInfo {
    firstname: string;
    middlename?: string;
    lastname: string;
}

export interface UserProfileDto {
    id: string;
    email: string;
    user_info: UserInfo;
    business_unit: BusinessUnit[];
}


export default function ProfileComponent() {
    const { user } = useAuth();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const fullName = `${user?.user_info.firstname} ${user?.user_info.middlename} ${user?.user_info.lastname}`
    const initials = `${user?.user_info.firstname.charAt(0)}${user?.user_info.lastname.charAt(0)}`;

    const handleProfileUpdate = (values: ProfileFormValues) => {
        console.log(values)
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={fullName} />
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-bold">{fullName}</h1>
                            <div className="fxr-c text-muted-foreground mt-1">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{user?.email}</span>
                            </div>
                        </div>
                        <Button className="w-full md:w-auto" onClick={() => setIsEditDialogOpen(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {user?.business_unit.map((bu) => (
                            <Badge key={bu.id} variant={bu.is_default ? "default" : "outline"} className="fxr-c gap-1">
                                <Building2 className="h-3 w-3" />
                                {bu.name}
                                {bu.is_default && " (Default)"}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger value="business">Business Units</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Your personal information and account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                                    <p className="text-sm">{user?.user_info.firstname}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Middle Name</p>
                                    <p className="text-sm">{user?.user_info.middlename}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                                    <p className="text-sm">{user?.user_info.lastname}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="business">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Units</CardTitle>
                            <CardDescription>Your associated business units</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {user?.business_unit.map((bu) => (
                                    <Card key={bu.id} className={bu.is_default ? "border-primary" : ""}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="fxr-c gap-2">
                                                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <h3 className="font-medium">{bu.name}</h3>
                                                        <p className="text-xs text-muted-foreground">ID: {bu.id}</p>
                                                    </div>
                                                </div>
                                                {bu.is_default && <Badge>Default</Badge>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {user && (
                <EditProfileDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    profile={user}
                    onSave={handleProfileUpdate}
                />
            )}
        </div>
    );
}

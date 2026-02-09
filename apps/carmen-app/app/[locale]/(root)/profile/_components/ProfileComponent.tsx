"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Edit, User } from "lucide-react";
import { useState } from "react";
import { EditProfileDialog } from "./EditProfileDialog";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { initName } from "@/utils/format/name";

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
});

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
  const tProfilePage = useTranslations("ProfilePage");
  const tCommon = useTranslations("Common");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const fullName = `${user?.data.user_info.firstname} ${user?.data.user_info.middlename} ${user?.data.user_info.lastname}`;
  const convertName = initName(user?.data.user_info.firstname, user?.data.user_info.lastname);

  const handleProfileUpdate = (values: ProfileFormValues) => {
    console.log(values);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/placeholder.svg?height=64&width=64" alt={fullName} />
          <AvatarFallback className="text-sm">{convertName}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-semibold">{fullName}</h1>
              <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                <Mail className="h-3 w-3 mr-1" />
                <span>{user?.data.email}</span>
              </div>
            </div>
            <Button size="sm" onClick={() => setIsEditDialogOpen(true)} className="gap-1">
              <Edit />
              {tCommon("edit")}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-8">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <p className="col-span-1 text-muted-foreground text-sm">{tProfilePage("email")}</p>
          </div>
          <p className="col-span-7 text-sm">{user?.data.email}</p>
        </div>
        <div className="grid grid-cols-8">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <p className="col-span-1 text-muted-foreground text-sm">{tProfilePage("name")}</p>
          </div>
          <p className="col-span-7 text-sm">{fullName}</p>
        </div>
      </div>
      <Separator />
      <div>
        <h1 className="text-lg font-semibold mb-2">{tProfilePage("businessUnits")}</h1>
        <ul className="list-disc list-inside space-y-1">
          {user?.data.business_unit.map((bu) => (
            <li key={bu.id}>
              <span className="font-medium mr-2 text-xs">{bu.name}</span>
              {bu.is_default && <Badge className="text-xs">{tProfilePage("default")}</Badge>}
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Dialog */}
      {user && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profile={user.data}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}

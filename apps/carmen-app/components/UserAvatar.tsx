"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, User } from "lucide-react";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import "@/styles/layout.css";

export default function UserAvatar() {
  const { logout, user } = useAuth();
  const t = useTranslations("Common");

  const getInitials = () => {
    if (!user?.data.user_info) return "U";
    const { firstname, lastname } = user.data.user_info;
    return `${firstname?.[0].toUpperCase() || ""}${lastname?.[0].toUpperCase() || ""}`;
  };

  const getMiddleName = () => {
    if (!user?.data.user_info?.middlename) return "";
    return `${user.data.user_info.middlename} `;
  };

  const fullName = user?.data.user_info
    ? `${user.data.user_info.firstname || ""} ${getMiddleName()}${user.data.user_info.lastname || ""}`
    : "User";

  const email = user?.data.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full" aria-label="User menu">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="font-medium text-xs">{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="fx-c">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="email-font">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/profile" className="fxr-c gap-2">
            <User className="h-4 w-4" />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

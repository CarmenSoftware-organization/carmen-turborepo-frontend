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

  const userInfo = user?.data?.user_info;

  const initName = () => {
    const info = user?.data?.user_info;
    if (!info) return "U";
    const cleanName = (name: string) => {
      const leadingVowels = /^[เแโใไ]/;
      return name?.trim().replace(leadingVowels, "") || "";
    };

    const first = cleanName(info.firstname)[0] || "";
    const last = cleanName(info.lastname)[0] || "";

    return (first + last).toUpperCase() || "U";
  };

  const getMiddleName = () => {
    if (!user?.data.user_info?.middlename) return "";
    return `${user.data.user_info.middlename} `;
  };

  const fullName = userInfo
    ? [userInfo.firstname, getMiddleName(), userInfo.lastname].filter(Boolean).join(" ")
    : "User";

  const email = user?.data.email ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 xl:h-8 xl:w-8 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-7 w-7 xl:h-8 xl:w-8">
            <AvatarFallback className="font-medium text-[10px] xl:text-xs">
              {initName()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 xl:w-56">
        <DropdownMenuLabel className="p-2 xl:p-3">
          <div className="fx-c">
            <p className="text-xs xl:text-sm font-medium">{fullName}</p>
            <p className="email-font text-[10px] xl:text-xs">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-xs xl:text-sm py-1.5 xl:py-2">
          <Link href="/profile" className="fxr-c gap-1.5 xl:gap-2">
            <User className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs xl:text-sm py-1.5 xl:py-2"
          onClick={logout}
        >
          <LogOut className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

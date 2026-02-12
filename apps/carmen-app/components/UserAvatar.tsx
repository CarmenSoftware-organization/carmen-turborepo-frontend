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

import { initName } from "@/utils/format/name";

export default function UserAvatar() {
  const { logout, user } = useAuth();
  const t = useTranslations("Common");

  const userInfo = user?.data?.user_info;

  const convertName = initName(userInfo?.firstname, userInfo?.lastname);

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
          className="h-7 w-7 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="font-medium text-[11px]">
              {convertName}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="p-2">
          <div className="flex flex-col">
            <p className="text-xs font-medium">{fullName}</p>
            <p className="text-muted-foreground truncate text-[11px]">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-xs py-1.5">
          <Link href="/profile" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs py-1.5"
          onClick={logout}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

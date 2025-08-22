import { PLATFORM_ROLE } from "@/dto/cluster.dto";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getPlatformRoleBadgeVariant = (platform_role: PLATFORM_ROLE) => {
  switch (platform_role) {
    case PLATFORM_ROLE.SUPER_ADMIN:
      return 'default';
    case PLATFORM_ROLE.PLATFORM_ADMIN:
      return 'secondary';
    case PLATFORM_ROLE.SUPPORT_MANAGER:
      return 'warning';
    case PLATFORM_ROLE.SUPPORT_STAFF:
      return 'info';
    case PLATFORM_ROLE.SECURITY_OFFICER:
      return 'destructive';
    case PLATFORM_ROLE.INTEGRATION_DEVELOPER:
      return 'outline';
    case PLATFORM_ROLE.USER:
      return 'active';
  }
}

export const getPlatformName = (platform_role: PLATFORM_ROLE) => {
  switch (platform_role) {
    case PLATFORM_ROLE.SUPER_ADMIN:
      return 'Super Admin';
    case PLATFORM_ROLE.PLATFORM_ADMIN:
      return 'Platform Admin';
    case PLATFORM_ROLE.SUPPORT_MANAGER:
      return 'Support Manager';
    case PLATFORM_ROLE.SUPPORT_STAFF:
      return 'Support Staff';
    case PLATFORM_ROLE.SECURITY_OFFICER:
      return 'Security Officer';
    case PLATFORM_ROLE.INTEGRATION_DEVELOPER:
      return 'Integration Developer';
    case PLATFORM_ROLE.USER:
      return 'User';
  }
}
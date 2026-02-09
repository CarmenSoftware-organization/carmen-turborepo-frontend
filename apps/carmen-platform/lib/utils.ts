import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PLATFORM_ROLE } from '@/dto/cluster.dto';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const platformRoleNames: Record<PLATFORM_ROLE, string> = {
  [PLATFORM_ROLE.SUPER_ADMIN]: 'Super Admin',
  [PLATFORM_ROLE.PLATFORM_ADMIN]: 'Platform Admin',
  [PLATFORM_ROLE.SUPPORT_MANAGER]: 'Support Manager',
  [PLATFORM_ROLE.SUPPORT_STAFF]: 'Support Staff',
  [PLATFORM_ROLE.SECURITY_OFFICER]: 'Security Officer',
  [PLATFORM_ROLE.INTEGRATION_DEVELOPER]: 'Integration Developer',
  [PLATFORM_ROLE.USER]: 'User',
};

export function getPlatformName(role: PLATFORM_ROLE): string {
  return platformRoleNames[role] ?? role;
}

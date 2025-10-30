import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 * Combines clsx for conditional classes and tailwind-merge to handle conflicting Tailwind classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 * @example
 * cn("px-2 py-1", "px-4") // "py-1 px-4"
 * cn("text-red-500", condition && "text-blue-500") // "text-blue-500" if condition is true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

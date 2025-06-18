import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: string): string => {
  const totalSeconds = parseInt(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
};

export const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Safe array access with proper null/undefined checks
export function safeArrayAccess<T>(arr: T[] | undefined | null): T[] {
  if (!arr) return [];
  if (!Array.isArray(arr)) return [];
  return arr;
}

// Safe object property access
export function safeGet<T>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  if (!obj || typeof obj !== "object") return defaultValue;
  try {
    return (
      path.split(".").reduce((current, key) => {
        return current && typeof current === "object"
          ? current[key]
          : undefined;
      }, obj) ?? defaultValue
    );
  } catch {
    return defaultValue;
  }
}

// Safe string operations
export function safeString(value: any): string {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : String(value);
}

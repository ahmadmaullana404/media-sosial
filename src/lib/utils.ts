import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility untuk menggabungkan class Tailwind CSS dengan aman
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal relatif (e.g. "2 jam lalu")
 */
export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}mnt lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}jam lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}hari lalu`;
  
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

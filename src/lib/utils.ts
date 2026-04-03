import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' FCFA';
}

export function isRealImage(url?: string): boolean {
  if (!url) return false;
  const demoPatterns = [
    'placeholder',
    'images.google.com',
    'pastèque',
    'papillon',
    'pirogue'
  ];
  return !demoPatterns.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()));
}

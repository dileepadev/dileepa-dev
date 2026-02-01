import { type ClassValue, clsx } from 'clsx';

// Utility function for merging class names
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Format date for display
export function formatDate(date: string): string {
  return date;
}

// Check if we're on the client side
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// Smooth scroll to element
export function scrollToElement(id: string): void {
  if (!isClient()) return;
  
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

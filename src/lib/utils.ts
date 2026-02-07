import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export utility functions
export { formatCurrency, formatDate } from './utils/format'
export { isExpired, getStatusVariant } from './utils/quote'

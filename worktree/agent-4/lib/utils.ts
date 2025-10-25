import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num)
}

export function formatCost(cost: string): string {
  return cost.replace('M', '만원')
}

export function formatSpeed(speed: number): string {
  return `${formatNumber(speed)} Mbps`
}

export function getRatingColor(rating: number): string {
  if (rating >= 9) return 'text-green-600'
  if (rating >= 8) return 'text-blue-600'
  if (rating >= 7) return 'text-yellow-600'
  return 'text-orange-600'
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 9) return 'bg-green-50'
  if (rating >= 8) return 'bg-blue-50'
  if (rating >= 7) return 'bg-yellow-50'
  return 'bg-orange-50'
}

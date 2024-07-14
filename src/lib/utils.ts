import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeURIComponentString({encodedString}:{encodedString:string}) {
  return decodeURIComponent(encodedString);
}

export function cleanAndSplitString({inputString}:{inputString:string}) {
  return inputString
  .split(',')
  .map(item => item.trim())
  .filter(item => item !== '');
}

export function formatISODate({isoString}:{isoString:string}) {
  const date = new Date(isoString);

  const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
}
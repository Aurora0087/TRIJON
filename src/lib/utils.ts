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
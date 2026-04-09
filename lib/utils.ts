import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GiftTheme } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getThemeColors(theme: GiftTheme) {
  const themes = {
    birthday: {
      primary: '#ec4899',
      secondary: '#fce7f3',
      box: '#fbcfe8',
      ribbon: '#ec4899',
      accent: '#f472b6',
    },
    love: {
      primary: '#ef4444',
      secondary: '#fee2e2',
      box: '#fecaca',
      ribbon: '#ef4444',
      accent: '#f87171',
    },
    friendship: {
      primary: '#8b5cf6',
      secondary: '#ede9fe',
      box: '#ddd6fe',
      ribbon: '#8b5cf6',
      accent: '#a78bfa',
    },
    celebration: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
      box: '#fde68a',
      ribbon: '#f59e0b',
      accent: '#fbbf24',
    },
  };
  return themes[theme] || themes.birthday;
}


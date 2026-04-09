'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GiftTheme } from '@/types';
import { getThemeColors } from '@/lib/utils';

interface ConfettiProps {
  theme: GiftTheme;
}

export default function Confetti({ theme }: ConfettiProps) {
  const colors = getThemeColors(theme);

  useEffect(() => {
    // Create a burst of confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Create confetti from multiple origins
      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: [colors.primary, colors.secondary, colors.accent, '#ffffff'],
      });
      confetti({
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: [colors.primary, colors.secondary, colors.accent, '#ffffff'],
      });
    }, 250);

    // Final big burst
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [colors.primary, colors.secondary, colors.accent, '#ffffff'],
      });
    }, duration - 500);

    return () => {
      clearInterval(interval);
      confetti.reset();
    };
  }, [colors]);

  return null;
}


'use client';

import { motion } from 'framer-motion';
import { GiftTheme, THEMES } from '@/types';

interface ThemeSelectorProps {
  selected: GiftTheme;
  onSelect: (theme: GiftTheme) => void;
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {THEMES.map((theme) => {
        const isSelected = selected === theme.id;
        
        return (
          <motion.button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`
              relative p-6 rounded-2xl transition-all overflow-hidden
              ${isSelected ? 'ring-4 ring-offset-2' : 'hover:scale-105'}
            `}
            style={{
              background: theme.background,
              ringColor: theme.primaryColor,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                layoutId="selectedTheme"
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, ${theme.primaryColor}20 0%, transparent 70%)`,
                }}
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Theme Icon */}
              <motion.div
                className="text-4xl mb-2"
                animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {theme.icon}
              </motion.div>
              
              {/* Theme Name */}
              <span
                className="font-semibold text-lg"
                style={{ color: theme.primaryColor }}
              >
                {theme.name}
              </span>
              
              {/* Color dots */}
              <div className="flex gap-1 mt-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.secondaryColor }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
            </div>
            
            {/* Checkmark for selected */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: theme.primaryColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}


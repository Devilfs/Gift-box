'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftTheme } from '@/types';
import { getThemeColors } from '@/lib/utils';

interface GiftBoxProps {
  theme: GiftTheme;
  isOpen?: boolean;
  onOpen?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isShaking?: boolean;
}

export function GiftBox({ theme, isOpen = false, onOpen, size = 'md', isShaking = false }: GiftBoxProps) {
  const colors = getThemeColors(theme);
  
  const sizes = {
    sm: { box: 'w-32 h-24', lid: 'w-36 h-8', ribbon: 'w-4' },
    md: { box: 'w-48 h-36', lid: 'w-52 h-12', ribbon: 'w-6' },
    lg: { box: 'w-64 h-48', lid: 'w-72 h-16', ribbon: 'w-8' },
  };

  const currentSize = sizes[size];

  // Shake animation variants
  const shakeVariants = {
    idle: { rotate: 0 },
    shaking: {
      rotate: [-5, 5, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative flex flex-col items-center" onClick={onOpen}>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: colors.primary, opacity: 0.3 }}
        animate={isOpen ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Magic glow burst when opening */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}80 0%, transparent 70%)`
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating particles around the box */}
      <AnimatePresence>
        {!isOpen && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: colors.accent,
                  left: `${20 + i * 12}%`,
                  top: '10%'
                }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -40, -80],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Lid */}
      <motion.div
        className={`${currentSize.lid} rounded-t-2xl relative z-10`}
        style={{ backgroundColor: colors.primary }}
        variants={shakeVariants}
        animate={isShaking ? "shaking" : "idle"}
        initial={{ rotateX: 0, y: 0 }}
        animate={isOpen ? { 
          rotateX: -120, 
          y: -30,
          transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 }
        } : {}}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
      >
        {/* Ribbon vertical - with untying animation */}
        <motion.div
          className={`absolute ${currentSize.ribbon} h-full left-1/2 -translate-x-1/2`}
          style={{ backgroundColor: colors.secondary }}
          animate={isOpen ? {
            height: [100, 0],
            y: [-20, -40],
            opacity: [1, 0]
          } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        {/* Bow - with untie animation */}
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          initial={{ scale: 1 }}
          animate={isOpen ? { 
            scale: 1.3,
            y: -20,
            opacity: 0
          } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
          <motion.div 
            className="absolute -top-3 -left-6 w-6 h-6 rounded-full"
            style={{ backgroundColor: colors.secondary }}
            animate={isOpen ? { 
              x: -20,
              y: -10,
              opacity: 0 
            } : {}}
          />
          <motion.div 
            className="absolute -top-3 -right-6 w-6 h-6 rounded-full"
            style={{ backgroundColor: colors.secondary }}
            animate={isOpen ? { 
              x: 20,
              y: -10,
              opacity: 0 
            } : {}}
          />
        </motion.div>
      </motion.div>

      {/* Box body */}
      <motion.div
        className={`${currentSize.box} rounded-b-2xl rounded-t-xl relative overflow-hidden`}
        style={{ backgroundColor: colors.primary }}
        variants={shakeVariants}
        animate={isShaking ? "shaking" : "idle"}
        initial={{ y: 0 }}
        animate={isOpen ? { 
          y: 15,
          transition: { duration: 0.8, ease: "easeInOut", delay: 0.4 }
        } : {}}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
      >
        {/* Inner glow when opened */}
        {isOpen && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              background: `linear-gradient(180deg, ${colors.accent}60 0%, transparent 100%)`,
            }}
          >
            {/* Magic particles inside */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`inner-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.accent }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos(i * Math.PI / 4) * 40,
                  y: Math.sin(i * Math.PI / 4) * 40 - 20
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </motion.div>
        )}
        
        {/* Ribbon horizontal */}
        <motion.div
          className={`absolute h-full ${currentSize.ribbon} left-1/2 -translate-x-1/2`}
          style={{ backgroundColor: colors.secondary }}
          animate={isOpen ? { opacity: 0 } : {}}
          transition={{ delay: 0.3 }}
        />
        
        {/* Decorative stripes */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-1/4" style={{ backgroundColor: colors.secondary }} />
          <div className="w-full h-1/4 mt-auto" style={{ backgroundColor: colors.secondary }} />
        </div>
      </motion.div>

      {/* Sparkles on open */}
      {isOpen && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: i % 2 === 0 ? colors.accent : colors.secondary,
              }}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: Math.cos(i * Math.PI / 6) * 80,
                y: Math.sin(i * Math.PI / 6) * 80 - 40,
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.15 
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

// Floating arrival wrapper component
export function FloatingGiftBox(props: GiftBoxProps) {
  const [hasArrived, setHasArrived] = useState(false);
  
  const floatVariants = {
    initial: { 
      y: -300, 
      scale: 0.5,
      opacity: 0,
      rotate: -5
    },
    animate: {
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        y: { duration: 2, ease: "easeOut" },
        scale: { duration: 1.5, ease: "easeOut" },
        opacity: { duration: 1 }
      }
    },
    floating: {
      y: [0, -20, 0],
      rotate: [-3, 3, -3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate={hasArrived ? "floating" : "animate"}
      onAnimationComplete={() => setHasArrived(true)}
      variants={floatVariants}
      className="cursor-pointer"
    >
      <GiftBox {...props} />
    </motion.div>
  );
}


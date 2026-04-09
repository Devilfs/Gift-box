'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftItem, GiftItemType } from '@/types';
import { getThemeColors } from '@/lib/utils';
import Image from 'next/image';

interface GiftItemCardProps {
  item: GiftItem;
  theme: string;
  index: number;
  isRevealed: boolean;
}

const itemTypeIcons: Record<GiftItemType, string> = {
  message: '💬',
  image: '📸',
  video: '🎬',
  voice: '🎤',
  coupon: '🎟️',
};

const itemTypeLabels: Record<GiftItemType, string> = {
  message: 'Message',
  image: 'Photo',
  video: 'Video',
  voice: 'Voice Note',
  coupon: 'Coupon',
};

// Card flip animation component
function FlipCard({ item, theme, isRevealed }: { item: GiftItem; theme: string; isRevealed: boolean }) {
  const colors = getThemeColors(theme);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-48 cursor-pointer perspective-1000"
      onClick={() => !isFlipped && setIsFlipped(true)}
      initial={{ y: 50, opacity: 0 }}
      animate={isRevealed ? { y: 0, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        initial={{ rotateY: 0 }}
        animate={isFlipped ? { rotateY: 180 } : {}}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: 'white',
            border: `2px solid ${colors.primary}30`,
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="text-4xl mb-4">{itemTypeIcons[item.type as GiftItemType]}</div>
          <p className="text-lg font-medium" style={{ color: colors.primary }}>
            {itemTypeLabels[item.type as GiftItemType]}
          </p>
          <p className="text-sm text-gray-400 mt-2">Click to reveal</p>
        </div>

        {/* Back of card - content */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: 'white',
            border: `2px solid ${colors.primary}`,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <p className="text-lg text-gray-700 text-center whitespace-pre-wrap">
            {item.content_text}
          </p>
          {item.caption && (
            <p className="text-sm text-gray-400 mt-2">{item.caption}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Polaroid photo animation
function PolaroidPhoto({ item, theme, isRevealed, index }: { item: GiftItem; theme: string; isRevealed: boolean; index: number }) {
  const colors = getThemeColors(theme);
  const rotation = (index % 5 - 2) * 5; // -10 to 10 degrees

  return (
    <motion.div
      className="relative"
      initial={{ y: -100, opacity: 0, rotate: rotation - 15 }}
      animate={isRevealed ? { y: 0, opacity: 1, rotate: rotation } : {}}
      transition={{ 
        type: 'spring', 
        stiffness: 80, 
        damping: 12,
        delay: index * 0.1
      }}
    >
      <div 
        className="bg-white p-3 pb-8 rounded-sm shadow-lg"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {item.media_url && (
          <div className="relative w-40 h-40 overflow-hidden rounded-sm">
            <Image
              src={item.media_url}
              alt={item.caption || 'Gift photo'}
              fill
              className="object-cover"
            />
          </div>
        )}
        {item.caption && (
          <p className="text-center text-sm text-gray-500 mt-2 font-handwritten">
            {item.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Video card with play animation
function VideoCard({ item, theme, isRevealed, index }: { item: GiftItem; theme: string; isRevealed: boolean; index: number }) {
  const colors = getThemeColors(theme);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-gray-900"
      initial={{ y: 50, opacity: 0, scale: 0.8 }}
      animate={isRevealed ? { y: 0, opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: index * 0.1 }}
    >
      {item.media_url ? (
        <div className="relative aspect-video">
          <video
            src={item.media_url}
            className="w-full h-full object-cover"
            controls={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <motion.button
              className="absolute inset-0 flex items-center justify-center bg-black/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </motion.button>
          )}
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center">
          <span className="text-4xl">🎬</span>
        </div>
      )}
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-sm">{item.caption}</p>
        </div>
      )}
    </motion.div>
  );
}

// Voice note bubble animation
function VoiceNoteCard({ item, theme, isRevealed, index }: { item: GiftItem; theme: string; isRevealed: boolean; index: number }) {
  const colors = getThemeColors(theme);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ y: 50, opacity: 0, scale: 0.5 }}
      animate={isRevealed ? { y: 0, opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: index * 0.1 }}
    >
      <div 
        className="rounded-2xl p-4"
        style={{ 
          backgroundColor: colors.primary + '20',
          border: `2px solid ${colors.primary}40`
        }}
      >
        <div className="flex items-center gap-4">
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </motion.button>
          
          <div className="flex-1">
            {/* Waveform visualization */}
            <div className="flex items-center gap-1 h-8">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ 
                    backgroundColor: isPlaying ? colors.primary : colors.primary + '60',
                    height: isPlaying ? `${Math.random() * 100}%` : '30%'
                  }}
                  animate={isPlaying ? {
                    height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`]
                  } : {}}
                  transition={{
                    duration: 0.3,
                    repeat: isPlaying ? Infinity : 0,
                    repeatType: 'reverse'
                  }}
                />
              ))}
            </div>
            {item.caption && (
              <p className="text-sm text-gray-500 mt-1">{item.caption}</p>
            )}
          </div>
        </div>
        
        {item.content_text && (
          <p className="text-sm text-gray-600 mt-3">{item.content_text}</p>
        )}
      </div>
    </motion.div>
  );
}

// Coupon card
function CouponCard({ item, theme, isRevealed, index }: { item: GiftItem; theme: string; isRevealed: boolean; index: number }) {
  const colors = getThemeColors(theme);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ y: 50, opacity: 0 }}
      animate={isRevealed ? { y: 0, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 15, delay: index * 0.1 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="relative bg-gradient-to-br rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        {/* Dotted border pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '8px 8px'
          }}/>
        </div>
        
        <div className="relative p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">🎟️</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">COUPON</span>
          </div>
          
          <h3 className="text-xl font-bold mb-2">
            {item.content_text || 'Special Offer!'}
          </h3>
          
          {item.caption && (
            <p className="text-white/80 text-sm">{item.caption}</p>
          )}
          
          <motion.div
            className="mt-4 text-center text-sm text-white/60"
            animate={{ opacity: isFlipped ? 0 : 1 }}
          >
            Tap to reveal details
          </motion.div>
          
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-white/10 rounded-lg"
            >
              <p className="text-sm text-white/90">
                Use this coupon at checkout. Valid for 30 days from receipt.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-cream rounded-full" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-cream rounded-full" />
      </div>
    </motion.div>
  );
}

export function GiftItemCard({ item, theme, index, isRevealed }: GiftItemCardProps) {
  // Staggered entrance animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  switch (item.type) {
    case 'message':
      return <FlipCard item={item} theme={theme} isRevealed={isRevealed} />;
    
    case 'image':
      return <PolaroidPhoto item={item} theme={theme} isRevealed={isRevealed} index={index} />;
    
    case 'video':
      return <VideoCard item={item} theme={theme} isRevealed={isRevealed} index={index} />;
    
    case 'voice':
      return <VoiceNoteCard item={item} theme={theme} isRevealed={isRevealed} index={index} />;
    
    case 'coupon':
      return <CouponCard item={item} theme={theme} isRevealed={isRevealed} index={index} />;
    
    default:
      return null;
  }
}


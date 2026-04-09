'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { GiftBox } from '@/components/GiftBox';
import { GiftItemCard } from '@/components/GiftItemCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import { PasswordModal } from '@/components/PasswordModal';
import { GiftTheme, GiftItem, GiftWithItems } from '@/types';
import { getThemeColors } from '@/lib/utils';

// Dynamic import for Confetti to avoid SSR issues
const Confetti = dynamic(() => import('@/components/Confetti').then(mod => mod.default), {
  ssr: false,
});

// Floating ambient particles component
function AmbientParticles({ theme }: { theme: string }) {
  const colors = getThemeColors(theme);
  const particles = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            backgroundColor: i % 3 === 0 ? colors.accent : colors.primary,
            opacity: Math.random() * 0.4 + 0.2,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0.2, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Floating hearts on tap
function FloatingHeart({ x, color }: { x: number; color: string }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      style={{ left: `${x}%`, bottom: '20%' }}
      initial={{ y: 0, opacity: 1, scale: 0.5 }}
      animate={{
        y: -200,
        opacity: 0,
        scale: [0.5, 1.2, 1.5],
        x: (Math.random() - 0.5) * 50,
      }}
      transition={{ duration: 2, ease: 'easeOut' }}
      style={{ color }}
    >
      ❤️
    </motion.div>
  );
}

// Screen flash effect
function ScreenFlash({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 bg-white z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
}

export default function GiftPage({ params }: { params: { id: string } }) {
  const [gift, setGift] = useState<GiftWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedItems, setRevealedItems] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; color: string }[]>([]);
  const [screenFlash, setScreenFlash] = useState(false);
  const [canReplay, setCanReplay] = useState(false);

  const theme = (gift?.theme || 'birthday') as GiftTheme;
  const colors = getThemeColors(theme);

  // Fetch gift data
  useEffect(() => {
    async function fetchGift() {
      try {
        const response = await fetch(`/api/gifts/${params.id}`);
        if (!response.ok) {
          throw new Error('Gift not found');
        }
        const data = await response.json();
        setGift(data);

        // Check if password protected
        if (data.password_hash) {
          setNeedsPassword(true);
        } else {
          setIsUnlocked(true);
        }
      } catch (err) {
        setError('Gift not found or has expired');
      } finally {
        setLoading(false);
      }
    }
    fetchGift();
  }, [params.id]);

  // Handle password success
  const handlePasswordSuccess = useCallback(() => {
    setNeedsPassword(false);
    setIsUnlocked(true);
  }, []);

  // Sequential item reveal
  useEffect(() => {
    if (isOpen && gift?.items && revealedItems.length < gift.items.length) {
      const timer = setTimeout(() => {
        setRevealedItems(prev => [...prev, prev.length]);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Trigger confetti on final item
    if (gift?.items && revealedItems.length === gift.items.length - 1) {
      setTimeout(() => {
        setShowConfetti(true);
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), 500);
      }, 1000);
    }

    // Enable replay after all items revealed
    if (gift?.items && revealedItems.length === gift.items.length) {
      setTimeout(() => setCanReplay(true), 2000);
    }
  }, [isOpen, gift?.items, revealedItems.length]);

  // Handle gift opening
  const handleOpenGift = useCallback(() => {
    if (isAnimating || !isUnlocked) return;

    // Start shake animation
    setIsShaking(true);
    setIsAnimating(true);

    // Shake for 0.5s, then open
    setTimeout(() => {
      setIsShaking(false);
      setIsOpen(true);
    }, 500);
  }, [isAnimating, isUnlocked]);

  // Handle tap for floating hearts
  const handleTap = useCallback(() => {
    if (!isOpen) return;
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      color: colors.primary,
    };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  }, [isOpen, colors.primary]);

  // Handle replay
  const handleReplay = useCallback(() => {
    setIsOpen(false);
    setRevealedItems([]);
    setShowConfetti(false);
    setCanReplay(false);
    setIsAnimating(false);
    setTimeout(() => {
      handleOpenGift();
    }, 500);
  }, [handleOpenGift]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: gift ? undefined : 'linear-gradient(135deg, #FFE4EC 0%, #FFF0E6 100%)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-pink border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFE4EC 0%, #FFF0E6 100%)' }}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Gift Not Found</h1>
          <p className="text-gray-500">This gift may have expired or never existed.</p>
        </div>
      </div>
    );
  }

  const sortedItems = [...gift.items].sort((a, b) => a.position - b.position);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
      }}
      onClick={handleTap}
    >
      <AmbientParticles theme={theme} />
      <ScreenFlash trigger={screenFlash} />

      {/* Floating hearts */}
      {hearts.map(heart => (
        <FloatingHeart key={heart.id} x={heart.x} color={heart.color} />
      ))}

      {/* Confetti */}
      {showConfetti && <Confetti theme={theme} />}

      {/* Password modal */}
      {needsPassword && (
        <PasswordModal
          giftId={gift.id}
          onSuccess={handlePasswordSuccess}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.primary }}>
            {gift.title}
          </h1>
          <p className="text-gray-600 mt-2">
            From <span className="font-semibold">{gift.sender_name}</span> to{' '}
            <span className="font-semibold">{gift.receiver_name}</span>
          </p>
        </motion.div>

        {/* Countdown or Locked state */}
        {gift.unlock_date && new Date(gift.unlock_date) > new Date() && !isUnlocked ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">This gift is special!</h2>
            <p className="text-gray-500 mb-6">Your gift will be revealed on:</p>
            <CountdownTimer targetDate={gift.unlock_date} />
          </div>
        ) : !needsPassword ? (
          <>
            {/* Gift Box Area */}
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                initial={{ y: -100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="cursor-pointer"
              >
                <GiftBox
                  theme={theme}
                  isOpen={isOpen}
                  onOpen={handleOpenGift}
                  size="lg"
                  isShaking={isShaking}
                />
              </motion.div>

              {/* Open button or status */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-center"
              >
                {!isOpen ? (
                  <motion.button
                    onClick={handleOpenGift}
                    disabled={isAnimating || !isUnlocked}
                    className="px-8 py-3 rounded-full font-semibold text-white text-lg shadow-lg"
                    style={{ backgroundColor: colors.primary }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                  >
                    {isAnimating ? 'Opening...' : 'Open Gift'}
                  </motion.button>
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-600"
                  >
                    Tap anywhere to send ❤️
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Gift Items Grid */}
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                {/* Celebration header */}
                <AnimatePresence>
                  {revealedItems.length === gift.items.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center mb-8"
                    >
                      <h2 
                        className="text-3xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        🎉 You received a gift! 🎉
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {gift.message || 'Enjoy your special gift!'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Items grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <AnimatePresence mode="popLayout">
                    {sortedItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                          opacity: revealedItems.includes(index) ? 1 : 0,
                          scale: revealedItems.includes(index) ? 1 : 0.5,
                          y: revealedItems.includes(index) ? 0 : 50
                        }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                          delay: revealedItems.includes(index) ? 0 : 0
                        }}
                      >
                        <GiftItemCard
                          item={item}
                          theme={theme}
                          index={index}
                          isRevealed={revealedItems.includes(index)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Replay button */}
                {canReplay && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-12"
                  >
                    <motion.button
                      onClick={handleReplay}
                      className="px-6 py-2 rounded-full font-medium text-white"
                      style={{ backgroundColor: colors.secondary }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Open Again 🔄
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}


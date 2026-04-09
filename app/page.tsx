'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GiftBox } from '@/components/GiftBox';
import { THEMES, GiftTheme } from '@/types';

const features = [
  {
    icon: '💬',
    title: 'Add Messages',
    description: 'Write heartfelt messages that will be revealed one by one',
  },
  {
    icon: '📸',
    title: 'Upload Photos',
    description: 'Add precious memories as polaroid-style photos',
  },
  {
    icon: '🎤',
    title: 'Voice Notes',
    description: 'Record personal voice messages for a personal touch',
  },
  {
    icon: '🎟️',
    title: 'Send Coupons',
    description: 'Include gift cards and special offers',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-pink border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #FF6B9D 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #B794F6 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? '#FF6B9D' : '#F6AD55',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl">🎁</span>
className="text-xl font-bold font-poppins"GiftBox
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/create')}
            className="px-6 py-2 rounded-full font-medium text-white bg-primary-pink hover:bg-primary-pink/90 transition-colors"
          >
            Create Gift
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold font-display leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create a{' '}
              <span className="gradient-text">Digital Gift Box</span>
            </motion.h1>
            
            <motion.p
              className="mt-6 text-lg text-gray-600 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Send unforgettable digital gifts with messages, photos, videos, voice notes, and coupons. 
              Watch your loved ones experience the joy of unwrapping!
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => router.push('/create')}
                className="px-8 py-4 rounded-full font-semibold text-white text-lg shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8A80 100%)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 107, 157, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Create Gift 🎁
              </motion.button>
              
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-semibold text-primary-pink border-2 border-primary-pink hover:bg-primary-pink/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: Animated Gift Box */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <GiftBox theme="birthday" size="lg" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              What You Can Include
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Create a truly personalized gift experience with multiple content types
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Preview */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              Beautiful Themes
            </h2>
            <p className="mt-4 text-gray-600">
              Choose from a variety of themes to match your occasion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {THEMES.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
                onClick={() => router.push('/create')}
                style={{
                  background: theme.background,
                }}
              >
                <div className="flex items-center justify-center mb-4">
                  <GiftBox theme={theme.id} size="sm" />
                </div>
                <h3 className="text-center font-semibold" style={{ color: theme.primaryColor }}>
                  {theme.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-pink to-primary-coral rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Surprise Someone?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Create a beautiful digital gift box in just a few minutes. 
              It&apos;s free and takes less than 5 minutes!
            </p>
            <motion.button
              onClick={() => router.push('/create')}
              className="px-10 py-4 rounded-full font-semibold text-lg bg-white text-primary-pink shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating 🎁
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <span className="font-semibold">Digital Gift Box</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Digital Gift Box. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


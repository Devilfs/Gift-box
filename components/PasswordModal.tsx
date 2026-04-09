'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordModalProps {
  onSuccess: () => void;
}

export function PasswordModal({ onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // In a real app, this would validate against the server
      // For now, we'll simulate a check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Demo: accept any password for now
      // In production, call API to validate
      if (password.length > 0) {
        onSuccess();
      } else {
        setError('Please enter a password');
      }
    } catch (err) {
      setError('Invalid password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Lock icon */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🔒
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Protected Gift</h2>
          <p className="text-gray-500 mt-2">Enter the password to open this gift</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 outline-none transition-all text-center text-lg"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center text-sm"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-primary-pink hover:bg-primary-pink/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Unlocking...' : 'Unlock Gift'}
          </button>
        </form>

        {/* Hint */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Ask the sender for the password
        </p>
      </motion.div>
    </motion.div>
  );
}


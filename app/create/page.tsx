'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GiftBox } from '@/components/GiftBox';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ItemUploader } from '@/components/ItemUploader';
import { ProgressSteps } from '@/components/ProgressSteps';
import { GiftTheme, CreateGiftItemInput, THEMES } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type Step = 'theme' | 'details' | 'items' | 'preview' | 'share';

interface GiftFormData {
  theme: GiftTheme;
  title: string;
  senderName: string;
  receiverName: string;
  message: string;
  password: string;
  unlockDate: string;
  items: CreateGiftItemInput[];
}

const initialFormData: GiftFormData = {
  theme: 'birthday',
  title: '',
  senderName: '',
  receiverName: '',
  message: '',
  password: '',
  unlockDate: '',
  items: [],
};

const steps: { id: Step; label: string }[] = [
  { id: 'theme', label: 'Theme' },
  { id: 'details', label: 'Details' },
  { id: 'items', label: 'Items' },
  { id: 'preview', label: 'Preview' },
  { id: 'share', label: 'Share' },
];

export default function CreateGiftPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('theme');
  const [formData, setFormData] = useState<GiftFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const updateFormData = (updates: Partial<GiftFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].id as Step);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].id as Step);
    }
  };

  const handleAddItem = (item: CreateGiftItemInput) => {
    updateFormData({
      items: [...formData.items, { ...item, position: formData.items.length }],
    });
  };

  const handleRemoveItem = (index: number) => {
    updateFormData({
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          sender_name: formData.senderName,
          receiver_name: formData.receiverName,
          message: formData.message || null,
          theme: formData.theme,
          password: formData.password || null,
          unlock_date: formData.unlockDate || null,
          items: formData.items.map((item, index) => ({
            ...item,
            position: index,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to create gift');

      const data = await response.json();
      const url = `${window.location.origin}/gift/${data.id}`;
      setShareUrl(url);
      setStep('share');
    } catch (error) {
      console.error('Error creating gift:', error);
      alert('Failed to create gift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    // Better UX: use toast instead of alert in production
  };

  const canProceed = () => {
    if (step === 'theme') return !!formData.theme;
    if (step === 'details') return formData.title && formData.senderName && formData.receiverName;
    if (step === 'items') return formData.items.length > 0;
    return true;
  };

  const theme = THEMES.find(t => t.id === formData.theme);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
className="min-h-screen bg-gradient-to-br from-cream via-softPink/50 to-lavender font-[var(--font-inter)]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <motion.button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-pink font-medium transition-colors p-2 -m-2 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Home
            </motion.button>
            <h1 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Create Gift
            </h1>
            <div className="w-16" />
          </div>
          <ProgressSteps steps={steps} currentStep={currentStepIndex} />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={itemVariants}>
          {/* Step 1: Theme Selection */}
          {step === 'theme' && (
            <motion.section className="text-center">
              <motion.h2 
                className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-gray-900 via-primary-pink to-primary-coral bg-clip-text text-transparent mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Choose a Theme
              </motion.h2>
              <ThemeSelector 
                selected={formData.theme} 
                onSelect={(theme) => updateFormData({ theme })}
              />
            </motion.section>
          )}

          {/* Step 2: Gift Details */}
          {step === 'details' && (
            <motion.section className="space-y-6">
              <motion.h2 
                className="text-4xl md:text-5xl font-display font-bold text-center text-gray-900 mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Gift Details
              </motion.h2>
              
              <motion.div className="grid gap-6" variants={itemVariants}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gift Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="e.g., Happy Birthday, My Love!"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sender Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.senderName}
                      onChange={(e) => updateFormData({ senderName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Receiver Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.receiverName}
                      onChange={(e) => updateFormData({ receiverName: e.target.value })}
                      placeholder="Their name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Greeting Message (optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateFormData({ message: e.target.value })}
                    placeholder="Write a sweet greeting message..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-pink focus:border-transparent resize-none text-lg leading-relaxed"
                  />
                </div>

                {/* Optional Features */}
                <motion.div 
                  className="bg-gray-50/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-primary-pink">✨</span>
                    Optional Features
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Password */}
                    <label className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/50 transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={!!formData.password} 
                        onChange={(e) => updateFormData({ password: e.target.checked ? formData.password : '' })}
                        className="w-5 h-5 mt-0.5 text-primary-pink rounded focus:ring-primary-pink mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Password protect this gift</span>
                        {formData.password !== undefined && formData.password !== '' && (
                          <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateFormData({ password: e.target.value })}
                            placeholder="Enter password"
                            className="mt-2 !p-3 text-lg"
                          />
                        )}
                      </div>
                    </label>

                    {/* Unlock Date */}
                    <label className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/50 transition-colors cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={!!formData.unlockDate} 
                        onChange={(e) => updateFormData({ unlockDate: e.target.checked ? formData.unlockDate : '' })}
                        className="w-5 h-5 mt-0.5 text-primary-pink rounded focus:ring-primary-pink mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Schedule to open later</span>
                        {formData.unlockDate !== undefined && formData.unlockDate !== '' && (
                          <Input
                            type="datetime-local"
                            value={formData.unlockDate}
                            onChange={(e) => updateFormData({ unlockDate: e.target.value })}
                            className="mt-2 !p-3 text-lg"
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </motion.div>
              </motion.div>
            </motion.section>
          )}

          {/* Step 3: Add Items */}
          {step === 'items' && (
            <motion.section className="text-center">
              <motion.h2 
                className="text-4xl md:text-5xl font-display font-bold text-center text-gray-900 mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Add Gift Items
              </motion.h2>
              <ItemUploader 
                items={formData.items} 
                onAdd={handleAddItem} 
                onRemove={handleRemoveItem} 
              />
            </motion.section>
          )}

          {/* Step 4: Preview */}
          {step === 'preview' && (
            <motion.section>
              <motion.h2 
                className="text-4xl md:text-5xl font-display font-bold text-center text-gray-900 mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Preview Your Gift
              </motion.h2>
              
              <motion.div 
                className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 max-w-4xl mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-center mb-12">
                  <h3 className={cn(
                    "text-3xl md:text-4xl font-display font-bold mb-4",
                    theme ? "text-[theme.primaryColor]" : "text-primary-pink"
                  )}>
                    {formData.title || 'Your Gift'}
                  </h3>
                  <p className="text-xl text-gray-600">
                    From {formData.senderName || 'You'} to {formData.receiverName || 'Someone Special'}
                  </p>
                </div>

                <div className="flex justify-center p-12">
                  <GiftBox theme={formData.theme} size="lg" />
                </div>

                <div className="text-center mt-12">
                  <p className="text-2xl font-semibold text-gray-700">
                    {formData.items.length} item{formData.items.length !== 1 ? 's' : ''} ready to surprise!
                  </p>
                </div>
              </motion.div>
            </motion.section>
          )}

          {/* Step 5: Share */}
          {step === 'share' && (
            <motion.section className="text-center py-12">
              <motion.div 
                className="text-6xl mb-8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                🎉
              </motion.div>
              <motion.h2 
                className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Gift Created!
              </motion.h2>
              <p className="text-xl text-gray-600 mb-12 max-w-md mx-auto">
                Your magical gift box is ready to share!
              </p>

              <motion.div 
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 max-w-md mx-auto mb-8 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gift Link
                </label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-white"
                  />
                  <Button onClick={copyToClipboard} className="!px-6">
                    Copy
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  size="lg"
                  onClick={() => router.push(shareUrl)}
                  className="text-xl px-12 py-6"
                >
                  👀 View Your Gift
                </Button>
              </motion.div>
            </motion.section>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        {step !== 'share' && (
          <motion.div 
            className="flex justify-center gap-4 mt-20 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={cn(
                "px-8 py-4 text-lg font-semibold h-auto flex-1",
                currentStepIndex === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              Back
            </Button>

            <Button
              onClick={step === 'preview' ? handleSubmit : nextStep}
              disabled={!canProceed() || isLoading}
              className={cn(
                "px-8 py-4 text-lg font-semibold h-auto flex-1 bg-gradient-to-r from-primary-pink to-primary-coral shadow-lg hover:shadow-xl text-xl",
                (!canProceed() || isLoading) && "opacity-50 cursor-not-allowed"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Creating... 
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </span>
              ) : step === 'preview' ? (
                '🎁 Create & Share'
              ) : (
                'Continue →'
              )}
            </Button>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}

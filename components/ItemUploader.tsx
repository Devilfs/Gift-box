'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateGiftItemInput, GiftItemType } from '@/types';
import { getThemeColors } from '@/lib/utils';

const itemTypes: { type: GiftItemType; icon: string; label: string; color: string }[] = [
  { type: 'message', icon: '💬', label: 'Message', color: '#FF6B9D' },
  { type: 'image', icon: '📸', label: 'Photo', color: '#68D391' },
  { type: 'video', icon: '🎬', label: 'Video', color: '#4299E1' },
  { type: 'voice', icon: '🎤', label: 'Voice', color: '#9F7AEA' },
  { type: 'coupon', icon: '🎟️', label: 'Coupon', color: '#F6AD55' },
];

interface ItemUploaderProps {
  items: CreateGiftItemInput[];
  onAdd: (item: CreateGiftItemInput) => void;
  onRemove: (index: number) => void;
}

export function ItemUploader({ items, onAdd, onRemove }: ItemUploaderProps) {
  const [selectedType, setSelectedType] = useState<GiftItemType | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAddMessage = (text: string) => {
    if (!text.trim()) return;
    onAdd({
      type: 'message',
      content_text: text,
      position: items.length,
    });
    setSelectedType(null);
  };

  const handleAddCoupon = (title: string, description: string) => {
    if (!title.trim()) return;
    onAdd({
      type: 'coupon',
      content_text: title,
      caption: description,
      position: items.length,
    });
    setSelectedType(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // In production, upload to Cloudinary here
    // For now, create a local URL
    const url = URL.createObjectURL(file);

    onAdd({
      type,
      media_url: url,
      position: items.length,
    });
    setSelectedType(null);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onAdd({
          type: 'voice',
          media_url: url,
          position: items.length,
        });
        setSelectedType(null);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Item Type Selector */}
      {selectedType === null ? (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {itemTypes.map((item) => (
            <motion.button
              key={item.type}
              onClick={() => setSelectedType(item.type)}
              className="p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-colors flex flex-col items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">
              Add {itemTypes.find(i => i.type === selectedType)?.label}
            </h3>
            <button
              onClick={() => setSelectedType(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Message Input */}
          {selectedType === 'message' && (
            <MessageForm onAdd={handleAddMessage} />
          )}

          {/* Image Upload */}
          {selectedType === 'image' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'image')}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-pink hover:bg-pink-50 transition-colors"
              >
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500">Click to upload photo</p>
              </button>
            </div>
          )}

          {/* Video Upload */}
          {selectedType === 'video' && (
            <div className="space-y-4">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileSelect(e, 'video')}
                className="hidden"
              />
              <button
                onClick={() => videoInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-gray-500">Click to upload video (max 30s)</p>
              </button>
            </div>
          )}

          {/* Voice Recording */}
          {selectedType === 'voice' && (
            <div className="text-center py-4">
              <motion.button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
                  isRecording ? 'bg-red-500' : 'bg-purple-500'
                } text-white`}
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isRecording ? '⏹️' : '🎤'}
              </motion.button>
              <p className="mt-4 text-gray-500">
                {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
              </p>
            </div>
          )}

          {/* Coupon Form */}
          {selectedType === 'coupon' && (
            <CouponForm onAdd={handleAddCoupon} />
          )}
        </div>
      )}

      {/* Added Items List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            Items in your gift ({items.length})
          </h3>
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100"
              >
                <span className="text-2xl">
                  {itemTypes.find(t => t.type === item.type)?.icon}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">
                    {item.content_text || item.media_url ? 'Media file' : item.type}
                  </p>
                  {item.caption && (
                    <p className="text-sm text-gray-400">{item.caption}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-400 hover:text-red-600"
                >
                  🗑️
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Sub-components
function MessageForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('');

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your message..."
        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 outline-none resize-none"
        rows={4}
      />
      <button
        onClick={() => onAdd(text)}
        disabled={!text.trim()}
        className="w-full py-3 bg-primary-pink text-white rounded-xl font-medium hover:bg-primary-pink/90 disabled:opacity-50"
      >
        Add Message
      </button>
    </div>
  );
}

function CouponForm({ onAdd }: { onAdd: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Coupon title (e.g., Free Dinner)"
        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 outline-none resize-none"
        rows={2}
      />
      <button
        onClick={() => onAdd(title, description)}
        disabled={!title.trim()}
        className="w-full py-3 bg-primary-pink text-white rounded-xl font-medium hover:bg-primary-pink/90 disabled:opacity-50"
      >
        Add Coupon
      </button>
    </div>
  );
}


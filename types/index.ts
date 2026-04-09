

// Prisma generates types automatically. Custom types kept for client compatibility.
// Field names updated to match Prisma schema (camelCase)

export type GiftTheme = 'birthday' | 'love' | 'friendship' | 'celebration';
export type GiftItemType = 'message' | 'image' | 'video' | 'voice' | 'coupon';

export interface Theme {
  id: GiftTheme;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  icon: string;
  background?: string;
  accent?: string;
}

export const THEMES: Theme[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    primaryColor: '#ec4899',
    secondaryColor: '#fce7f3',
    backgroundColor: '#fff1f2',
    icon: '🎂',
    background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    accent: '#f472b6',
  },
  {
    id: 'love',
    name: 'Love',
    primaryColor: '#ef4444',
    secondaryColor: '#fee2e2',
    backgroundColor: '#fef2f2',
    icon: '❤️',
    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    accent: '#f87171',
  },
  {
    id: 'friendship',
    name: 'Friendship',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ede9fe',
    backgroundColor: '#f5f3ff',
    icon: '🌟',
    background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accent: '#a78bfa',
  },
  {
    id: 'celebration',
    name: 'Celebration',
    primaryColor: '#f59e0b',
    secondaryColor: '#fef3c7',
    backgroundColor: '#fffbeb',
    icon: '🎉',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    accent: '#fbbf24',
  },
];

export type CreateGiftInput = {
  title: string;
  sender_name: string;
  receiver_name: string;
  message?: string | null;
  theme: GiftTheme;
  password?: string | null;
  unlock_date?: string | null;
  items: CreateGiftItemInput[];
};

export type CreateGiftItemInput = {
  type: GiftItemType;
  content_text?: string | null;
  media_url?: string | null;
  caption?: string | null;
  position?: number;
};

// Prisma type aliases (compatible with generated types)
export type Gift = {
  id: string;
  title: string;
  senderName: string;
  receiverName: string;
  message: string | null;
  theme: GiftTheme;
  passwordHash: string | null;
  unlockDate: string | null;
  isOpened: boolean;
  createdAt: string;
  updatedAt: string;
  items?: GiftItem[];
};

export type GiftItem = {
  id: string;
  giftId: string;
  type: GiftItemType;
  contentText: string | null;
  mediaUrl: string | null;
  caption: string | null;
  position: number;
  createdAt: string;
};

export type GiftWithItems = Gift & {
  items: GiftItem[];
};



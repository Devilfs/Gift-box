# Digital Gift Box Generator 🎁

A modern full-stack web application for creating and sharing personalized digital gift boxes with interactive reveal animations.

![Digital Gift Box](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)

## ✨ Features

- 🎨 **4 Beautiful Themes**: Birthday, Love, Friendship, Celebration
- 💬 **Multiple Content Types**: Messages, Photos, Videos, Voice Notes, Coupons
- 🎬 **Interactive Animations**:
  - Floating gift arrival
  - Shake-to-open interaction
  - Ribbon untying animation
  - Magic glow reveal
  - Sequential item reveals
  - Card flip animations
  - Polaroid photo drops
  - Voice note waveforms
  - Confetti celebrations
  - Floating heart reactions
  - Replay functionality
- 🔒 **Password Protection**: Secure gifts with passwords
- ⏰ **Timed Gifts**: Schedule later gifts to unlock
- 📱 **Mobile Responsive**: Works on all devices
- 🔗 **Easy Sharing**: Copy link, WhatsApp, Email

## 🚀 Quick Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account (free)
- Cloudinary account (free)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Set up database:**
   
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Copy the SQL from `supabase/schema.sql`
   - Run it in the Supabase SQL Editor

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   
   Visit http://localhost:3000

## 📁 Project Structure

```
gift_box/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/page.tsx      # Gift creation wizard
│   ├── gift/[id]/page.tsx   # Gift opening experience
│   └── api/                  # API routes
├── components/
│   ├── GiftBox.tsx          # Animated gift box
│   ├── GiftItemCard.tsx    # Item display cards
│   ├── ThemeSelector.tsx   # Theme picker
│   ├── ItemUploader.tsx    # Media upload
│   ├── Confetti.tsx        # Celebration
│   └── ...
├── lib/
│   ├── supabase.ts         # Database client
│   └── utils.ts            # Utilities
├── types/                   # TypeScript types
└── supabase/schema.sql      # Database schema
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary
- **Language**: TypeScript

## 📝 Usage

### Creating a Gift

1. Click "Create Gift" on the landing page
2. Choose a theme (Birthday, Love, Friendship, Celebration)
3. Enter gift details (title, sender, receiver)
4. Add items (messages, photos, videos, voice notes, coupons)
5. Preview your gift
6. Share the unique link!

### Opening a Gift

1. Open the gift link
2. Watch the floating gift animation
3. Click "Open Gift" to start
4. Experience the shake, ribbon, and glow animations
5. Watch items reveal one by one
6. Enjoy confetti on the final item!
7. Tap anywhere to send hearts ❤️

## 🔐 Security

- Passwords are hashed using bcrypt
- Row Level Security (RLS) on Supabase
- Input sanitization
- File type validation

## 📄 License

MIT License - feel free to use this project!

---

Made with ❤️ using Next.js, Supabase, and Framer Motion


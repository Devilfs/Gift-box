# Digital Gift Box Generator - Specification Document

## Project Overview

**Project Name:** Digital Gift Box Generator  
**Type:** Full-stack Web Application  
**Core Functionality:** A web app allowing users to create personalized digital gift boxes containing messages, images, videos, voice notes, and coupons. Recipients open the gift via a unique link and reveal items one by one with playful animations.  
**Target Users:** Anyone wanting to send a memorable digital gift (birthdays, anniversaries, celebrations, special occasions)

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Media Storage:** Cloudinary
- **Utilities:** UUID for unique links

---

## UI/UX Specification

### Design Philosophy
- **Feel:** Playful, emotional, modern, interactive
- **Theme:** Soft pastels, rounded corners, gentle shadows, magical moments
- **Animations:** Smooth, delightful, surprise-and-delight elements

### Color Palette

#### Base Colors
```css
--bg-cream: #FDF8F3
--bg-soft-pink: #FFE4EC
--bg-lavender: #F0E6FF
--bg-mint: #E6FFF4
--bg-peach: #FFF0E6
```

#### Primary Colors
```css
--primary-pink: #FF6B9D
--primary-coral: #FF8A80
--primary-lavender: #B794F6
--primary-mint: #68D391
--primary-gold: #F6AD55
```

#### Accent Colors
```css
--accent-glow: #FFD93D
--accent-sparkle: #FF6B9D
```

#### Text Colors
```css
--text-primary: #2D3748
--text-secondary: #718096
--text-muted: #A0AEC0
```

### Typography

- **Headings:** "Poppins" (bold, playful)
- **Body:** "Inter" (clean, readable)
- **Accent:** "Caveat" (handwritten feel for personal messages)

### Spacing System
- Base unit: 4px
- Sections: 80px-120px vertical padding
- Cards: 24px-32px padding
- Components: 16px gap

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Theme Designs

### 1. Birthday Theme
- Colors: Pink (#FF6B9D), Gold (#F6AD55), White
- Background: Radial gradient pink to cream
- Gift Box: Colorful striped box with ribbon
- Animations: Confetti, balloons

### 2. Love Theme
- Colors: Red (#E53E3E), Pink (#FF6B9D), White
- Background: Soft pink gradient with hearts
- Gift Box: Red with heart decorations
- Animations: Heart particles, warm glow

### 3. Friendship Theme
- Colors: Blue (#4299E1), Yellow (#F6E05E), Green (#68D391)
- Background: Bright cheerful gradient
- Gift Box: Colorful with star decorations
- Animations: Stars, sparkle effects

### 4. Celebration Theme
- Colors: Gold (#F6AD55), Purple (#9F7AEA), White
- Background: Festive gradient
- Gift Box: Gold with sparkle effects
- Animations: Fireworks, golden particles

---

## Page Specifications

### 1. Landing Page (/)

#### Hero Section
- Full viewport height
- Animated gift box in center (3D-style gift box that gently bobs)
- Title: "Create a Digital Gift Box" - large, bold, with subtle entrance animation
- Subtitle: Emotional copy about making gifts memorable
- CTA Button: "Create Gift" - large, pill-shaped, gradient background, hover scale effect
- Floating decorative elements (stars, hearts, sparkles)

#### Features Section
- 4-column grid (2 on tablet, 1 on mobile)
- Feature cards with icons:
  - 💬 Add Messages - Personalized text
  - 📸 Upload Photos - From device
  - 🎤 Record Voice - Microphone recording
  - 🎟️ Send Coupons - Custom coupons
- Each card: Icon, title, description, subtle hover animation

#### Preview Section
- Interactive gift box showcase
- "See it in action" demo button
- Animated preview of item reveal

#### Footer
- Simple footer with copyright
- Social links (optional)

### 2. Create Gift Page (/create)

#### Multi-Step Form Structure
- Progress indicator (step dots or numbered)
- 5 steps total:
  1. Choose Theme
  2. Gift Details
  3. Add Items
  4. Preview
  5. Generate Link

#### Step 1: Choose Theme
- Theme cards (4 themes)
- Visual preview on selection
- Smooth transition when selected

#### Step 2: Gift Details
- Form fields:
  - Gift Title (text input)
  - Sender Name (text input)
  - Receiver Name (text input)
  - Greeting Message (textarea, optional)
- Optional features toggle:
  - Password Protection (checkbox + password field)
  - Unlock Date (date/time picker)

#### Step 3: Add Gift Items
- Item type selector (grid of icons)
- Add item form based on type:
  - Message: Textarea
  - Image: File upload + caption
  - Video: File upload (max 30s) + caption
  - Voice Note: Record button + playback
  - Coupon: Title + description + expiry
- Item list (draggable for reordering)
- Each item shows: type icon, preview, delete button
- Minimum 1 item required

#### Step 4: Preview Gift
- Full preview of gift opening experience
- Closed gift box with "Open Gift" button
- Animation of box opening
- Items reveal sequentially with animations

#### Step 5: Generate Link
- Unique URL generated
- Share options:
  - Copy Link button
  - WhatsApp share button
  - Email share button
- "Create Another Gift" button

### 3. Gift Opening Page (/gift/[id])

#### Initial State (Locked)
- Password protection screen if enabled
- Countdown timer if timed gift
- Gift box in center (closed)

#### Gift Opening Flow
1. Click "Open Gift" button
2. Box opening animation:
   - Lid lifts up
   - Glow effect from inside
   - Items start appearing
3. Items reveal one by one:
   - Each item fades in with scale
   - 0.5s delay between items
   - Staggered entrance animation
4. Final item triggers confetti celebration

#### Item Card Display
- Consistent card design
- Type indicator icon
- Content (text/image/video/audio player/coupon details)
- Subtle entrance animation

---

## Component Specifications

### GiftBox Component
- States: closed, opening, open
- 3D-style gift box with lid
- Theme-aware colors and decorations
- Animation: lid lift, glow effect, items float up

### GiftItemCard Component
- Props: type, content, mediaUrl, caption
- Different layouts per type
- Entrance animation (fade + scale)

### ItemUploader Component
- Image: Drag & drop zone, preview, crop option
- Video: Upload with progress, max 30s validation
- Audio: Record button, waveform visualization, playback

### ThemeSelector Component
- Visual theme cards
- Selected state indicator
- Preview update on selection

### CountdownTimer Component
- Days, hours, minutes, seconds
- Flip-clock or digital style
- Target date display

---

## Database Schema (Supabase)

### Table: gifts
```sql
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  message TEXT,
  theme VARCHAR(50) NOT NULL DEFAULT 'birthday',
  password_hash VARCHAR(255),
  unlock_date TIMESTAMP WITH TIME ZONE,
  is_opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Table: gift_items
```sql
CREATE TABLE gift_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('message', 'image', 'video', 'voice', 'coupon')),
  content_text TEXT,
  media_url TEXT,
  caption VARCHAR(255),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security
- Gifts: Owners can read/update their gifts
- Gift items: Anyone with gift link can read (if unlocked)

---

## API Routes / Server Actions

### Server Actions
- `createGift(giftData)` - Create new gift with items
- `getGift(giftId)` - Fetch gift by ID
- `validatePassword(giftId, password)` - Validate gift password
- `markGiftOpened(giftId)` - Mark gift as opened

### API Routes (if needed)
- `/api/gifts/[id]` - GET gift data
- `/api/upload` - Handle Cloudinary uploads

---

## Cloudinary Integration

### Upload Configuration
- Folder: "gift-box"
- Resource types: image, video, raw (audio)
- Transformations:
  - Images: auto quality, max width 1200px
  - Videos: max 30 seconds, auto quality
  - Audio: mp3 format

### Upload Types
1. **Image Upload**
   - Accept: jpg, png, gif, webp
   - Max size: 10MB

2. **Video Upload**
   - Accept: mp4, webm
   - Max size: 50MB
   - Max duration: 30 seconds

3. **Audio/Voice Upload**
   - Accept: mp3, wav, m4a
   - Max size: 10MB
   - Max duration: 60 seconds

---

## Security Considerations

1. **Input Validation**
   - Sanitize all user inputs
   - Validate file types and sizes
   - Limit text lengths

2. **Password Protection**
   - Hash passwords using bcrypt
   - Never store plain text passwords

3. **Access Control**
   - Verify gift ownership for edits
   - Validate unlock dates server-side

4. **File Upload Security**
   - Validate MIME types server-side
   - Scan for malicious content
   - Use signed URLs for media

---

## Animation Specifications

### Gift Box Opening
```javascript
// Lid animation
variants: {
  closed: { rotateX: 0, y: 0 },
  opening: { rotateX: -120, y: -20 },
  open: { rotateX: -120, y: -20, opacity: 0 }
}

// Glow effect
initial: { opacity: 0, scale: 0.5 }
animate: { opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }
```

### Item Reveal
```javascript
// Staggered entrance
transition: { 
  staggerChildren: 0.3,
  delayChildren: 0.5
}

// Individual item
variants: {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 }
}
```

### Confetti
- Trigger on final item reveal
- Use: canvas-confetti library
- Duration: 3 seconds
- Colors: Theme-appropriate

---

## File Structure

```
gift-box/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── create/
│   │   └── page.tsx             # Create gift page
│   ├── preview/
│   │   └── page.tsx             # Preview page
│   └── gift/
│       └── [id]/
│           └── page.tsx         # Gift opening page
├── components/
│   ├── GiftBox.tsx              # Animated gift box
│   ├── GiftItemCard.tsx         # Individual item card
│   ├── ItemUploader.tsx         # Media upload component
│   ├── ThemeSelector.tsx        # Theme selection
│   ├── CountdownTimer.tsx       # Timer component
│   ├── ProgressSteps.tsx       # Multi-step indicator
│   ├── Confetti.tsx             # Confetti celebration
│   ├── PasswordModal.tsx        # Password unlock
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── cloudinary.ts            # Cloudinary utilities
│   ├── actions.ts               # Server actions
│   └── utils.ts                 # Utility functions
├── types/
│   └── index.ts                 # TypeScript types
├── public/
│   └── ...                      # Static assets
├── package.json
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## Acceptance Criteria

### Must Have
- [ ] Landing page with hero, features, and preview
- [ ] Multi-step gift creation flow
- [ ] 4 theme options with visual differentiation
- [ ] Support for all 5 item types
- [ ] Media upload to Cloudinary
- [ ] Unique shareable link generation
- [ ] Gift opening animation
- [ ] Sequential item reveal with animations
- [ ] Confetti on final item
- [ ] Password protection
- [ ] Timed gift unlock
- [ ] Mobile responsive design
- [ ] Database schema implementation

### Nice to Have
- [ ] QR code generation
- [ ] Music/audio player
- [ ] AI message suggestions
- [ ] Gift delivery scheduling

---

## Implementation Priority

1. **Phase 1: Foundation**
   - Project setup
   - Database schema
   - Supabase connection

2. **Phase 2: Core Features**
   - Landing page
   - Create gift flow
   - Item management

3. **Phase 3: Opening Experience**
   - Gift opening page
   - Animations
   - Confetti

4. **Phase 4: Advanced Features**
   - Password protection
   - Timed unlock
   - Share options

5. **Phase 5: Polish**
   - Responsive design
   - Performance optimization
   - Edge cases


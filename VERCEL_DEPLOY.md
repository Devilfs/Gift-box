# Deploy to Vercel - Step by Step

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Your code pushed to GitHub, GitLab, or Bitbucket

## Step 1: Prepare for Deployment

### Update next.config.js for security
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent stealing your site content
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Disable external image optimization to prevent abuse
    unoptimized: false,
  },
  // Hide technical details
  poweredByHeader: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Step 2: Environment Variables

In Vercel, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (mark as sensitive)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key (mark as sensitive)
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret (mark as sensitive)

## Step 3: Deploy

### Option A: Via Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add environment variables
5. Click "Deploy"

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## Step 4: Secure Your Site

### 1. Disable Right-Click theft prevention
Add to your app/globals.css:
```css
/* Prevent right-click context menu */
body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Allow selection only on text content */
.allow-select {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
```

### 2. Add Anti-Theft Warning
Create a components/SecurityBanner.tsx:
```tsx
'use client';
import { useEffect } from 'react';

export function SecurityBanner() {
  useEffect(() => {
    // Disable keyboard shortcuts for view source
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')
      ) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return null;
}
```

## Step 5: Database Security (Supabase)

1. Go to your Supabase dashboard
2. Navigate to Settings → API
3. Enable Row Level Security (RLS) on all tables
4. Use anon key for public access, service role only for admin

## Step 6: Domain Security

If using a custom domain:
1. Enable SSL/HTTPS (automatic with Vercel)
2. Configure HSTS headers
3. Set up proper CORS policies

## Troubleshooting

### Common Issues
- **Build fails**: Check all environment variables are set
- **Images not loading**: Verify Cloudinary configuration
- **Database errors**: Check Supabase RLS policies

### Performance
- Enable Vercel Analytics for monitoring
- Use Edge functions for faster response


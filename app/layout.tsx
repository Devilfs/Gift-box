import type { Metadata } from 'next';
import './globals.css';
import { SecurityProtection } from '@/components/SecurityProtection';

export const metadata: Metadata = {
  title: 'Digital Gift Box Generator',
  description: 'Create and share personalized digital gift boxes with messages, photos, videos, voice notes, and coupons.',
  keywords: ['gift', 'digital gift', 'birthday gift', 'surprise', 'gift box'],
  authors: [{ name: 'Digital Gift Box' }],
  openGraph: {
    title: 'Digital Gift Box Generator',
    description: 'Create and share personalized digital gift boxes',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SecurityProtection />
        {children}
      </body>
    </html>
  );
}


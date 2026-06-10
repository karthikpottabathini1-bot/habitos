import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { HabitOSProvider } from '@/lib/habitos-context';
import FeedbackWidget from '@/components/feedback-widget';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HabitOS — Build Better Routines',
  description: 'Track your daily habits, build streaks, and improve your life one day at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="antialiased">
        <HabitOSProvider>
          {children}
          <FeedbackWidget />
        </HabitOSProvider>
      </body>
    </html>
  );
}

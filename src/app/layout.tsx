import type { Metadata } from 'next';
import { Inter, Cairo, Amiri } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingRebabaWidget from '@/components/FloatingRebabaWidget';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Jordanian Canadian Nashama Society',
    template: '%s | Jordanian Canadian Nashama Society',
  },
  description: 'Welcome to the official portal for the Jordanian Canadian Nashama Society. Bringing the community together in Halifax and beyond.',
  keywords: [
    'Jordanian Canadian Nashama Society',
    'Jordan',
    'Canada',
    'Halifax',
    'Community',
    'Events'
  ],
  openGraph: {
    title: 'Jordanian Canadian Nashama Society',
    description: 'Bridging cultures, building community, celebrating heritage',
    type: 'website',
    locale: 'en_CA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} ${amiri.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingRebabaWidget />
      </body>
    </html>
  );
}

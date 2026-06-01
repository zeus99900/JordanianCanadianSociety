import type { Metadata } from 'next';
import { Inter, Cairo, Amiri } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCoffeeWidget from '@/components/FloatingCoffeeWidget';
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
    default: 'Jordanian Canadian Society',
    template: '%s | Jordanian Canadian Society',
  },
  description:
    'Bridging Jordanian heritage with Canadian community. Events, cultural celebrations, and community connections in Halifax, Nova Scotia.',
  keywords: [
    'Jordanian Canadian Society',
    'JCS',
    'Halifax',
    'Nova Scotia',
    'Jordanian community',
    'cultural events',
    'Arabic community Canada',
  ],
  openGraph: {
    title: 'Jordanian Canadian Society',
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
        <FloatingCoffeeWidget />
        <FloatingRebabaWidget />
      </body>
    </html>
  );
}

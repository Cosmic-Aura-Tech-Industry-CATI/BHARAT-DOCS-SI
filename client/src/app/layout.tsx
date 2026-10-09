import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { SonnerProvider } from '@/providers/SonnerProvider';

export const metadata: Metadata = {
  title: 'BharatDoc (भारतDoc) — AI Document Intelligence System',
  description:
    'High-accuracy Human-in-the-Loop document intelligence engine for Indian MSMEs, Chartered Accountants, and Tax Professionals. Automated GST, Form-16, and handwritten bill extraction.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F7F5F0] font-sans text-slate-900 antialiased">
        <QueryProvider>
          {children}
          <SonnerProvider />
        </QueryProvider>
      </body>
    </html>
  );
}

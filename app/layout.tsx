import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MeraPension — Bihar Pension Status Tracker',
  description:
    'Bihar pensioners can check pension status, eKYC, Jeevan Praman, and payment history instantly using Aadhaar number or Beneficiary ID. Serving widows, disabled, and senior citizens of Bihar.',
  keywords:
    'Bihar pension, eLabharthi, eKYC, Jeevan Praman, pension status, labharthi sankhya, old age pension, widow pension, disabled pension, Bihar sarkar',
  openGraph: {
    title: 'MeraPension — Bihar Pension Tracker',
    description:
      'Track your Bihar pension, eKYC, and Jeevan Praman status instantly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

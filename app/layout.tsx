import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/app/components/ThemeProvider';
import PageLayout from "@/app/components/PageLayout";
import React, { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"], variable: '--font-ui' });

export const metadata: Metadata = {
  title: "Codex Sinaiticus Reader",
  description: "Explore the Codex Sinaiticus, one of the oldest and most complete manuscripts of the Bible",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} transition-colors duration-500`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ThemeProvider>
          <PageLayout>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </PageLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

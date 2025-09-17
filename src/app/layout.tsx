import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/app/utils/Provider';
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Capacity Vietnam Dashbaord',
  
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <Providers>
            {children}
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  );
}

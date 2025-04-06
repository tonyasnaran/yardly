import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeRegistry from '@/components/ThemeRegistry';
import ClientLayout from '@/components/ClientLayout';
import { Providers } from './providers';
import GoogleMapsScript from '@/components/GoogleMapsScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yardly - Find Your Perfect Outdoor Space',
  description: 'Discover and book unique outdoor spaces for your next gathering or event.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppRouterCacheProvider>
            <ThemeRegistry>
              <ClientLayout>
                <GoogleMapsScript />
                {children}
              </ClientLayout>
            </ThemeRegistry>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
} 
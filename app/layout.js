import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Pavia',
  description: 'Work, rent, and learn — all in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <AppHeader />
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
    }

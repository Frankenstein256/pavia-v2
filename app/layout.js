import { Providers } from './providers';
import './globals.css';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

export const metadata = {
  title: 'Pavia',
  description: 'Work, rent, and learn — all in one place.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

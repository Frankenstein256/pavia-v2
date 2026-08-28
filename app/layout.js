import { Providers } from './providers';
import './globals.css';
import Navbar from './Navbar';

export const metadata = {
  title: 'Pavia v2',
  description: 'Pavia rebuild on Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
  <Navbar />
  {children}
</Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Pavia v2',
  description: 'Pavia rebuild on Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

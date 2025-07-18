import Link from 'next/link';

export const metadata = {
  title: 'Carelink Zambia MVP',
  description: 'Connecting patients with care providers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <nav style={{ padding: '1rem', background: '#f5f5f5' }}>
          <Link href="/">Home</Link>
          <Link href="/about" style={{ marginLeft: '1rem' }}>About</Link>
          <Link href="/contact" style={{ marginLeft: '1rem' }}>Contact</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}

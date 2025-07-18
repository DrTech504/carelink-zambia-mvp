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
          <a href="/" style={{ marginRight: '1rem' }}>Home</a>
          <a href="/about" style={{ marginRight: '1rem' }}>About</a>
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  );
}

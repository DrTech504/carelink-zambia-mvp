import Link from 'next/link';

export default function About() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>About Carelink Zambia</h1>
      <p>We connect patients with care providers.</p>
      <Link href="/">← Back Home</Link>
    </main>
  );
}

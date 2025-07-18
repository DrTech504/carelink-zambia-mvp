import Link from 'next/link';

export default function Contact() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Contact</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Your name" style={{ display: 'block', marginBottom: '1rem' }} />
        <input placeholder="Email" style={{ display: 'block', marginBottom: '1rem' }} />
        <button type="submit">Send</button>
      </form>
      <Link href="/">← Back Home</Link>
    </main>
  );
}

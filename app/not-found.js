// app/not-found.js
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">404</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold text-forest-deep">This tray is empty</h1>
      <p className="mt-3 text-muted">The page you are looking for has been eaten, or never existed.</p>
      <Link href="/" className="btn-dark mt-8">
        Back home
      </Link>
    </div>
  );
}

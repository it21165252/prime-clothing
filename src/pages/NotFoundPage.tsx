import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-28 md:py-40 text-center">
      <p className="label text-prime mb-4">Error 404</p>
      <h1 className="font-display text-6xl md:text-8xl font-extrabold">Wrong turn</h1>
      <p className="text-neutral-500 mt-4">We couldn't find that page. Let's get you back on the road.</p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link to="/" className="btn btn-primary">Back to Home</Link>
        <Link to="/collections/all" className="btn btn-outline">Shop All</Link>
      </div>
    </div>
  );
}

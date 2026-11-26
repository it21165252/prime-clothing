import { Link, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE, formatLKR } from '../lib/format';
import { SizeGuideContent } from '../components/SizeGuide';
import NotFoundPage from './NotFoundPage';

// Placeholder policy copy (demo). Replace with the client's approved wording before launch.
const PAGES: Record<string, { title: string; body: ReactNode }> = {
  delivery: {
    title: 'Delivery',
    body: (
      <>
        <p>We deliver island-wide across all 25 districts of Sri Lanka.</p>
        <ul>
          <li>Colombo and suburbs: usually next working day.</li>
          <li>Rest of the island: 2 to 4 working days.</li>
          <li>Free delivery on orders over {formatLKR(FREE_DELIVERY_THRESHOLD)}. Otherwise a flat {formatLKR(STANDARD_DELIVERY_FEE)}.</li>
          <li>Cash on delivery is available on all orders.</li>
        </ul>
      </>
    ),
  },
  returns: {
    title: 'Returns & Exchanges',
    body: (
      <>
        <p>Not the right fit? Unworn items with original tags can be exchanged for a different size or colour within 14 days of delivery.</p>
        <ul>
          <li>Contact us with your order number to start an exchange.</li>
          <li>Size exchanges are free. We collect the item and deliver the replacement.</li>
          <li>For hygiene reasons gloves and caps can only be exchanged if unused and sealed.</li>
          <li>Refunds are issued for faulty or incorrect items.</li>
        </ul>
      </>
    ),
  },
  'size-guide': { title: 'Size Guide', body: <SizeGuideContent /> },
  contact: {
    title: 'Contact Us',
    body: (
      <>
        <p>Questions about an order, sizing or a product? We're here to help.</p>
        <ul>
          <li>Email: hello@primeclothing.lk</li>
          <li>Phone / WhatsApp: +94 7X XXX XXXX</li>
          <li>Hours: Monday to Saturday, 9.00 am to 6.00 pm</li>
        </ul>
        <p>
          Looking for motorcycles? Visit <a href="https://primeracing.lk" target="_blank" rel="noreferrer">Prime Racing</a>.
        </p>
      </>
    ),
  },
  about: {
    title: 'Our Story',
    body: (
      <>
        <p>
          Prime Clothing is the apparel arm of Prime Racing, Sri Lanka's home of premium motorcycles. We spend our days around
          riders, and we kept hearing the same thing: there's nothing to wear that feels as good off the bike as it does on it.
        </p>
        <p>
          So we made it. Heavyweight tees and hoodies, riding jackets with real protection, and accessories that finish the kit.
          Minimal design, built for the ride.
        </p>
      </>
    ),
  },
  terms: {
    title: 'Terms & Conditions',
    body: <p>Our full terms and conditions will be published here before launch.</p>,
  },
  privacy: {
    title: 'Privacy Policy',
    body: <p>Our privacy policy will be published here before launch. We never sell your personal data.</p>,
  },
};

export default function InfoPage() {
  const { slug = '' } = useParams();
  const page = PAGES[slug];
  if (!page) return <NotFoundPage />;
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-12 md:py-20">
      <nav className="label !text-[0.62rem] text-neutral-400 mb-3" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{page.title}</span>
      </nav>
      <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-8">{page.title}</h1>
      <div className="text-neutral-700 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:underline">{page.body}</div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { CATEGORY_LABELS, getProduct, getRelatedProducts, stockFor, type Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { formatLKR, FREE_DELIVERY_THRESHOLD } from '../lib/format';
import { Accordion } from '../components/Accordion';
import { SizeGuideModal } from '../components/SizeGuide';
import { ProductCard } from '../components/ProductCard';
import { ChevronLeft, ChevronRight, RulerIcon, ReturnIcon, TruckIcon } from '../components/Icons';
import NotFoundPage from './NotFoundPage';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = getProduct(slug);
  if (!product) return <NotFoundPage />;
  // Keyed so all selection state resets when moving between products.
  return <ProductView key={product.id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const { addItem, openDrawer } = useCart();
  const [colourIdx, setColourIdx] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [imageIdx, setImageIdx] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    document.title = `${product.name} | Prime Clothing`;
    return () => {
      document.title = 'Prime Clothing | Rider Streetwear & Gear | Sri Lanka';
    };
  }, [product]);

  const colour = product.colours[colourIdx];
  const related = getRelatedProducts(product, 4);
  const guideTab = product.category === 'pants' ? 'bottoms' : product.category === 'gloves' ? 'gloves' : 'tops';
  const showGuide = product.sizes.length > 1;

  const add = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      colour: colour.name,
      size,
      maxQuantity: stockFor(product, size),
    });
    toast.success(`${product.name} added to bag`);
    openDrawer();
  };

  const go = (d: 1 | -1) => setImageIdx((i) => (i + d + product.images.length) % product.images.length);

  return (
    <div className="mx-auto max-w-[1600px] md:px-8 pb-20">
      <nav className="hidden md:block label !text-[0.62rem] text-neutral-400 py-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link> / <Link to="/collections/all" className="hover:text-ink">Shop</Link> /{' '}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-14">
        {/* Gallery: swipe carousel on mobile, stacked grid on desktop */}
        <div>
          <div className="relative md:hidden aspect-[4/5] bg-mist overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={imageIdx}
                src={product.images[imageIdx]}
                alt={`${product.name} image ${imageIdx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) go(1);
                  else if (info.offset.x > 50) go(-1);
                }}
              />
            </AnimatePresence>
            <button onClick={() => go(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center"><ChevronLeft size={18} /></button>
            <button onClick={() => go(1)} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center"><ChevronRight size={18} /></button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {product.images.map((_, i) => (
                <span key={i} className={`h-0.5 w-6 ${i === imageIdx ? 'bg-ink' : 'bg-white/80'}`} />
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {product.images.map((src, i) => (
              <div key={src} className={`bg-mist overflow-hidden ${product.images.length % 2 === 1 && i === 0 ? 'col-span-2' : ''}`}>
                <img src={src} alt={`${product.name} image ${i + 1}`} className="w-full aspect-[4/5] object-cover" loading={i < 2 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 md:px-0">
          <div className="lg:sticky lg:top-[96px]">
            <p className="label text-neutral-500">{CATEGORY_LABELS[product.category]}</p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-2">{product.name}</h1>
            <p className="text-sm text-neutral-500 mt-1">{product.subtitle}</p>
            <div className="flex items-center gap-3 mt-4">
              <p className={`text-xl font-semibold ${product.compareAtPrice ? 'text-prime' : ''}`}>{formatLKR(product.price)}</p>
              {product.compareAtPrice && <p className="text-neutral-400 line-through">{formatLKR(product.compareAtPrice)}</p>}
            </div>
            <p className="text-xs text-neutral-500 mt-1">Tax included.</p>

            {/* Colour */}
            <div className="mt-8">
              <p className="label mb-3">
                Colour: <span className="text-neutral-500">{colour.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colours.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColourIdx(i)}
                    aria-label={c.name}
                    aria-pressed={i === colourIdx}
                    className={`w-9 h-9 rounded-full border transition-shadow ${i === colourIdx ? 'ring-2 ring-offset-2 ring-ink border-transparent' : 'border-neutral-300'}`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className={`label ${sizeError ? 'text-prime' : ''}`}>{sizeError ? 'Please select a size' : `Size${size ? `: ${size}` : ''}`}</p>
                {showGuide && (
                  <button onClick={() => setGuideOpen(true)} className="label !text-[0.65rem] inline-flex items-center gap-1.5 underline underline-offset-4">
                    <RulerIcon size={14} /> Size guide
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes.map((s) => {
                  const out = stockFor(product, s) <= 0;
                  return (
                    <button
                      key={s}
                      disabled={out}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                      className={`h-12 border text-sm font-semibold transition-colors ${
                        size === s ? 'bg-ink text-white border-ink' : out ? 'border-neutral-200 text-neutral-300 line-through' : sizeError ? 'border-prime' : 'border-neutral-300 hover:border-ink'
                      } ${product.sizes.length === 1 ? 'col-span-2' : ''}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={add} className="btn btn-primary w-full mt-8 !h-14">Add to bag</button>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2"><TruckIcon size={18} /> Free delivery over {formatLKR(FREE_DELIVERY_THRESHOLD)}</div>
              <div className="flex items-center gap-2"><ReturnIcon size={18} /> Free 14-day exchanges</div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed mt-8">{product.description}</p>

            <div className="mt-6 border-t border-neutral-200">
              <Accordion title="Details" defaultOpen>
                <ul className="list-disc pl-5 space-y-1">
                  {product.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </Accordion>
              <Accordion title="Fit & Care">
                <ul className="list-disc pl-5 space-y-1">
                  {product.fitCare.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </Accordion>
              <Accordion title="Delivery & Returns">
                <p>
                  Island-wide delivery in 2 to 4 working days (Colombo and suburbs usually next day). Free delivery on orders over{' '}
                  {formatLKR(FREE_DELIVERY_THRESHOLD)}, otherwise LKR 450. Cash on delivery available.
                </p>
                <p className="mt-3">
                  Unworn items with tags can be exchanged for a different size or colour within 14 days. See our{' '}
                  <Link to="/pages/returns" className="underline">returns policy</Link>.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <section className="px-4 md:px-0 pt-20">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-8">You may also like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-5">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} initialTab={guideTab} />
    </div>
  );
}

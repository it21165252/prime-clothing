import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { Product } from '../data/products';
import { stockFor } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { formatLKR } from '../lib/format';
import { PlusIcon } from './Icons';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem, openDrawer } = useCart();
  const [quickOpen, setQuickOpen] = useState(false);
  const colour = product.colours[0];

  const quickAdd = (size: string) => {
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
    setQuickOpen(false);
    toast.success(`${product.name} (${size}) added to bag`);
    openDrawer();
  };

  const oneSize = product.sizes.length === 1;
  /** Hoodie cards zoom into the garment on hover; other categories swap to the second image. */
  const zoomOnHover = product.category === 'hoodies';

  return (
    <div className="group relative" onMouseLeave={() => setQuickOpen(false)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <Link to={`/products/${product.slug}`} aria-label={product.name}>
          {zoomOnHover ? (
            // Hoodies: one shot of the garment; hover zooms into the back print instead of swapping images.
            <img
              src={product.images[0]}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover origin-[56%_34%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.22] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                loading={priority ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              {product.images[1] && (
                <img
                  src={product.images[1]}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          )}
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isNew && <span className="label !text-[0.6rem] bg-white px-2 py-1">New</span>}
          {product.compareAtPrice && <span className="label !text-[0.6rem] bg-prime text-white px-2 py-1">Sale</span>}
        </div>

        {/* Quick add */}
        <div className="absolute inset-x-0 bottom-0 p-2 md:p-3">
          {quickOpen && !oneSize ? (
            <div className="bg-white p-3">
              <p className="label !text-[0.62rem] text-neutral-500 mb-2">Quick add: select size</p>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => quickAdd(s)} className="min-w-10 h-9 px-2 border border-neutral-300 text-xs font-semibold hover:bg-ink hover:text-white hover:border-ink transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => (oneSize ? quickAdd(product.sizes[0]) : setQuickOpen(true))}
              className="ml-auto flex items-center justify-center gap-2 bg-white/95 h-10 w-10 md:w-full md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-ink hover:text-white"
              aria-label={`Quick add ${product.name}`}
            >
              <PlusIcon size={16} />
              <span className="hidden md:inline label !text-[0.65rem]">Quick add</span>
            </button>
          )}
        </div>
      </div>

      <Link to={`/products/${product.slug}`} className="block mt-3">
        <p className="text-sm font-semibold leading-snug">{product.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{product.subtitle}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <p className={`text-sm font-semibold ${product.compareAtPrice ? 'text-prime' : ''}`}>{formatLKR(product.price)}</p>
          {product.compareAtPrice && <p className="text-xs text-neutral-400 line-through">{formatLKR(product.compareAtPrice)}</p>}
        </div>
        {product.colours.length > 1 && (
          <div className="flex gap-1.5 mt-2" aria-label={`${product.colours.length} colours`}>
            {product.colours.map((c) => (
              <span key={c.name} title={c.name} className="w-3 h-3 rounded-full border border-neutral-300" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}

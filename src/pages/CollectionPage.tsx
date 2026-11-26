import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CATEGORY_LABELS,
  COLLECTIONS,
  getCollectionProducts,
  searchProducts,
  type CategorySlug,
  type CollectionHandle,
  type Product,
} from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ChevronDown, CloseIcon, FilterIcon } from '../components/Icons';


type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

const PRICE_BANDS = [
  { key: 'u5', label: 'Under LKR 5,000', test: (p: number) => p < 5000 },
  { key: '5-10', label: 'LKR 5,000 to 10,000', test: (p: number) => p >= 5000 && p <= 10000 },
  { key: '10-25', label: 'LKR 10,000 to 25,000', test: (p: number) => p > 10000 && p <= 25000 },
  { key: 'o25', label: 'Over LKR 25,000', test: (p: number) => p > 25000 },
];

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', 'One Size'];

type Filters = { categories: string[]; sizes: string[]; colours: string[]; prices: string[] };
const EMPTY: Filters = { categories: [], sizes: [], colours: [], prices: [] };

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

type Mode = 'collection' | 'search';

export default function CollectionPage({ mode = 'collection' }: { mode?: Mode }) {
  const { handle = 'all' } = useParams();
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  // Keyed so filters and sort reset when the collection or search term changes.
  return <CollectionView key={`${mode}:${handle}:${query}`} mode={mode} handle={handle} query={query} />;
}

function CollectionView({ mode, handle, query }: { mode: Mode; handle: string; query: string }) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>('featured');
  const [panelOpen, setPanelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const meta = mode === 'search'
    ? { title: query ? `Search: ${query}` : 'Search', blurb: '' }
    : COLLECTIONS[handle as CollectionHandle] ?? COLLECTIONS.all;

  const base: Product[] = useMemo(() => (mode === 'search' ? searchProducts(query) : getCollectionProducts(handle)), [mode, query, handle]);

  const facets = useMemo(() => {
    const categories = [...new Set(base.map((p) => p.category))] as CategorySlug[];
    const sizes = [...new Set(base.flatMap((p) => p.sizes))].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
    const colourMap = new Map<string, string>();
    base.forEach((p) => p.colours.forEach((c) => colourMap.set(c.name, c.hex)));
    return { categories, sizes, colours: [...colourMap.entries()] };
  }, [base]);

  const products = useMemo(() => {
    const list = base.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (filters.colours.length && !p.colours.some((c) => filters.colours.includes(c.name))) return false;
      if (filters.prices.length && !PRICE_BANDS.filter((b) => filters.prices.includes(b.key)).some((b) => b.test(p.price))) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [base, filters, sort]);

  const activeCount = filters.categories.length + filters.sizes.length + filters.colours.length + filters.prices.length;

  useEffect(() => {
    document.body.style.overflow = panelOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [panelOpen]);

  const chips = [
    ...filters.categories.map((v) => ({ group: 'categories' as const, v, label: CATEGORY_LABELS[v as CategorySlug] })),
    ...filters.sizes.map((v) => ({ group: 'sizes' as const, v, label: `Size ${v}` })),
    ...filters.colours.map((v) => ({ group: 'colours' as const, v, label: v })),
    ...filters.prices.map((v) => ({ group: 'prices' as const, v, label: PRICE_BANDS.find((b) => b.key === v)?.label ?? v })),
  ];

  const FilterGroups = (
    <div className="space-y-8">
      {facets.categories.length > 1 && (
        <FilterGroup title="Category">
          {facets.categories.map((c) => (
            <CheckRow key={c} label={CATEGORY_LABELS[c]} checked={filters.categories.includes(c)} onChange={() => setFilters((f) => ({ ...f, categories: toggle(f.categories, c) }))} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setFilters((f) => ({ ...f, sizes: toggle(f.sizes, s) }))}
              className={`min-w-11 h-10 px-3 border text-xs font-semibold transition-colors ${filters.sizes.includes(s) ? 'bg-ink text-white border-ink' : 'border-neutral-300 hover:border-ink'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour">
        <div className="grid grid-cols-2 gap-3">
          {facets.colours.map(([name, hex]) => (
            <button key={name} onClick={() => setFilters((f) => ({ ...f, colours: toggle(f.colours, name) }))} className="flex items-center gap-2 text-sm text-left">
              <span className={`w-5 h-5 rounded-full border ${filters.colours.includes(name) ? 'ring-2 ring-offset-2 ring-ink border-transparent' : 'border-neutral-300'}`} style={{ background: hex }} />
              <span className={filters.colours.includes(name) ? 'font-semibold' : ''}>{name}</span>
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_BANDS.map((b) => (
          <CheckRow key={b.key} label={b.label} checked={filters.prices.includes(b.key)} onChange={() => setFilters((f) => ({ ...f, prices: toggle(f.prices, b.key) }))} />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8 pb-20">
      <div className="pt-8 md:pt-12 pb-6 md:pb-8">
        <nav className="label !text-[0.62rem] text-neutral-400 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{meta.title}</span>
        </nav>
        <h1 className="font-display text-5xl md:text-7xl font-extrabold">{meta.title}</h1>
        {meta.blurb && <p className="text-neutral-500 mt-3 max-w-xl text-sm md:text-base">{meta.blurb}</p>}
      </div>

      {/* Filter / sort bar */}
      <div className="sticky top-16 md:top-[72px] z-30 bg-white border-y border-neutral-200 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="h-14 flex items-center justify-between gap-4">
          <button onClick={() => setPanelOpen(true)} className="label inline-flex items-center gap-2 lg:hidden">
            <FilterIcon size={18} /> Filter {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden lg:block label text-neutral-500">{products.length} {products.length === 1 ? 'product' : 'products'}</p>
          <div className="relative">
            <button onClick={() => setSortOpen((o) => !o)} className="label inline-flex items-center gap-2" aria-expanded={sortOpen}>
              Sort: {SORTS.find((s) => s.key === sort)?.label} <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-200 shadow-lg z-10 py-2"
                >
                  {SORTS.map((s) => (
                    <li key={s.key}>
                      <button onClick={() => { setSort(s.key); setSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-mist ${sort === s.key ? 'font-semibold' : ''}`}>
                        {s.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10 pt-6">
        <aside className="hidden lg:block">
          <div className="sticky top-[150px]">
            {FilterGroups}
            {activeCount > 0 && (
              <button onClick={() => setFilters(EMPTY)} className="label mt-8 underline underline-offset-4">Clear all</button>
            )}
          </div>
        </aside>

        <div>
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {chips.map((c) => (
                <button key={`${c.group}-${c.v}`} onClick={() => setFilters((f) => ({ ...f, [c.group]: f[c.group].filter((x) => x !== c.v) }))} className="inline-flex items-center gap-1.5 bg-mist px-3 py-1.5 text-xs font-semibold">
                  {c.label} <CloseIcon size={12} />
                </button>
              ))}
              <button onClick={() => setFilters(EMPTY)} className="text-xs underline underline-offset-4 px-2">Clear all</button>
            </div>
          )}
          <p className="lg:hidden label text-neutral-500 mb-4">{products.length} {products.length === 1 ? 'product' : 'products'}</p>

          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-4xl font-bold">No matches</p>
              <p className="text-neutral-500 mt-2 text-sm">
                {mode === 'search' && base.length === 0 ? 'Try a different search term.' : 'Try removing a filter.'}
              </p>
              <Link to="/collections/all" className="btn btn-primary mt-6">Shop All</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanelOpen(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-white max-h-[85vh] flex flex-col lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-200">
                <p className="font-display text-2xl font-bold">Filter</p>
                <button onClick={() => setPanelOpen(false)} aria-label="Close filters" className="p-2 -mr-2"><CloseIcon size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{FilterGroups}</div>
              <div className="p-4 border-t border-neutral-200 grid grid-cols-2 gap-3">
                <button onClick={() => setFilters(EMPTY)} className="btn btn-outline">Clear</button>
                <button onClick={() => setPanelOpen(false)} className="btn btn-primary">View {products.length}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label mb-4">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
      <span className={`w-4 h-4 border flex items-center justify-center ${checked ? 'bg-ink border-ink' : 'border-neutral-400'}`}>
        {checked && <span className="w-2 h-2 bg-white" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}


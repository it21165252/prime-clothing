/**
 * DEMO DATA: placeholder catalogue for the Prime Clothing storefront.
 * Product names, prices, stock and copy are illustrative only, and every image
 * is an Unsplash stock photo (images.unsplash.com) used as a stand-in until the
 * real product photography is shot. Replace this file with data from the
 * Prime Clothing backend (Supabase) once it exists.
 */

export type CategorySlug = 'tees' | 'hoodies' | 'jackets' | 'jerseys' | 'pants' | 'caps' | 'gloves' | 'bags';
export type Department = 'men' | 'women' | 'unisex';
export type CollectionHandle = 'all' | 'new-in' | 'men' | 'women' | 'riding-gear' | 'accessories' | 'best-sellers';

export type ProductColour = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: CategorySlug;
  department: Department;
  /** Riding gear = protective/technical pieces; accessories = caps, gloves, bags. */
  group: 'apparel' | 'riding-gear' | 'accessories';
  price: number;
  compareAtPrice?: number;
  colours: ProductColour[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  fitCare: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  /** Units in stock per size (demo). Missing size = 10. */
  stock?: Record<string, number>;
  createdAt: string;
};

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const unsplash = img;

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GLOVE_SIZES = ['S', 'M', 'L', 'XL'];
const ONE_SIZE = ['One Size'];

const BLACK = { name: 'Black', hex: '#0a0a0a' };
const WHITE = { name: 'White', hex: '#f5f5f5' };
const RED = { name: 'Prime Red', hex: '#e10600' };
const GREY = { name: 'Charcoal', hex: '#4a4a4a' };
const SAND = { name: 'Sand', hex: '#cbb89a' };
const NAVY = { name: 'Navy', hex: '#1c2433' };
const BROWN = { name: 'Tan', hex: '#8a5a3b' };
const INDIGO = { name: 'Indigo', hex: '#2f3f63' };
const RUST = { name: 'Rust', hex: '#a4532f' };

export const COLLECTIONS: Record<CollectionHandle, { title: string; blurb: string; hero?: string }> = {
  all: { title: 'Shop All', blurb: 'Every piece in the Prime Clothing line-up.' },
  'new-in': { title: 'New In', blurb: 'Fresh drops built for riders. Get them before they go.' },
  men: { title: 'Men', blurb: 'Tees, hoodies and jackets cut for life on two wheels.' },
  women: { title: 'Women', blurb: 'Rider-inspired essentials designed to move with you.' },
  'riding-gear': { title: 'Riding Gear', blurb: 'Technical jackets, jerseys and riding pants with protection where it counts.' },
  accessories: { title: 'Accessories', blurb: 'Caps, gloves and bags to finish the kit.' },
  'best-sellers': { title: 'Best Sellers', blurb: 'The pieces our riders keep coming back for.' },
};

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  tees: 'T-Shirts',
  hoodies: 'Hoodies & Sweats',
  jackets: 'Jackets',
  jerseys: 'Jerseys',
  pants: 'Pants',
  caps: 'Caps',
  gloves: 'Gloves',
  bags: 'Bags',
};

const TEE_CARE = ['Machine wash cold, inside out', 'Do not tumble dry', 'Cool iron, avoid print', 'Do not dry clean'];
const HOODIE_CARE = ['Machine wash 30°C with similar colours', 'Reshape while damp and dry flat', 'Do not bleach'];
const LEATHER_CARE = ['Wipe clean with a damp cloth', 'Condition leather every 3 months', 'Store on a wide hanger away from direct sun'];

export const PRODUCTS: Product[] = [
  {
    id: 'p01', slug: 'prime-core-tee-black', name: 'Prime Core Tee', subtitle: 'Regular fit', category: 'tees', department: 'men', group: 'apparel',
    price: 4450, colours: [BLACK, WHITE], sizes: APPAREL_SIZES,
    images: [img('1622519407650-3df9883f76a5'), img('1583743814966-8936f5b7be1a')],
    description: 'The everyday rider tee. Heavyweight 220 GSM cotton with a small Prime chest hit and a clean, structured drape that holds its shape after a long day in the saddle.',
    details: ['220 GSM combed cotton jersey', 'Ribbed crew neck', 'Screen-printed chest logo', 'Made in Sri Lanka'],
    fitCare: ['Regular fit, true to size', 'Model is 183 cm and wears M', ...TEE_CARE],
    isBestSeller: true, createdAt: '2026-09-02',
  },
  {
    id: 'p02', slug: 'prime-core-tee-white', name: 'Prime Core Tee', subtitle: 'Regular fit, White', category: 'tees', department: 'men', group: 'apparel',
    price: 4450, colours: [WHITE, BLACK], sizes: APPAREL_SIZES,
    images: [img('1627225924765-552d49cf47ad'), img('1521572163474-6864f9cf17ab')],
    description: 'Our signature heavyweight tee in optic white. Crisp, minimal and made to layer under a riding jacket.',
    details: ['220 GSM combed cotton jersey', 'Ribbed crew neck', 'Screen-printed chest logo', 'Made in Sri Lanka'],
    fitCare: ['Regular fit, true to size', 'Model is 180 cm and wears M', ...TEE_CARE],
    createdAt: '2026-09-02',
  },
  {
    id: 'p03', slug: 'throttle-graphic-tee', name: 'Throttle Graphic Tee', subtitle: 'Oversized fit', category: 'tees', department: 'men', group: 'apparel',
    price: 4950, colours: [BLACK], sizes: APPAREL_SIZES,
    images: [img('1503341504253-dff4815485f1'), img('1618354691373-d851c5c3a990')],
    description: 'Dropped shoulders, boxy body and a bold front graphic. Built for the meet-up, the coffee run and everything after.',
    details: ['240 GSM cotton', 'Oversized boxy cut with dropped shoulders', 'Front graphic print', 'Made in Sri Lanka'],
    fitCare: ['Oversized fit, size down for a regular look', ...TEE_CARE],
    isNew: true, isBestSeller: true, createdAt: '2026-11-10',
  },
  {
    id: 'p04', slug: 'apex-back-print-tee', name: 'Apex Back Print Tee', subtitle: 'Relaxed fit', category: 'tees', department: 'men', group: 'apparel',
    price: 4950, colours: [WHITE, SAND], sizes: APPAREL_SIZES,
    images: [img('1564859228273-274232fdb516'), img('1622445275463-afa2ab738c34')],
    description: 'A line-art back print inspired by the corners of the circuit. Relaxed through the body with a soft hand feel.',
    details: ['220 GSM cotton', 'Relaxed fit', 'Large back print, small front logo', 'Made in Sri Lanka'],
    fitCare: ['Relaxed fit, true to size', ...TEE_CARE],
    isNew: true, createdAt: '2026-11-04',
  },
  {
    id: 'p05', slug: 'pit-lane-tee-women', name: 'Pit Lane Tee', subtitle: "Women's relaxed fit", category: 'tees', department: 'women', group: 'apparel',
    price: 4250, colours: [BLACK, WHITE], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [img('1503342217505-b0a15ec3261c'), img('1529374255404-311a2a4f1fd9')],
    description: 'A relaxed, slightly cropped tee with a printed front graphic. Easy to style with denim or cargos.',
    details: ['200 GSM cotton', 'Slightly cropped length', 'Front graphic print'],
    fitCare: ['Relaxed fit, true to size', 'Model is 170 cm and wears S', ...TEE_CARE],
    isNew: true, createdAt: '2026-11-12',
  },
  {
    id: 'p06', slug: 'redline-heavyweight-hoodie', name: 'Redline Heavyweight Hoodie', subtitle: 'Oversized fit', category: 'hoodies', department: 'unisex', group: 'apparel',
    price: 8950, compareAtPrice: 9950, colours: [GREY, BLACK], sizes: APPAREL_SIZES,
    images: [img('1556821840-3a63f95609a7'), img('1609873814058-a8928924184a')],
    description: 'Brushed-back 400 GSM fleece, a double-layer hood and a kangaroo pocket big enough for your gloves. The hoodie for early rides and late nights.',
    details: ['400 GSM brushed fleece', 'Double-layer hood, no drawcords', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
    fitCare: ['Oversized fit, size down for a regular look', ...HOODIE_CARE],
    isBestSeller: true, createdAt: '2026-10-01',
  },
  {
    id: 'p07', slug: 'night-ride-crew', name: 'Night Ride Crew', subtitle: 'Regular fit sweatshirt', category: 'hoodies', department: 'men', group: 'apparel',
    price: 7450, colours: [BLACK, RED], sizes: APPAREL_SIZES,
    images: [img('1614975059251-992f11792b9f'), img('1578587018452-892bacefd3f2')],
    description: 'A clean crewneck sweatshirt with a woven Prime tab. Warm without the bulk under a jacket.',
    details: ['330 GSM loopback cotton', 'Woven chest tab', 'Ribbed collar, cuffs and hem'],
    fitCare: ['Regular fit, true to size', ...HOODIE_CARE],
    isNew: true, createdAt: '2026-11-15',
  },
  {
    id: 'p08', slug: 'grid-crew-women', name: 'Grid Crew', subtitle: "Women's boxy sweatshirt", category: 'hoodies', department: 'women', group: 'apparel',
    price: 6950, colours: [WHITE, RED], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [img('1620799140408-edc6dcb6d633'), img('1578587018452-892bacefd3f2')],
    description: 'A soft, boxy crew with a cropped length. The off-bike layer you will live in.',
    details: ['300 GSM brushed cotton blend', 'Boxy cropped cut', 'Tonal embroidered logo'],
    fitCare: ['Boxy fit, true to size', ...HOODIE_CARE],
    createdAt: '2026-10-20',
  },
  {
    id: 'p09', slug: 'prime-leather-riding-jacket', name: 'Prime Leather Riding Jacket', subtitle: 'CE Level 1 armour', category: 'jackets', department: 'men', group: 'riding-gear',
    price: 48500, colours: [BLACK], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [img('1551028719-00167b16eac5'), img('1520975954732-35dd22299614')],
    description: 'Full-grain cowhide with removable CE Level 1 shoulder and elbow armour, a pocket for a back protector and a quilted lining. Classic looks, real protection.',
    details: ['1.1 mm full-grain cowhide', 'Removable CE Level 1 shoulder and elbow armour', 'Back protector pocket', 'YKK zips, two hand pockets, one inside pocket'],
    fitCare: ['Riding fit, size up if wearing a hoodie underneath', ...LEATHER_CARE],
    isBestSeller: true, createdAt: '2026-08-15',
  },
  {
    id: 'p10', slug: 'cafe-racer-jacket-women', name: 'Café Racer Jacket', subtitle: "Women's waxed cotton", category: 'jackets', department: 'women', group: 'riding-gear',
    price: 32500, colours: [BROWN], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [img('1544022613-e87ca75a784a'), img('1531327431456-837da4b1d562')],
    description: 'Waxed cotton with a sherpa collar and pockets for removable armour. Made for weekend rides through the hill country.',
    details: ['Water-resistant waxed cotton shell', 'Sherpa collar and lining', 'Armour pockets at shoulders and elbows (armour sold separately)'],
    fitCare: ['Relaxed fit, true to size', 'Re-wax once a season', 'Spot clean only'],
    isNew: true, createdAt: '2026-11-08',
  },
  {
    id: 'p11', slug: 'highway-denim-jacket', name: 'Highway Denim Jacket', subtitle: 'Aramid lined', category: 'jackets', department: 'men', group: 'riding-gear',
    price: 24500, colours: [INDIGO], sizes: APPAREL_SIZES,
    images: [img('1611312449408-fcece27cdbb7'), img('1591637333184-19aa84b3e01f')],
    description: 'A trucker jacket that looks like denim and rides like gear. Aramid-lined in the impact zones with a corduroy collar.',
    details: ['13 oz rigid denim', 'Aramid fibre lining at shoulders, elbows and back', 'Corduroy collar'],
    fitCare: ['Regular fit, true to size', 'Wash cold, inside out, rarely', 'Line dry'],
    createdAt: '2026-09-18',
  },
  {
    id: 'p12', slug: 'track-bomber-jacket', name: 'Track Bomber', subtitle: 'Lightweight bomber', category: 'jackets', department: 'unisex', group: 'apparel',
    price: 14950, colours: [RUST, BLACK], sizes: APPAREL_SIZES,
    images: [img('1591047139829-d91aecb6caea'), img('1508357941501-0924cf312bbd')],
    description: 'A lightweight satin bomber for warm-weather evenings, with a two-way zip and a Prime red inner lining.',
    details: ['Satin-finish nylon shell', 'Prime red inner lining', 'Two-way YKK zip', 'Sleeve utility pocket'],
    fitCare: ['Regular fit, true to size', 'Hand wash cold', 'Hang dry'],
    isNew: true, createdAt: '2026-11-18',
  },
  {
    id: 'p13', slug: 'prime-race-jersey', name: 'Prime Race Jersey', subtitle: 'Moisture-wicking', category: 'jerseys', department: 'unisex', group: 'riding-gear',
    price: 6950, colours: [RED, BLACK], sizes: APPAREL_SIZES,
    images: [img('1558980394-0a06c4631733'), img('1609630875171-b1321377ee65')],
    description: 'A breathable track and trail jersey with sublimated Prime race graphics. Light, fast-drying and cut long in the back.',
    details: ['Moisture-wicking polyester mesh', 'Sublimated graphics that will not crack or fade', 'Drop-tail hem'],
    fitCare: ['Athletic fit, size up for a looser feel', 'Machine wash cold', 'Do not tumble dry'],
    isBestSeller: true, createdAt: '2026-10-05',
  },
  {
    id: 'p14', slug: 'armoured-riding-gloves', name: 'Armoured Riding Gloves', subtitle: 'Knuckle protection', category: 'gloves', department: 'unisex', group: 'accessories',
    price: 7950, colours: [BLACK], sizes: GLOVE_SIZES,
    images: [img('1558980664-10e7170b5df9'), img('1558981403-c5f9899a28bc')],
    description: 'Goatskin palm, hard knuckle protection and touchscreen fingertips. Short-cuff and easy to pull on for city riding.',
    details: ['Goatskin leather palm', 'TPU knuckle protector', 'Touchscreen thumb and index finger', 'Hook-and-loop wrist closure'],
    fitCare: ['Measure around your palm to choose a size', 'Wipe clean, air dry away from heat'],
    isBestSeller: true, createdAt: '2026-07-22',
  },
  {
    id: 'p15', slug: 'prime-logo-cap', name: 'Prime Logo Cap', subtitle: '6-panel washed cotton', category: 'caps', department: 'unisex', group: 'accessories',
    price: 3450, colours: [GREY, BLACK], sizes: ONE_SIZE,
    images: [img('1521369909029-2afed882baee'), img('1556905055-8f358a7a47b2')],
    description: 'A washed cotton dad cap with an embroidered Prime P on the front and an adjustable strap.',
    details: ['100% washed cotton twill', 'Embroidered front logo', 'Adjustable metal buckle strap'],
    fitCare: ['One size, adjustable', 'Spot clean only'],
    isNew: true, createdAt: '2026-11-01',
  },
  {
    id: 'p16', slug: 'paddock-trucker-cap', name: 'Paddock Trucker Cap', subtitle: 'Mesh back', category: 'caps', department: 'unisex', group: 'accessories',
    price: 3250, colours: [WHITE, SAND], sizes: ONE_SIZE,
    images: [img('1588850561407-ed78c282e89b'), img('1575428652377-a2d80e2277fc')],
    description: 'Structured foam front, breathable mesh back and a snapback closure. Paddock-ready.',
    details: ['Foam front panel', 'Mesh back panels', 'Snapback closure'],
    fitCare: ['One size, adjustable', 'Spot clean only'],
    createdAt: '2026-08-30',
  },
  {
    id: 'p17', slug: 'rider-daypack', name: 'Rider Daypack', subtitle: '20 L, water-resistant', category: 'bags', department: 'unisex', group: 'accessories',
    price: 12950, colours: [NAVY, BLACK], sizes: ONE_SIZE,
    images: [img('1553062407-98eeb64c6a62'), img('1622560480605-d83c853bc5c3')],
    description: 'A slim 20 L pack that sits close to your back on the bike. Padded laptop sleeve, chest strap and a helmet hook.',
    details: ['Water-resistant 600D shell', 'Padded 15" laptop sleeve', 'Chest strap and helmet hook', '20 L capacity'],
    fitCare: ['Wipe clean', 'Do not machine wash'],
    createdAt: '2026-09-10',
  },
  {
    id: 'p18', slug: 'kevlar-riding-jeans', name: 'Kevlar Riding Jeans', subtitle: 'Slim straight fit', category: 'pants', department: 'men', group: 'riding-gear',
    price: 19950, colours: [BLACK], sizes: ['28', '30', '32', '34', '36', '38'],
    images: [img('1624378439575-d8705ad7ae80'), img('1542272604-787c3835535d')],
    description: 'Stretch denim with an aramid lining in the seat and knees, plus pockets for removable hip and knee armour.',
    details: ['12 oz stretch denim', 'Aramid lining at seat and knees', 'Knee and hip armour pockets (armour included)'],
    fitCare: ['Slim straight fit, true to waist size', 'Wash cold, inside out', 'Line dry'],
    isNew: true, createdAt: '2026-11-20',
  },
  {
    id: 'p19', slug: 'utility-cargo-pant', name: 'Utility Cargo Pant', subtitle: 'Relaxed tapered', category: 'pants', department: 'men', group: 'apparel',
    price: 8450, colours: [SAND, BLACK], sizes: ['28', '30', '32', '34', '36', '38'],
    images: [img('1473966968600-fa801b869a1a'), img('1604176354204-9268737828e4')],
    description: 'A relaxed tapered cargo in cotton ripstop with snap cargo pockets and an adjustable cuff.',
    details: ['Cotton ripstop', 'Snap cargo pockets', 'Adjustable cuffs'],
    fitCare: ['Relaxed fit, true to waist size', 'Machine wash cold'],
    createdAt: '2026-10-12',
  },
  {
    id: 'p20', slug: 'prime-track-set-women', name: 'Prime Track Set', subtitle: "Women's jacket and jogger", category: 'hoodies', department: 'women', group: 'apparel',
    price: 11950, compareAtPrice: 13500, colours: [{ name: 'Sunburst', hex: '#e8b52a' }, BLACK], sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [img('1515886657613-9f3515b0c78f'), img('1434389677669-e08b4cac3105')],
    description: 'A matching zip-through track top and jogger in soft brushed tricot. Bold off the bike, comfy on the sofa.',
    details: ['Brushed tricot', 'Full-zip jacket with stand collar', 'Jogger with zip pockets'],
    fitCare: ['Regular fit, true to size', ...HOODIE_CARE],
    isBestSeller: true, createdAt: '2026-10-25',
  },
];

/** Lifestyle / editorial imagery (demo, Unsplash). */
export const LIFESTYLE = {
  hero: img('1558981285-6f0c94958bb6', 2000),
  heroMobile: img('1558981285-6f0c94958bb6', 1000),
  ride: img('1558981806-ec527fa84c39', 1600),
  ride2: img('1449426468159-d96dbf08f19f', 1600),
  men: img('1520975954732-35dd22299614', 900),
  women: img('1544022613-e87ca75a784a', 900),
  ridingGear: img('1558980394-0a06c4631733', 900),
  accessories: img('1521369909029-2afed882baee', 900),
  community: img('1622185135505-2d795003994a', 1600),
};

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCollectionProducts(handle: string): Product[] {
  switch (handle as CollectionHandle) {
    case 'new-in':
      return PRODUCTS.filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'men':
      return PRODUCTS.filter((p) => p.department === 'men' || p.department === 'unisex');
    case 'women':
      return PRODUCTS.filter((p) => p.department === 'women' || p.department === 'unisex');
    case 'riding-gear':
      return PRODUCTS.filter((p) => p.group === 'riding-gear');
    case 'accessories':
      return PRODUCTS.filter((p) => p.group === 'accessories');
    case 'best-sellers':
      return PRODUCTS.filter((p) => p.isBestSeller);
    default:
      return PRODUCTS;
  }
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const same = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.group === product.group));
  const rest = PRODUCTS.filter((p) => p.id !== product.id && !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}

export function stockFor(product: Product, size: string): number {
  return product.stock?.[size] ?? 10;
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.subtitle, CATEGORY_LABELS[p.category], p.department, p.group, ...p.colours.map((c) => c.name)]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
}

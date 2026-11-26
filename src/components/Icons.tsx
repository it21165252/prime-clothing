import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const SearchIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const UserIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
);
export const BagIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const MenuIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);
export const CloseIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const PlusIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14" /></svg>
);
export const ChevronDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m6 9 6 6 6-6" /></svg>
);
export const ChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m15 6-6 6 6 6" /></svg>
);
export const ChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const ArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const FilterIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);
export const TruckIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
);
export const ReturnIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></svg>
);
export const ShieldIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /></svg>
);
export const RulerIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 17 17 3l4 4L7 21l-4-4Z" /><path d="m7 13 2 2M10 10l2 2M13 7l2 2" /></svg>
);
export const InstagramIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>
);
export const FacebookIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15V3Z" /></svg>
);
export const TikTokIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.5 2.8 2.3 4.5 5 4.8" /></svg>
);
export const YouTubeIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" /><path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" /></svg>
);
export const CheckIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m5 12 5 5L20 7" /></svg>
);

import { FREE_DELIVERY_THRESHOLD, formatLKR } from '../lib/format';

const MESSAGES = [
  `Free island-wide delivery on orders over ${formatLKR(FREE_DELIVERY_THRESHOLD)}`,
  'Cash on delivery available across Sri Lanka',
  'Free exchanges within 14 days',
  'Part of the Prime Racing family',
];

export function AnnouncementBar() {
  const row = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-ink text-white h-9 overflow-hidden flex items-center" role="region" aria-label="Announcements">
      <div className="ticker-track flex shrink-0 whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {row.map((m, i) => (
              <span key={`${dup}-${i}`} className="label !text-[0.65rem] px-8 flex items-center gap-8">
                {m}
                <span className="inline-block w-1 h-1 bg-prime" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

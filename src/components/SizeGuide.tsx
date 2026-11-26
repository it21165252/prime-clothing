import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from './Icons';

const TOPS = [
  ['XS', '86-91', '71-76', '66'],
  ['S', '91-96', '76-81', '68'],
  ['M', '96-101', '81-86', '70'],
  ['L', '101-106', '86-91', '72'],
  ['XL', '106-112', '91-97', '74'],
  ['XXL', '112-118', '97-103', '76'],
];
const BOTTOMS = [
  ['S', '76-81', '91-96', '81'],
  ['M', '81-86', '96-101', '81'],
  ['L', '86-91', '101-106', '82'],
  ['XL', '91-97', '106-111', '82'],
  ['XXL', '97-103', '111-116', '83'],
];
const GLOVES = [
  ['S', '18-20'],
  ['M', '20-22'],
  ['L', '22-24'],
  ['XL', '24-26'],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="label !text-[0.62rem] text-left py-3 px-3 bg-mist border-b border-neutral-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-neutral-100">
              {r.map((c, i) => (
                <td key={i} className={`py-3 px-3 ${i === 0 ? 'font-semibold' : 'text-neutral-600'}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuideContent({ initialTab = 'tops' }: { initialTab?: 'tops' | 'bottoms' | 'gloves' }) {
  const [tab, setTab] = useState(initialTab);
  return (
    <div>
      <div className="flex gap-6 border-b border-neutral-200 mb-5">
        {(['tops', 'bottoms', 'gloves'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`label pb-3 -mb-px border-b-2 ${tab === t ? 'border-ink' : 'border-transparent text-neutral-400'}`}>
            {t === 'tops' ? 'Tops & Jackets' : t === 'bottoms' ? 'Pants' : 'Gloves'}
          </button>
        ))}
      </div>
      {tab === 'tops' && <Table head={['Size', 'Chest (cm)', 'Waist (cm)', 'Length (cm)']} rows={TOPS} />}
      {tab === 'bottoms' && <Table head={['Size', 'Waist (cm)', 'Hip (cm)', 'Inseam (cm)']} rows={BOTTOMS} />}
      {tab === 'gloves' && <Table head={['Size', 'Palm circumference (cm)']} rows={GLOVES} />}
      <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
        Measurements are body measurements. Between sizes? Size up for a relaxed fit, or if you plan to layer under a riding jacket.
      </p>
    </div>
  );
}

export function SizeGuideModal({ open, onClose, initialTab }: { open: boolean; onClose: () => void; initialTab?: 'tops' | 'bottoms' | 'gloves' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-label="Size guide"
            className="bg-white w-full sm:max-w-2xl max-h-[88vh] overflow-y-auto p-6 sm:p-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="font-display text-4xl font-bold">Size Guide</h2>
              <button className="p-2 -mr-2 -mt-1" onClick={onClose} aria-label="Close size guide">
                <CloseIcon size={22} />
              </button>
            </div>
            <SizeGuideContent initialTab={initialTab} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

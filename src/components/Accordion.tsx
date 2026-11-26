import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MinusIcon, PlusIcon } from './Icons';

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200">
      <button className="w-full flex items-center justify-between py-4 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="label">{title}</span>
        {open ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="pb-5 text-sm text-neutral-600 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

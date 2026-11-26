import { cn } from '../lib/utils';

export function Logo({ variant = 'dark', className }: { variant?: 'dark' | 'light'; className?: string }) {
  return (
    <img
      src={variant === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt="Prime Clothing"
      width={960}
      height={212}
      className={cn('h-8 w-auto select-none', className)}
      draggable={false}
    />
  );
}

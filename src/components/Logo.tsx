import type { CSSProperties, Ref } from 'react';
import { cn } from '../lib/utils';

export function Logo({
  variant = 'dark',
  className,
  imgRef,
  style,
}: {
  variant?: 'dark' | 'light';
  className?: string;
  imgRef?: Ref<HTMLImageElement>;
  style?: CSSProperties;
}) {
  return (
    <img
      ref={imgRef}
      src={variant === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt="Prime Clothing"
      width={960}
      height={212}
      className={cn('h-8 w-auto select-none', className)}
      style={style}
      draggable={false}
    />
  );
}

import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
};

export function SectionHeader({ eyebrow, title, meta }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6 px-1">
      <div>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent-purple font-medium">
          {eyebrow}
        </p>
        <h2 className="display text-2xl sm:text-3xl md:text-4xl leading-tight">{title}</h2>
      </div>
      {meta && <div className="sm:ml-4">{meta}</div>}
    </div>
  );
}

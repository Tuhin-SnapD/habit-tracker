import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
};

export function SectionHeader({ eyebrow, title, meta }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 px-1">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent-purple font-medium">
          {eyebrow}
        </p>
        <h2 className="display text-3xl md:text-4xl leading-tight">{title}</h2>
      </div>
      {meta && <div className="md:ml-4">{meta}</div>}
    </div>
  );
}

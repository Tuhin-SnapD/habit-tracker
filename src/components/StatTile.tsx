type Props = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
};

export function StatTile({ label, value, hint, accent }: Props) {
  return (
    <div className="card relative p-5 overflow-hidden">
      {accent && (
        <div
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 blur-2xl"
          style={{ backgroundColor: accent }}
        />
      )}
      <div className="relative">
        <div className="text-[10px] text-muted uppercase tracking-[0.18em] font-medium">
          {label}
        </div>
        <div className="display text-4xl mt-1">{value}</div>
        {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
      </div>
    </div>
  );
}

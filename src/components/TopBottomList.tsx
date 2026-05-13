type Entry = { name: string; icon: string; color: string; rate: number };

type Props = {
  title: string;
  entries: Entry[];
  emptyHint: string;
};

export function TopBottomList({ title, entries, emptyHint }: Props) {
  return (
    <div className="card p-5">
      <h3 className="display text-xl mb-3">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">{emptyHint}</p>
      ) : (
        <ul className="space-y-2.5" role="list">
          {entries.map((e, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-lg shrink-0" aria-hidden="true">{e.icon}</span>
              <span className="flex-1 truncate text-sm">{e.name}</span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${e.color}33` }}
              >
                {Math.round(e.rate * 100)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

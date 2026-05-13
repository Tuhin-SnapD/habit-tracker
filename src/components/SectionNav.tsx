import { useActiveSection, scrollToSection } from '../hooks/useActiveSection';

const SECTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'insights', label: 'Insights' },
];

const IDS = SECTIONS.map((s) => s.id);

export function SectionNav() {
  const active = useActiveSection(IDS);
  return (
    <nav className="card flex gap-1 p-1 w-fit mx-auto">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(s.id);
          }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            active === s.id
              ? 'bg-ink text-canvas shadow-card'
              : 'text-muted hover:text-ink'
          }`}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

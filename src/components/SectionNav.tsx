import { useActiveSection, scrollToSection } from '../hooks/useActiveSection';

const SECTIONS = [
  { id: 'today', label: 'Today', key: '1' },
  { id: 'week', label: 'Week', key: '2' },
  { id: 'month', label: 'Month', key: '3' },
  { id: 'insights', label: 'Insights', key: '4' },
];

// Stable reference to avoid re-running the IntersectionObserver effect
const IDS = SECTIONS.map((s) => s.id);

export function SectionNav() {
  const active = useActiveSection(IDS);

  return (
    <nav className="card flex gap-1 p-1 w-fit mx-auto" aria-label="Section navigation">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(s.id);
          }}
          className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            active === s.id
              ? 'bg-ink text-canvas shadow-card dark:bg-accent-purple'
              : 'text-muted hover:text-ink dark:hover:text-canvas'
          }`}
          aria-current={active === s.id ? 'true' : undefined}
          title={`${s.label} (press ${s.key})`}
        >
          {s.label}
          <span className="hidden md:inline text-[9px] opacity-50 ml-1 font-mono">
            {s.key}
          </span>
        </a>
      ))}
    </nav>
  );
}

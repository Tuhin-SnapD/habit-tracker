import { useEffect, useState } from 'react';

export function useActiveSection(ids: string[], defaultId?: string): string {
  const [active, setActive] = useState(defaultId ?? ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(id);
              break;
            }
          }
        },
        { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

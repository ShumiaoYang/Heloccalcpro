import { useEffect, useState } from 'react';
import type { NavigationItem } from '@/lib/navigation';

export function useActiveSection(sections: NavigationItem[]) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is Element => Boolean(el));

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [sections]);

  return activeId;
}

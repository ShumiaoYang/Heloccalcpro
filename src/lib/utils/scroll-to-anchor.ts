export function scrollToAnchor(anchor: string, options: ScrollIntoViewOptions = { behavior: 'smooth' }) {
  if (typeof window === 'undefined') return;

  const targetId = anchor.replace('#', '');
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      block: 'start',
      behavior: options.behavior ?? 'smooth',
    });
  }
}

export function updateHash(anchor: string) {
  if (typeof window === 'undefined') return;
  const hash = anchor.startsWith('#') ? anchor : `#${anchor}`;
  history.replaceState(null, '', hash);
}

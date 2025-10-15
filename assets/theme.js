// assets/theme.js
const KEY = 'theme';
const root = document.documentElement;

function apply(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch {}
}

export function initTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return apply(saved);
  } catch {}
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  apply(prefersDark ? 'dark' : 'light');
}

export function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'dark';
  apply(current === 'dark' ? 'light' : 'dark');
}

// Init on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Optional: expose a quick helper for DevTools:
// window.setTheme = apply;

// assets/theme.js
const KEY = 'theme';
const root = document.documentElement;

function apply(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch {}
}

function initTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return apply(saved);
  } catch {}
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  apply(prefersDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'dark';
  apply(current === 'dark' ? 'light' : 'dark');
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Make functions callable from HTML (works with file://)
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;

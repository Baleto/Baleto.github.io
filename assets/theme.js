// assets/theme.js
const KEY = "theme";                          // localStorage key
const THEMES = new Set(["light", "dark"]);
const root = document.documentElement;

//helpers

function systemPrefersDark() {
  return matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
}

function valid(theme) {
  return THEMES.has(theme);
}

function setColorScheme(theme) {
  // Helps native form controls match the theme
  root.style.colorScheme = theme === "dark" ? "dark" : "light";
}

function syncMetaThemeColor() {
  // Keep browser UI (mobile address bar) in sync with current bg
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const bg = getComputedStyle(document.body || root).backgroundColor;
  meta.setAttribute("content", bg);
}

function apply(theme, { persist = true } = {}) {
  if (!valid(theme)) return;
  root.setAttribute("data-theme", theme);
  setColorScheme(theme);
  if (persist) {
    try { localStorage.setItem(KEY, theme); } catch {}
  }
  // Notify any listeners (e.g., components that need to restyle)
  root.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  // Try to align browser UI color
  if (document.readyState !== "loading") syncMetaThemeColor();
}

function storedTheme() {
  try { return localStorage.getItem(KEY) || null; } catch { return null; }
}

//public actions

function initTheme() {
  const saved = storedTheme();
  const theme = valid(saved) ? saved : (systemPrefersDark() ? "dark" : "light");
  apply(theme, { persist: !!saved }); // persist only if user had an explicit choice
}

function toggleTheme() {
  const current = root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  apply(current === "dark" ? "light" : "dark");
}

function setTheme(theme) {
  // programmatic setter (e.g., future UI with three options)
  if (valid(theme)) apply(theme);
}

function getTheme() {
  return root.getAttribute("data-theme");
}

//boot & listeners

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    syncMetaThemeColor();
  });
} else {
  initTheme();
  syncMetaThemeColor();
}

//If the user has NOT chosen a theme (no saved value), follow OS changes.
try {
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    if (!storedTheme()) apply(mq.matches ? "dark" : "light", { persist: false });
  });
} catch {}

//Keep tabs in sync (if theme changed in another tab)
window.addEventListener("storage", (e) => {
  if (e.key === KEY && valid(e.newValue)) apply(e.newValue, { persist: false });
});

//Expose globals for HTML onclick handlers and future use
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;
window.setTheme = setTheme;
window.getTheme = getTheme;

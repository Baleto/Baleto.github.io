//It works on every page and exposes window.toggleTheme

(function () {
  const KEY = "site.theme";
  const root = document.documentElement;
  
//This reads saved or current attribute, default to 'dark'
  function getTheme() {
    try {
      return localStorage.getItem(KEY) || root.getAttribute("data-theme") || "dark";
    } catch {
      return root.getAttribute("data-theme") || "dark";
    }
  }

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch { /* ignore */ }
  }

//A global function for inline onclick handlers
  window.toggleTheme = function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
  };

//On first load, saved theme is applied (if there are any)
  const saved = getTheme();
  if (saved) applyTheme(saved);
})();

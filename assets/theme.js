// Works on every page and exposes window.toggleTheme
(function () {
  const KEY = "site.theme";
  const root = document.documentElement;

  /*Theme (Dark/Light Toggle*/

  // Reads saved or current theme, defaulting to dark
  function getTheme() {
    try {
      return localStorage.getItem(KEY) || root.getAttribute("data-theme") || "dark";
    } catch {
      return root.getAttribute("data-theme") || "dark";
    }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* ignore storage errors */
    }
  }
  // Global function used by the theme toggle button in the header
  window.toggleTheme = function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
  };
  // On first load, apply saved theme if available
  applyTheme(getTheme());
  /*Back-to-top button logic*/
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".to-top");
    if (!btn) return; // Button not present on the page
    function updateVisibility() {
      if (window.scrollY > 350) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }
    window.addEventListener("scroll", updateVisibility);
    updateVisibility(); // Run once at load
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
})();

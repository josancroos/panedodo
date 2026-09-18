import { getOrderedExperiments } from "./experiments";
import { initCursor } from "./cursor";
import "./platform.css";

const THEME_KEY = "panedodo-theme";

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";
}

export function renderNav(base: string, currentSlug?: string) {
  initTheme();

  const isPlatformPage = document.body.classList.contains("pf-page");

  const nav = document.createElement("nav");
  nav.className = "pf-nav";
  nav.innerHTML = `
    <div class="pf-nav-left">
      <button type="button" class="pf-nav-toggle" aria-label="Navigation öffnen" aria-expanded="false">☰</button>
      <a class="pf-brand" href="${base}index.html" data-cursor-text="Home">panedodo / lab</a>
    </div>
    ${
      isPlatformPage
        ? `<button type="button" class="pf-theme-toggle" aria-label="Theme wechseln">
            <svg class="pf-theme-icon pf-theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <svg class="pf-theme-icon pf-theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>`
        : ""
    }
  `;
  document.body.prepend(nav);
  document.documentElement.style.setProperty("--pf-nav-height", `${nav.offsetHeight}px`);

  if (isPlatformPage) {
    const themeToggle = nav.querySelector<HTMLButtonElement>(".pf-theme-toggle")!;
    const themeSound = new Audio("/theme-toggle.wav");
    themeToggle.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
      themeToggle.setAttribute("aria-pressed", String(next === "dark"));
      themeSound.currentTime = 0;
      themeSound.play().catch(() => {});
    });
  }

  const sidebar = document.createElement("aside");
  sidebar.className = "pf-sidebar";
  sidebar.innerHTML = `
    <a class="pf-sidebar-item${currentSlug ? "" : " is-current"}" href="${base}index.html">Home</a>
    ${getOrderedExperiments()
      .map(
        (e) =>
          `<a class="pf-sidebar-item${e.slug === currentSlug ? " is-current" : ""}" href="${base}experiments/${e.slug}/index.html">${e.title}</a>`
      )
      .join("")}
  `;
  document.body.appendChild(sidebar);

  const toggle = nav.querySelector<HTMLButtonElement>(".pf-nav-toggle")!;
  function setOpen(open: boolean) {
    sidebar.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", () => setOpen(!sidebar.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  if (!isPlatformPage) {
    initCursor();
  }
}

import { getOrderedExperiments, saveExperimentOrder } from "./experiments";
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
    <div class="pf-sidebar-list">
      <a class="pf-sidebar-item${currentSlug ? "" : " is-current"}" href="${base}index.html">Home</a>
      ${getOrderedExperiments()
        .map(
          (e) =>
            `<a class="pf-sidebar-item${e.slug === currentSlug ? " is-current" : ""}" href="${base}experiments/${e.slug}/index.html" data-slug="${e.slug}" draggable="true">${e.title}</a>`
        )
        .join("")}
    </div>
    <button type="button" class="pf-sidebar-save" id="pf-sidebar-save" hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>
      Aktualisieren
    </button>
  `;
  document.body.appendChild(sidebar);

  const sidebarList = sidebar.querySelector<HTMLElement>(".pf-sidebar-list")!;
  const saveButton = sidebar.querySelector<HTMLButtonElement>(".pf-sidebar-save")!;

  saveButton.addEventListener("click", () => {
    window.location.reload();
  });

  let sidebarDragEl: HTMLElement | null = null;
  sidebarList.querySelectorAll<HTMLElement>(".pf-sidebar-item[data-slug]").forEach((item) => {
    item.addEventListener("dragstart", () => {
      sidebarDragEl = item;
      requestAnimationFrame(() => item.classList.add("is-dragging"));
      sidebarList.classList.add("is-reordering");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("is-dragging");
      sidebarDragEl = null;
      sidebarList.classList.remove("is-reordering");
      const order = Array.from(sidebarList.querySelectorAll<HTMLElement>(".pf-sidebar-item[data-slug]")).map(
        (el) => el.dataset.slug!
      );
      saveExperimentOrder(order);
      saveButton.hidden = false;
    });
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (!sidebarDragEl || sidebarDragEl === item) return;
      const rect = item.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      sidebarList.insertBefore(sidebarDragEl, before ? item : item.nextSibling);
    });
  });

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

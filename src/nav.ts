import { experiments } from "./experiments";
import { initCursor } from "./cursor";
import "./platform.css";

export function renderNav(base: string, currentSlug?: string) {
  const nav = document.createElement("nav");
  nav.className = "pf-nav";
  nav.innerHTML = `
    <div class="pf-nav-left">
      <button type="button" class="pf-nav-toggle" aria-label="Navigation öffnen" aria-expanded="false">☰</button>
      <a class="pf-brand" href="${base}index.html" data-cursor-text="Home">panedodo / lab</a>
    </div>
  `;
  document.body.prepend(nav);
  document.documentElement.style.setProperty("--pf-nav-height", `${nav.offsetHeight}px`);

  const sidebar = document.createElement("aside");
  sidebar.className = "pf-sidebar";
  sidebar.innerHTML = `
    <a class="pf-sidebar-item${currentSlug ? "" : " is-current"}" href="${base}index.html">Home</a>
    ${experiments
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

  initCursor();
}

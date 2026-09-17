import { experiments } from "./experiments";
import { initCursor } from "./cursor";

export function renderNav(base: string, currentSlug?: string) {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML = `
    <a class="brand" href="${base}index.html" data-cursor-text="Home">panedodo / lab</a>
    <select id="experiment-jump">
      <option value="">jump to experiment...</option>
      ${experiments
        .map(
          (e) =>
            `<option value="${base}experiments/${e.slug}/index.html" ${
              e.slug === currentSlug ? "selected" : ""
            }>${e.title}</option>`
        )
        .join("")}
    </select>
  `;
  document.body.prepend(nav);

  const select = nav.querySelector<HTMLSelectElement>("#experiment-jump")!;
  select.addEventListener("change", () => {
    if (select.value) window.location.href = select.value;
  });

  initCursor();
}

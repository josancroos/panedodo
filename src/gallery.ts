import { experiments } from "./experiments";
import { renderNav } from "./nav";
import "./style.css";
import "./platform.css";

document.body.classList.add("pf-page");
renderNav("/");

const grid = document.getElementById("grid")!;
grid.innerHTML = experiments
  .map(
    (e, i) => `
    <a class="pf-card" href="/experiments/${e.slug}/index.html" data-cursor-text="View" data-title="${e.title}">
      <span class="pf-index-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="pf-title">${e.title}</span>
      <span class="pf-tags">${e.tags.join(" · ")}</span>
    </a>
  `
  )
  .join("");

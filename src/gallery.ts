import { experiments } from "./experiments";
import { renderNav } from "./nav";
import "./style.css";

renderNav("/");

const grid = document.getElementById("grid")!;
grid.innerHTML = experiments
  .map(
    (e, i) => `
    <a class="card" href="/experiments/${e.slug}/index.html">
      <span class="index">${String(i + 1).padStart(2, "0")}</span>
      <span class="title">${e.title}</span>
      <span class="tags">${e.tags.join(" · ")}</span>
    </a>
  `
  )
  .join("");

import { experiments } from "./experiments";
import { renderNav } from "./nav";
import { tagIcons } from "./tagIcons";
import "./style.css";
import "./platform.css";

document.body.classList.add("pf-page");
renderNav("/");

function renderMedia(e: (typeof experiments)[number], i: number) {
  if (e.preview?.type === "video") {
    return `<video class="pf-card-media" src="${e.preview.src}" muted loop playsinline autoplay></video>`;
  }
  if (e.preview?.type === "image") {
    return `<img class="pf-card-media" src="${e.preview.src}" alt="" loading="lazy" />`;
  }
  return `<span class="pf-card-media pf-card-media-placeholder">${String(i + 1).padStart(2, "0")}</span>`;
}

function renderTags(tags: string[]) {
  return tags
    .map((tag) => {
      const icon = tagIcons[tag.toLowerCase()];
      return `<span class="pf-tag">${icon ? `<span class="pf-tag-icon">${icon}</span>` : ""}${tag}</span>`;
    })
    .join("");
}

const grid = document.getElementById("grid")!;
grid.innerHTML = experiments
  .map(
    (e, i) => `
    <a class="pf-card" href="/experiments/${e.slug}/index.html" data-cursor-text="View" data-title="${e.title}">
      <div class="pf-card-media-frame">${renderMedia(e, i)}</div>
      <div class="pf-card-body">
        <span class="pf-index-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="pf-title">${e.title}</span>
        <div class="pf-tags">${renderTags(e.tags)}</div>
      </div>
    </a>
  `
  )
  .join("");

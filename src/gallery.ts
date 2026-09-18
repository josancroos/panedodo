import { experiments, getOrderedExperiments, saveExperimentOrder } from "./experiments";
import { renderNav } from "./nav";
import { tagIcons } from "./tagIcons";
import "./style.css";
import "./platform.css";

document.body.classList.add("pf-page");
renderNav("/");

function renderMedia(e: (typeof experiments)[number]) {
  if (e.preview?.type === "video") {
    return `<video class="pf-card-media" src="${e.preview.src}" muted loop playsinline autoplay></video>`;
  }
  if (e.preview?.type === "image") {
    return `<img class="pf-card-media" src="${e.preview.src}" alt="" loading="lazy" />`;
  }
  return `<span class="pf-card-media pf-card-media-placeholder"></span>`;
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

function render() {
  grid.innerHTML = getOrderedExperiments()
    .map(
      (e) => `
      <a class="pf-card" href="/experiments/${e.slug}/index.html" data-cursor-text="View" data-title="${e.title}" data-slug="${e.slug}" draggable="true">
        <div class="pf-card-media-frame">${renderMedia(e)}</div>
        <div class="pf-card-body">
          <span class="pf-title">${e.title}</span>
          <div class="pf-tags">${renderTags(e.tags)}</div>
        </div>
      </a>
    `
    )
    .join("");
  initDragAndDrop();
}

function saveOrder() {
  const order = Array.from(grid.querySelectorAll<HTMLElement>(".pf-card")).map((el) => el.dataset.slug!);
  saveExperimentOrder(order);
}

let dragEl: HTMLElement | null = null;

function initDragAndDrop() {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>(".pf-card"));
  cards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      dragEl = card;
      requestAnimationFrame(() => card.classList.add("is-dragging"));
      grid.classList.add("is-reordering");
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      dragEl = null;
      grid.classList.remove("is-reordering");
      saveOrder();
    });
    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (!dragEl || dragEl === card) return;
      const rect = card.getBoundingClientRect();
      const before = e.clientX < rect.left + rect.width / 2;
      grid.insertBefore(dragEl, before ? card : card.nextSibling);
    });
  });
}

render();

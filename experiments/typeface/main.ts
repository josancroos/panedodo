import { renderNav } from "../../src/nav";
import "../../src/style.css";
import "./typeface.css";

document.body.classList.add("pf-page");
renderNav("/", "typeface");

const stage = document.getElementById("tf-stage")!;
const specimen = document.getElementById("tf-specimen")!;

const weightSeg = document.getElementById("tf-weight-seg")!;
const weightSlider = document.getElementById("tf-weight-slider") as HTMLInputElement;
const weightValue = document.getElementById("tf-weight-value")!;

const fitToggle = document.getElementById("tf-fit-toggle") as HTMLButtonElement;
const sizeSlider = document.getElementById("tf-size-slider") as HTMLInputElement;
const sizeValue = document.getElementById("tf-size-value")!;

const trackingSlider = document.getElementById("tf-tracking-slider") as HTMLInputElement;
const trackingValue = document.getElementById("tf-tracking-value")!;

const caseSeg = document.getElementById("tf-case-seg")!;
const invertToggle = document.getElementById("tf-invert-toggle") as HTMLButtonElement;
const resetToggle = document.getElementById("tf-reset-toggle") as HTMLButtonElement;

const waterfall = document.getElementById("tf-waterfall")!;
const WATERFALL_SIZES = [160, 120, 90, 68, 50, 36, 26];

const paragraph = document.getElementById("tf-paragraph")!;
const paragraphSizeSlider = document.getElementById("tf-paragraph-size") as HTMLInputElement;
const paragraphSizeValue = document.getElementById("tf-paragraph-size-value")!;

paragraphSizeSlider.addEventListener("input", () => {
  paragraph.style.fontSize = `${paragraphSizeSlider.value}px`;
  paragraphSizeValue.textContent = `${paragraphSizeSlider.value}px`;
});

const FULL_CHARSET =
  `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~` +
  `¡¢£¤¥§¨©ª«¬­®°±²³´µ¶·¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ` +
  `ĀāĂăĆćČčĎďĒēĖėĚěĞğİıŁłŃńŇňŐőŒœŔŕŘřŚśŠšŤťŪūŮůŰűŸŹźŻżŽžẞ` +
  `–—‘’‚“”„†‡•…‰‹›€™−≠≤≥`;

function sortGlyphs(chars: string[]) {
  const letters: string[] = [];
  const digits: string[] = [];
  const symbols: string[] = [];
  chars.forEach((char) => {
    if (/\p{L}/u.test(char)) letters.push(char);
    else if (/\d/.test(char)) digits.push(char);
    else symbols.push(char);
  });
  return [...letters, ...digits, ...symbols];
}

const glyphsContainer = document.getElementById("tf-glyphs")!;
const glyphPreview = document.getElementById("tf-glyph-preview")!;
sortGlyphs(Array.from(new Set(FULL_CHARSET))).forEach((char) => {
  const cell = document.createElement("span");
  cell.className = "tf-glyph";
  cell.textContent = char;
  cell.addEventListener("mouseenter", () => {
    glyphPreview.textContent = char;
  });
  glyphsContainer.appendChild(cell);
});
glyphsContainer.addEventListener("mouseleave", () => {
  glyphPreview.textContent = "Aa";
});

const waterfallRows = WATERFALL_SIZES.map((size) => {
  const row = document.createElement("div");
  row.className = "tf-waterfall-row";
  row.innerHTML = `<span class="tf-waterfall-size">${size}</span><span class="tf-waterfall-text" style="font-size:${size}px"></span>`;
  waterfall.appendChild(row);
  return row.querySelector<HTMLElement>(".tf-waterfall-text")!;
});

let weight = 800;
let tracking = -0.01;
let fitEnabled = true;

function currentText() {
  return specimen.textContent?.trim() ? specimen.textContent : specimen.dataset.placeholder || "";
}

function fitToWidth() {
  if (!fitEnabled) return;
  specimen.style.whiteSpace = "nowrap";
  const containerWidth = specimen.clientWidth;
  specimen.style.fontSize = "100px";
  specimen.style.width = "max-content";
  const measuredWidth = specimen.scrollWidth || 1;
  specimen.style.width = "100%";
  const ratio = containerWidth / measuredWidth;
  const nextSize = Math.max(24, Math.min(400, Math.round(100 * ratio)));
  specimen.style.fontSize = `${nextSize}px`;
  sizeSlider.value = String(Math.min(260, nextSize));
  sizeValue.textContent = `${nextSize}px`;
}

function render() {
  specimen.style.fontVariationSettings = `"wght" ${weight}`;
  specimen.style.letterSpacing = `${tracking}em`;
  weightValue.textContent = String(weight);
  trackingValue.textContent = `${tracking}em`;

  const text = currentText();
  waterfallRows.forEach((row) => {
    row.textContent = text;
    row.style.fontVariationSettings = `"wght" ${weight}`;
    row.style.letterSpacing = `${tracking}em`;
  });

  if (fitEnabled) {
    fitToWidth();
  }
}

specimen.addEventListener("input", render);
window.addEventListener("resize", () => fitEnabled && fitToWidth());

weightSlider.addEventListener("input", () => {
  weight = Number(weightSlider.value);
  weightSeg
    .querySelectorAll<HTMLButtonElement>("button")
    .forEach((btn) => btn.classList.toggle("is-active", Number(btn.dataset.weight) === weight));
  render();
});

weightSeg.querySelectorAll<HTMLButtonElement>("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    weight = Number(btn.dataset.weight);
    weightSlider.value = String(weight);
    weightSeg.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    render();
  });
});

trackingSlider.addEventListener("input", () => {
  tracking = Number(trackingSlider.value);
  render();
});

fitToggle.addEventListener("click", () => {
  fitEnabled = !fitEnabled;
  fitToggle.classList.toggle("is-active", fitEnabled);
  if (!fitEnabled) {
    specimen.style.whiteSpace = "pre-wrap";
    specimen.style.fontSize = `${sizeSlider.value}px`;
    sizeValue.textContent = `${sizeSlider.value}px`;
  } else {
    render();
  }
});

sizeSlider.addEventListener("input", () => {
  fitEnabled = false;
  fitToggle.classList.remove("is-active");
  specimen.style.whiteSpace = "pre-wrap";
  specimen.style.fontSize = `${sizeSlider.value}px`;
  sizeValue.textContent = `${sizeSlider.value}px`;
});

caseSeg.querySelectorAll<HTMLButtonElement>("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    stage.dataset.case = btn.dataset.case!;
    waterfall.dataset.case = btn.dataset.case!;
    caseSeg.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  });
});

invertToggle.addEventListener("click", () => {
  stage.classList.toggle("is-inverted");
  invertToggle.classList.toggle("is-active");
});

resetToggle.addEventListener("click", () => {
  weight = 800;
  tracking = -0.01;
  fitEnabled = true;

  weightSlider.value = "800";
  weightSeg
    .querySelectorAll<HTMLButtonElement>("button")
    .forEach((btn) => btn.classList.toggle("is-active", btn.dataset.weight === "800"));

  trackingSlider.value = "-0.01";

  fitToggle.classList.add("is-active");

  caseSeg.querySelectorAll<HTMLButtonElement>("button").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.case === "as-typed");
  });
  stage.dataset.case = "as-typed";
  waterfall.dataset.case = "as-typed";

  stage.classList.remove("is-inverted");
  invertToggle.classList.remove("is-active");

  specimen.textContent = specimen.dataset.placeholder || "";

  paragraphSizeSlider.value = "22";
  paragraph.style.fontSize = "22px";
  paragraphSizeValue.textContent = "22px";

  render();
});

render();
document.fonts?.ready.then(render);

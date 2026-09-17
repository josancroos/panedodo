import { Pane } from "tweakpane";
import { renderNav } from "../../src/nav";
import { initMagnetic } from "../../src/cursor";
import "../../src/style.css";
import "./cursor-demo.css";

renderNav("/", "cursor");
initMagnetic();

const root = document.documentElement.style;

const params = {
  dotSize: 6,
  ringSize: 40,
  ringHoverSize: 56,
  dotColor: "#f4f3ef",
  ringColor: "#f4f3ef",
};

function apply() {
  root.setProperty("--cursor-dot-size", `${params.dotSize}px`);
  root.setProperty("--cursor-ring-size", `${params.ringSize}px`);
  root.setProperty("--cursor-ring-hover-size", `${params.ringHoverSize}px`);
  root.setProperty("--cursor-dot-color", params.dotColor);
  root.setProperty("--cursor-ring-color", params.ringColor);
}
apply();

const pane = new Pane({ container: document.getElementById("panel-host")!, title: "Cursor" });
pane.addBinding(params, "dotSize", { min: 2, max: 16, step: 1 }).on("change", apply);
pane.addBinding(params, "ringSize", { min: 20, max: 80, step: 1 }).on("change", apply);
pane.addBinding(params, "ringHoverSize", { min: 30, max: 120, step: 1 }).on("change", apply);
pane.addBinding(params, "dotColor").on("change", apply);
pane.addBinding(params, "ringColor").on("change", apply);

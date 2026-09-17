import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Body,
  Events,
} from "matter-js";
import { renderNav } from "../../src/nav";
import "../../src/style.css";

renderNav("/", "type-gravity");

const container = document.querySelector<HTMLDivElement>(".experiment")!;

const engine = Engine.create();
const render = Render.create({
  element: container,
  engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
  },
});
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

const ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight + 30,
  window.innerWidth * 2,
  60,
  { isStatic: true, render: { visible: false } }
);
const leftWall = Bodies.rectangle(-30, window.innerHeight / 2, 60, window.innerHeight * 2, {
  isStatic: true,
  render: { visible: false },
});
const rightWall = Bodies.rectangle(
  window.innerWidth + 30,
  window.innerHeight / 2,
  60,
  window.innerHeight * 2,
  { isStatic: true, render: { visible: false } }
);
Composite.add(engine.world, [ground, leftWall, rightWall]);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: 0.2, render: { visible: false } },
});
Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;

const FONT_SIZE = 120;
const letterBodies: Body[] = [];

function measureLetter(ctx: CanvasRenderingContext2D, ch: string) {
  const metrics = ctx.measureText(ch);
  return Math.max(metrics.width, FONT_SIZE * 0.5);
}

function dropText(text: string) {
  Composite.remove(engine.world, letterBodies);
  letterBodies.length = 0;

  const measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d")!;
  ctx.font = `700 ${FONT_SIZE}px "Helvetica Neue", Arial, sans-serif`;

  const chars = text.split("");
  const widths = chars.map((c) => measureLetter(ctx, c));
  const totalWidth = widths.reduce((a, b) => a + b + 8, 0);
  let x = window.innerWidth / 2 - totalWidth / 2;

  chars.forEach((ch, i) => {
    const w = widths[i];
    if (ch.trim() === "") {
      x += w + 8;
      return;
    }
    const body = Bodies.rectangle(x + w / 2, -100 - i * 40, w * 0.9, FONT_SIZE * 0.9, {
      restitution: 0.3,
      friction: 0.4,
      render: {
        fillStyle: "#ff4d2e",
      },
      label: ch,
      angle: (Math.random() - 0.5) * 0.6,
    });
    letterBodies.push(body);
    x += w + 8;
  });

  Composite.add(engine.world, letterBodies);
}

Events.on(render, "afterRender", () => {
  const ctx = render.context;
  ctx.save();
  ctx.font = `700 ${FONT_SIZE}px "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = "#0b0b0d";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const body of letterBodies) {
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    ctx.fillText(body.label, 0, 4);
    ctx.restore();
  }
  ctx.restore();
});

document.getElementById("drop-btn")!.addEventListener("click", () => {
  const val = (document.getElementById("text-input") as HTMLInputElement).value || "PANEDODO";
  dropText(val);
});

window.addEventListener("resize", () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 30 });
  Body.setPosition(rightWall, { x: window.innerWidth + 30, y: window.innerHeight / 2 });
});

dropText("PANEDODO");

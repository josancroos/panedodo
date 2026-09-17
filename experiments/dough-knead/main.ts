import {
  Engine,
  Runner,
  Bodies,
  Body,
  Composite,
  Composites,
  Constraint,
  Mouse,
  MouseConstraint,
  Events,
} from "matter-js";
import { Pane } from "tweakpane";
import { renderNav } from "../../src/nav";
import "../../src/style.css";
import "./dough.css";

renderNav("/", "dough-knead");

const canvas = document.getElementById("dough-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const gooBlurEl = document.querySelector<SVGFEGaussianBlurElement>("#goo feGaussianBlur")!;
const gooMatrixEl = document.querySelector<SVGFEColorMatrixElement>("#goo feColorMatrix")!;

const params = {
  bg: "#6e6ec4",
  doughColor: "#e9d9b8",
  cols: 7,
  rows: 4,
  spacing: 40,
  radius: 34,
  stiffness: 0.4,
  damping: 0.25,
  restitution: 0.1,
  frictionAir: 0.08,
  gravity: 0,
  anchorStiffness: 0.06,
  mouseStiffness: 0.5,
  idleJitter: 0,
  gooBlur: 12,
  gooThreshold: -10,
};

const engine = Engine.create();
engine.gravity.y = params.gravity;
const world = engine.world;
const runner = Runner.create();
Runner.run(runner, engine);

let ground: Body, leftWall: Body, rightWall: Body, topWall: Body;
function makeWalls() {
  if (ground) Composite.remove(world, [ground, leftWall, rightWall, topWall]);
  const t = 80;
  ground = Bodies.rectangle(innerWidth / 2, innerHeight + t / 2, innerWidth * 2, t, {
    isStatic: true,
    render: { visible: false },
  });
  topWall = Bodies.rectangle(innerWidth / 2, -t / 2, innerWidth * 2, t, {
    isStatic: true,
    render: { visible: false },
  });
  leftWall = Bodies.rectangle(-t / 2, innerHeight / 2, t, innerHeight * 2, {
    isStatic: true,
    render: { visible: false },
  });
  rightWall = Bodies.rectangle(innerWidth + t / 2, innerHeight / 2, t, innerHeight * 2, {
    isStatic: true,
    render: { visible: false },
  });
  Composite.add(world, [ground, topWall, leftWall, rightWall]);
}

const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: { stiffness: params.mouseStiffness, damping: 0.1, render: { visible: false } },
});
Composite.add(world, mouseConstraint);

let dynamicComposite = Composite.create();
let currentBodies: Body[] = [];
let currentConstraints: Constraint[] = [];
let anchor: Constraint;

function buildSoftBody() {
  const w = (params.cols - 1) * params.spacing;
  const h = (params.rows - 1) * params.spacing;
  const startX = innerWidth / 2 - w / 2;
  const startY = innerHeight / 2 - h / 2;

  const group = Body.nextGroup(true);
  const soft = Composites.softBody(
    startX,
    startY,
    params.cols,
    params.rows,
    0,
    0,
    true,
    params.radius,
    {
      friction: 0.6,
      frictionAir: params.frictionAir,
      restitution: params.restitution,
      collisionFilter: { group },
      render: { visible: false },
    },
    {
      stiffness: params.stiffness,
      damping: params.damping,
      render: { visible: false },
    }
  );

  const centerBody =
    soft.bodies[
      Math.floor(params.rows / 2) * params.cols + Math.floor(params.cols / 2)
    ];

  anchor = Constraint.create({
    pointA: { x: innerWidth / 2, y: innerHeight / 2 },
    bodyB: centerBody,
    stiffness: params.anchorStiffness,
    damping: 0.2,
    length: 0,
    render: { visible: false },
  });

  dynamicComposite = Composite.create();
  Composite.add(dynamicComposite, [soft, anchor]);
  Composite.add(world, dynamicComposite);
  currentBodies = soft.bodies;
  currentConstraints = soft.constraints;
}

function rebuild() {
  Composite.remove(world, dynamicComposite);
  buildSoftBody();
}

function applyPhysicsParams() {
  engine.gravity.y = params.gravity;
  mouseConstraint.constraint.stiffness = params.mouseStiffness;
  if (anchor) anchor.stiffness = params.anchorStiffness;
  for (const comp of dynamicComposite.composites) {
    for (const c of comp.constraints) {
      c.stiffness = params.stiffness;
      c.damping = params.damping;
    }
    for (const b of comp.bodies) {
      b.frictionAir = params.frictionAir;
      b.restitution = params.restitution;
    }
  }
}

function applyLookParams() {
  document.documentElement.style.setProperty("--dough-bg", params.bg);
  gooBlurEl.setAttribute("stdDeviation", String(params.gooBlur));
  gooMatrixEl.setAttribute(
    "values",
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 ${params.gooThreshold}`
  );
}

makeWalls();
buildSoftBody();
applyLookParams();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = params.doughColor;
  ctx.lineCap = "round";
  for (const c of currentConstraints) {
    const a = c.bodyA!.position;
    const b = c.bodyB!.position;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const restLen = c.length || dist;
    const stretch = Math.max(dist / restLen, 0.001);
    const width = Math.max(6, (params.radius * 2) / Math.sqrt(stretch));
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.fillStyle = params.doughColor;
  for (const body of currentBodies) {
    const r = (body as any).circleRadius as number;
    ctx.beginPath();
    ctx.arc(body.position.x, body.position.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

Events.on(engine, "beforeUpdate", () => {
  if (params.idleJitter <= 0) return;
  const mag = params.idleJitter * 0.0006;
  for (const body of currentBodies) {
    if (mouseConstraint.body === body) continue;
    Body.applyForce(body, body.position, {
      x: (Math.random() - 0.5) * mag,
      y: (Math.random() - 0.5) * mag,
    });
  }
});

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  makeWalls();
}
window.addEventListener("resize", resize);
resize();

const pane = new Pane({
  container: document.getElementById("panel-host")!,
  title: "Dough Knead",
});

const gridFolder = pane.addFolder({ title: "Grid" });
gridFolder.addBinding(params, "cols", { min: 3, max: 14, step: 1 }).on("change", rebuild);
gridFolder.addBinding(params, "rows", { min: 2, max: 10, step: 1 }).on("change", rebuild);
gridFolder.addBinding(params, "spacing", { min: 20, max: 90, step: 1 }).on("change", rebuild);
gridFolder.addBinding(params, "radius", { min: 10, max: 60, step: 1 }).on("change", rebuild);

const physicsFolder = pane.addFolder({ title: "Physics" });
physicsFolder
  .addBinding(params, "stiffness", { min: 0.01, max: 1, step: 0.01 })
  .on("change", applyPhysicsParams);
physicsFolder
  .addBinding(params, "damping", { min: 0, max: 1, step: 0.01 })
  .on("change", applyPhysicsParams);
physicsFolder
  .addBinding(params, "frictionAir", { min: 0, max: 0.3, step: 0.005 })
  .on("change", applyPhysicsParams);
physicsFolder
  .addBinding(params, "restitution", { min: 0, max: 1, step: 0.01 })
  .on("change", applyPhysicsParams);
physicsFolder
  .addBinding(params, "anchorStiffness", { min: 0, max: 0.2, step: 0.001 })
  .on("change", applyPhysicsParams);
physicsFolder
  .addBinding(params, "mouseStiffness", { min: 0.02, max: 1, step: 0.01 })
  .on("change", applyPhysicsParams);
physicsFolder
  .addBinding(params, "gravity", { min: 0, max: 2, step: 0.01 })
  .on("change", applyPhysicsParams);
physicsFolder.addBinding(params, "idleJitter", { min: 0, max: 5, step: 0.1 });

const lookFolder = pane.addFolder({ title: "Look" });
lookFolder.addBinding(params, "bg").on("change", applyLookParams);
lookFolder.addBinding(params, "doughColor").on("change", applyLookParams);
lookFolder.addBinding(params, "gooBlur", { min: 2, max: 30, step: 1 }).on("change", applyLookParams);
lookFolder
  .addBinding(params, "gooThreshold", { min: -20, max: -2, step: 0.5 })
  .on("change", applyLookParams);

pane.addButton({ title: "Reset shape" }).on("click", rebuild);

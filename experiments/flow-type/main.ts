import p5 from "p5";
import { renderNav } from "../../src/nav";
import "../../src/style.css";

renderNav("/", "flow-type");

const container = document.querySelector<HTMLDivElement>(".experiment")!;
const input = document.getElementById("text-input") as HTMLInputElement;

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
}

const sketch = (p: p5) => {
  let particles: Particle[] = [];
  let text = "PANEDODO";
  const noiseScale = 0.006;
  const particleCount = 6000;

  function samplePoints(str: string): { x: number; y: number }[] {
    const buf = p.createGraphics(p.windowWidth, p.windowHeight);
    buf.pixelDensity(1);
    buf.background(0);
    buf.fill(255);
    buf.textAlign(p.CENTER, p.CENTER);
    buf.textStyle(p.BOLD);
    buf.textFont("Helvetica Neue, Arial, sans-serif");
    buf.textSize(Math.min(220, (p.windowWidth * 0.9) / (str.length * 0.6)));
    buf.text(str, p.windowWidth / 2, p.windowHeight / 2);
    buf.loadPixels();

    const points: { x: number; y: number }[] = [];
    const step = 3;
    for (let y = 0; y < buf.height; y += step) {
      for (let x = 0; x < buf.width; x += step) {
        const idx = (x + y * buf.width) * 4;
        if (buf.pixels[idx] > 128) points.push({ x, y });
      }
    }
    buf.remove();
    return points;
  }

  function seedParticles(str: string) {
    const points = samplePoints(str);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      const pt = points.length
        ? points[Math.floor(p.random(points.length))]
        : { x: p.random(p.windowWidth), y: p.random(p.windowHeight) };
      particles.push({
        x: p.random(p.windowWidth),
        y: p.random(p.windowHeight),
        homeX: pt.x,
        homeY: pt.y,
        vx: 0,
        vy: 0,
      });
    }
  }

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent(container);
    p.background(11, 11, 13);
    seedParticles(text);
  };

  p.draw = () => {
    p.noStroke();
    p.fill(11, 11, 13, 30);
    p.rect(0, 0, p.width, p.height);

    p.fill(255, 77, 46, 200);
    for (const particle of particles) {
      const angle =
        p.noise(particle.x * noiseScale, particle.y * noiseScale, p.frameCount * 0.003) *
        p.TWO_PI *
        2;
      const flowX = Math.cos(angle) * 0.6;
      const flowY = Math.sin(angle) * 0.6;

      const pullX = (particle.homeX - particle.x) * 0.01;
      const pullY = (particle.homeY - particle.y) * 0.01;

      particle.vx = particle.vx * 0.9 + flowX + pullX;
      particle.vy = particle.vy * 0.9 + flowY + pullY;
      particle.x += particle.vx;
      particle.y += particle.vy;

      p.circle(particle.x, particle.y, 2.2);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(11, 11, 13);
    seedParticles(text);
  };

  input.addEventListener("input", () => {
    text = input.value || "PANEDODO";
    p.background(11, 11, 13);
    seedParticles(text);
  });
};

new p5(sketch);

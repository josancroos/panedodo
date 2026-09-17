import * as THREE from "three";
import { renderNav } from "../../src/nav";
import "../../src/style.css";

renderNav("/", "webgl-distort");

const container = document.querySelector<HTMLDivElement>(".experiment")!;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.prepend(renderer.domElement);

const textCanvas = document.createElement("canvas");
textCanvas.width = 2048;
textCanvas.height = 512;
const ctx = textCanvas.getContext("2d")!;

function drawText(text: string) {
  ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
  ctx.fillStyle = "#0b0b0d";
  ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
  ctx.fillStyle = "#f4f3ef";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 220px "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);
  texture.needsUpdate = true;
}

const texture = new THREE.CanvasTexture(textCanvas);

const geometry = new THREE.PlaneGeometry(4.5, 1.1, 200, 50);

const uniforms = {
  uTexture: { value: texture },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector2(0, 0) },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  transparent: true,
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;

      float wave = sin(pos.x * 3.0 + uTime * 1.4) * 0.06;
      wave += sin(pos.y * 6.0 + uTime * 2.0) * 0.03;

      float dist = distance(uv, uMouse);
      float ripple = smoothstep(0.4, 0.0, dist) * 0.35;

      pos.z += wave + ripple;
      pos.x += sin(uTime * 0.6 + pos.y * 4.0) * ripple * 0.5;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = color;
    }
  `,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("pointermove", (e) => {
  uniforms.uMouse.value.set(
    e.clientX / window.innerWidth,
    1 - e.clientY / window.innerHeight
  );
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const input = document.getElementById("text-input") as HTMLInputElement;
input.addEventListener("input", () => drawText(input.value || "PANEDODO"));

drawText("PANEDODO");

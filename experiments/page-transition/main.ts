import { renderNav } from "../../src/nav";
import { initMagnetic } from "../../src/cursor";
import { gsap } from "../../src/smoothScroll";
import "../../src/style.css";
import "./transition.css";

renderNav("/", "page-transition");
initMagnetic();

const overlay = document.getElementById("pt-overlay")!;
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>(".pt-tab"));
const views = Array.from(document.querySelectorAll<HTMLElement>(".pt-view"));

let current = "home";
let animating = false;

function animateIn(view: HTMLElement) {
  const items = view.querySelectorAll(".pt-eyebrow, .pt-title, .pt-text, .pt-card");
  gsap.set(items, { opacity: 0, y: 20 });
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "expo.out",
    stagger: 0.08,
    delay: 0.05,
  });
}

function goTo(target: string, originX: number, originY: number) {
  if (animating || target === current) return;
  animating = true;

  const tl = gsap.timeline({
    onComplete: () => {
      animating = false;
    },
  });

  tl.set(overlay, {
    clipPath: `circle(0% at ${originX}px ${originY}px)`,
    autoAlpha: 1,
  })
    .to(overlay, {
      clipPath: `circle(150% at ${originX}px ${originY}px)`,
      duration: 0.85,
      ease: "power3.inOut",
    })
    .call(() => {
      views.forEach((v) => {
        const isTarget = v.dataset.view === target;
        v.hidden = !isTarget;
        if (isTarget) animateIn(v);
      });
      tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.view === target));
      current = target;
    })
    .to(overlay, {
      clipPath: `circle(0% at ${originX}px ${originY}px)`,
      duration: 0.75,
      ease: "power3.inOut",
      delay: 0.25,
    })
    .set(overlay, { autoAlpha: 0 });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const target = tab.dataset.view!;
    goTo(target, e.clientX, e.clientY);
  });
});

animateIn(document.querySelector('.pt-view[data-view="home"]')!);

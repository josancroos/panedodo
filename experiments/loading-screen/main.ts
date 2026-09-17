import { renderNav } from "../../src/nav";
import { initMagnetic } from "../../src/cursor";
import { gsap } from "../../src/smoothScroll";
import "../../src/style.css";
import "./loading.css";

const loader = document.getElementById("ls-loader")!;
const word = document.getElementById("ls-word")!;
const meta = document.querySelector(".ls-meta")!;
const countEl = document.getElementById("ls-count")!;
const fill = document.getElementById("ls-bar-fill")!;
const bars = Array.from(document.querySelectorAll(".ls-bar"));

let navRendered = false;

function playLoader() {
  document.body.style.overflow = "hidden";
  gsap.set(loader, { display: "block", autoAlpha: 1 });
  gsap.set(bars, { scaleY: 1 });
  gsap.set(word, { opacity: 0, y: 24 });
  gsap.set(meta, { opacity: 0 });
  fill.style.width = "0%";
  countEl.textContent = "00";

  const progress = { value: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = "";
      if (!navRendered) {
        navRendered = true;
        renderNav("/", "loading-screen");
        initMagnetic();
      }
    },
  });

  tl.to(word, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" })
    .to(meta, { opacity: 1, duration: 0.5, ease: "expo.out" }, "-=0.4")
    .to(
      progress,
      {
        value: 100,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: () => {
          const v = Math.round(progress.value);
          countEl.textContent = String(v).padStart(2, "0");
          fill.style.width = `${v}%`;
        },
      },
      "-=0.2"
    )
    .to(word, { scale: 0.92, opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.15")
    .to(meta, { opacity: 0, duration: 0.3, ease: "power2.in" }, "<")
    .to(
      bars,
      {
        scaleY: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "expo.out",
      },
      "-=0.1"
    )
    .set(loader, { autoAlpha: 0 });
}

document.getElementById("ls-replay")!.addEventListener("click", playLoader);

playLoader();

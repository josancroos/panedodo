import { renderNav } from "../../src/nav";
import { initSmoothScroll, gsap, ScrollTrigger } from "../../src/smoothScroll";
import "../../src/style.css";
import "./hero-type.css";

renderNav("/", "hero-type");
initSmoothScroll();

function splitChars(el: Element) {
  const text = el.textContent || "";
  el.innerHTML = text
    .split("")
    .map((ch) => `<span>${ch === " " ? "&nbsp;" : ch}</span>`)
    .join("");
  return Array.from(el.querySelectorAll("span"));
}

const lineEls = document.querySelectorAll(".ht-headline .ht-line");
const chars = Array.from(lineEls).flatMap((line) => splitChars(line));

const eyebrow = document.querySelector(".ht-eyebrow");
const sub = document.querySelector(".ht-sub");
const hint = document.querySelector(".ht-scroll-hint");

gsap.set(chars, { yPercent: 110 });
gsap.set([eyebrow, sub, hint], { opacity: 0, y: 12 });

gsap
  .timeline({ defaults: { ease: "expo.out" } })
  .to(chars, { yPercent: 0, duration: 1.1, stagger: 0.035 })
  .to(eyebrow, { opacity: 1, y: 0, duration: 0.6 }, "-=0.75")
  .to(sub, { opacity: 1, y: 0, duration: 0.6 }, "-=0.55")
  .to(hint, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");

gsap.timeline({
  scrollTrigger: {
    trigger: "#ht-hero",
    start: "top top",
    end: "+=90%",
    scrub: 1,
    pin: true,
  },
  defaults: { ease: "power2.in" },
}).to(chars, {
  x: (i) => (i - chars.length / 2) * 44,
  y: (i) => Math.abs(i - chars.length / 2) * 20,
  opacity: 0,
  scale: 0.75,
  stagger: 0.015,
}, 0)
  .to([eyebrow, sub, hint], { opacity: 0, y: -20 }, 0);

gsap.utils.toArray<HTMLElement>(".ht-spec-row").forEach((row) => {
  gsap.from(row, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: { trigger: row, start: "top 85%" },
  });
});

const playWord = document.getElementById("ht-play-word");
if (playWord) {
  const letters = Array.from(playWord.querySelectorAll<HTMLElement>("span"));
  playWord.addEventListener("mousemove", (e) => {
    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - center);
      const weight = Math.max(200, 800 - dist * 3.2);
      letter.style.fontVariationSettings = `"wght" ${weight}`;
    });
  });
  playWord.addEventListener("mouseleave", () => {
    letters.forEach((letter) => {
      letter.style.fontVariationSettings = `"wght" 300`;
    });
  });
}

ScrollTrigger.refresh();

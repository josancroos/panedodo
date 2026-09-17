import { renderNav } from "../../src/nav";
import { initSmoothScroll, gsap, ScrollTrigger } from "../../src/smoothScroll";
import "../../src/style.css";
import "./scroll-sections.css";

renderNav("/", "scroll-sections");
initSmoothScroll();

gsap.from(".ss-eyebrow, .ss-headline, .ss-scroll-hint", {
  opacity: 0,
  y: 20,
  duration: 0.9,
  ease: "expo.out",
  stagger: 0.12,
});

gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
  const speed = Number(el.dataset.speed) || 0.2;
  const section = el.closest("section") as HTMLElement;
  gsap.to(el, {
    yPercent: speed * -40,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

gsap.from(".ss-quote", {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: "expo.out",
  scrollTrigger: { trigger: ".ss-statement", start: "top 70%" },
});

gsap.from(".ss-gallery-card", {
  opacity: 0,
  y: 60,
  duration: 0.9,
  ease: "expo.out",
  stagger: 0.12,
  scrollTrigger: { trigger: ".ss-gallery-grid", start: "top 80%" },
});

const steps = gsap.utils.toArray<HTMLElement>(".ss-step");
const dots = gsap.utils.toArray<HTMLElement>(".ss-dot");

ScrollTrigger.create({
  trigger: "#ss-process",
  start: "top top",
  end: "+=200%",
  scrub: 1,
  pin: true,
  onUpdate: (self) => {
    const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
    steps.forEach((s, i) => {
      s.style.opacity = i === idx ? "1" : "0";
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  },
});

gsap.utils.toArray<HTMLElement>(".ss-stat-num").forEach((el) => {
  const target = Number(el.dataset.count) || 0;
  const proxy = { value: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(proxy, {
        value: target,
        duration: 1.6,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = String(Math.round(proxy.value));
        },
      });
    },
  });
});

gsap.from(".ss-close-title, .ss-close-link", {
  opacity: 0,
  y: 30,
  duration: 0.9,
  ease: "expo.out",
  stagger: 0.1,
  scrollTrigger: { trigger: ".ss-close", start: "top 75%" },
});

ScrollTrigger.refresh();

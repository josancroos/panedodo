export function initCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.body.classList.add("has-custom-cursor");

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const label = document.createElement("span");
  label.className = "cursor-label";
  ring.appendChild(label);
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let visible = false;

  window.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    if (!visible) {
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }
  });

  window.addEventListener("pointerleave", () => {
    visible = false;
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function bindHoverTargets() {
    document.querySelectorAll<HTMLElement>("a, button, [data-cursor]").forEach((el) => {
      if ((el as any).__cursorBound) return;
      (el as any).__cursorBound = true;
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-hover");
        const text = el.getAttribute("data-cursor-text");
        label.textContent = text || "";
        if (text) ring.classList.add("has-label");
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-hover", "has-label");
        label.textContent = "";
      });
    });
  }
  bindHoverTargets();
  new MutationObserver(bindHoverTargets).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function initMagnetic(selector = "[data-magnetic]") {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    const strength = Number(el.dataset.magneticStrength) || 0.35;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${relX * strength}px, ${relY * strength}px, 0)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate3d(0, 0, 0)";
    });
  });
}

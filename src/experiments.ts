export interface Experiment {
  slug: string;
  title: string;
  tags: string[];
  preview?: {
    type: "image" | "video";
    src: string;
  };
}

export const experiments: Experiment[] = [
  {
    slug: "type-gravity",
    title: "Type Gravity",
    tags: ["matter.js", "physics", "type"],
  },
  {
    slug: "webgl-distort",
    title: "WebGL Distort",
    tags: ["three.js", "webgl", "shader", "type"],
  },
  {
    slug: "flow-type",
    title: "Flow Type",
    tags: ["p5.js", "flow field", "particles", "type"],
  },
  {
    slug: "dough-knead",
    title: "Dough Knead",
    tags: ["matter.js", "softbody", "goo", "tweakpane"],
  },
  {
    slug: "hero-type",
    title: "Hero Type",
    tags: ["typography", "gsap", "scale", "scroll"],
  },
  {
    slug: "loading-screen",
    title: "Loading Screen",
    tags: ["gsap", "choreography", "intro"],
  },
  {
    slug: "scroll-sections",
    title: "Scroll Sections",
    tags: ["lenis", "gsap", "scrolltrigger", "parallax"],
  },
  {
    slug: "page-transition",
    title: "Page Transition",
    tags: ["gsap", "transition", "wipe"],
  },
  {
    slug: "cursor",
    title: "Cursor",
    tags: ["interaction", "magnetic", "craft"],
  },
];

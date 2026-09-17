export interface Experiment {
  slug: string;
  title: string;
  tags: string[];
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
];

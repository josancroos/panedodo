import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync } from "fs";

const rootDir = import.meta.dirname;
const experimentsDir = resolve(rootDir, "experiments");
const experimentEntries = Object.fromEntries(
  readdirSync(experimentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => [
      `experiments/${d.name}`,
      resolve(experimentsDir, d.name, "index.html"),
    ])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        ...experimentEntries,
      },
    },
  },
});

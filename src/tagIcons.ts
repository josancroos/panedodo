const stroke = (inner: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const tagIcons: Record<string, string> = {
  "matter.js": stroke('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>'),
  "three.js": stroke('<path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z"/><path d="M12 3v18"/><path d="M4 7.5 12 12l8-4.5"/>'),
  webgl: stroke('<path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z"/><path d="M12 3v18"/><path d="M4 7.5 12 12l8-4.5"/>'),
  "p5.js": stroke('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>'),
  gsap: stroke('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
  tweakpane: stroke(
    '<line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="currentColor"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="currentColor"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="7" cy="17" r="2" fill="currentColor"/>'
  ),
  lenis: stroke('<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>'),
  shader: stroke('<path d="M12 2 13.8 8.2 20 10 13.8 11.8 12 18 10.2 11.8 4 10 10.2 8.2Z"/>'),
  typography: stroke('<path d="M4 6h16"/><path d="M12 6v14"/><path d="M9 20h6"/>'),
};

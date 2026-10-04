import { DARK, FLIP, VIEWBOX, YELLOW } from "./geometry";

export const LOGO_COLORS = { accent: "#FFBE29", dark: "#3A3A3A" } as const;

const flipped = (...paths: string[]) =>
  `<g transform="${FLIP}">${paths.map((d) => `<path d="${d}"/>`).join("")}</g>`;

/** Finished AL BAYED mark (the loader's last frame) as a standalone SVG. */
export function buildStaticLogoSvg({
  accent = LOGO_COLORS.accent,
  dark = LOGO_COLORS.dark,
}: { accent?: string; dark?: string } = {}) {
  const { x, y, width, height } = VIEWBOX;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision">
  <g fill="${dark}">${flipped(DARK.canopy, DARK.lattice, DARK.ringL, DARK.ringR, DARK.B, DARK.A, DARK.Y1, DARK.Y2, DARK.Y3, DARK.E, DARK.D)}</g>
  <g fill="${accent}"><path d="${YELLOW.cart}"/><path d="${YELLOW.A}"/><path d="${YELLOW.L}"/></g>
</svg>`;
}

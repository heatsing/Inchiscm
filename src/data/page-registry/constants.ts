export const SITE_ORIGIN = "https://inchiscm.com";
export const ROUTE_UPDATED_AT = "2026-07-28";
export const SHARED_SOCIAL_IMAGE_PATH = "/icon.png" as const;

// Explicit content revisions: keep untouched URLs on their original date.
const CALCULATOR_REVISED_PATHS = new Set([
  "/inches-to-cm-dimensions", "/cm-to-inches-dimensions", "/common-product-dimensions-in-cm", "/a4-paper-size-in-inches-and-cm", "/inch-to-cm-chart",
  "/screen-size-converter",
  "/screen-aspect-ratio-calculator", "/screen-dimensions-calculator",
  "/tv-dimensions-calculator", "/monitor-dimensions-calculator", "/laptop-screen-size-calculator",
  "/screen-width-calculator", "/screen-height-calculator", "/diagonal-screen-calculator",
  "/resolution-to-ppi-calculator", "/16-9-screen-size-calculator", "/16-10-screen-size-calculator",
  "/21-9-screen-size-calculator", "/4-3-screen-size-calculator", "/tablet-screen-size-calculator",
  "/projector-screen-size-calculator", "/ultrawide-screen-dimensions-calculator",
]);

export function routeUpdatedAt(path: string) {
  return CALCULATOR_REVISED_PATHS.has(path) ? "2026-11-15" : ROUTE_UPDATED_AT;
}
